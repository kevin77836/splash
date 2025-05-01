<template>
    <div class="splash-container">
      <div ref="canvasContainer" class="canvas-container"></div>
    </div>
  </template>
  
  <script setup>
  import * as THREE from 'three';
  import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
  
  // --- Refs ---
  const canvasContainer = ref(null);
  
  // --- 全局常量 ---
  const NUM_SEGMENTS = 50;
  const SUBTRACT = 20;
  
  // --- Three.js 核心組件 ---
  let scene;
  let camera;
  let renderer;
  let controls;
  let effect;
  let clock;
  let materials;
  let pmremGenerator;
  let animationFrameId;
  
  // --- 線條數據 ---
  let lineStartTimes = [];
  let randomDirections = [];
  let currentTargetLengths = [];
  let lineTypes = [];
  let lineFlowState = [];
  
  // --- 流動狀態控制 ---
  let shrinkStartTime = null;
  let shrinkEndTime = null;
  let growStartTime = null;
  let centerBallVisible = false;
  let centerBallFadeStartTime = null;
  let globalFlowState = 'idle';
  
  // --- 動畫參數配置 ---
  const flowParams = {
      centerBall: {
          maxStrength: 1.0,
          minStrength: 0.0,
          fadeDuration: 5.0,
          fadeEasing: {
              type: 'easeIn',
              power: 0.5
          }
      },
      
      timing: {
          baseShrinkDuration: 3.0,
          flowShrinkDurationFactor: 0.2
      },
      
      growth: {
          speed: 5.0,
          easeOutPower: 0.15,
          flowSpeedFactor: 0.1
      },
      
      wave: {
          frequency: 1.0,
          amplitudeFactor: 0.3,
          phaseFactor: Math.PI * 4
      }
  };
  
  // --- 初始化材質 ---
  function createMaterial() {
    return new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 1,
          roughness: 0,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
          envMap: null
    });
  }
  
  // --- 載入環境貼圖 ---
  function loadEnvironmentMap() {
    new EXRLoader()
        .setPath('/hdr/')
        .load('HDR_Light_Studio_Free_HDRI_Design_04.exr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            pmremGenerator.dispose();
            texture.dispose();
  
            console.log("環境貼圖已載入");
            scene.environment = envMap;
            if (materials && materials.liquid) {
                materials.liquid.envMap = envMap;
                materials.liquid.needsUpdate = true;
            }
        }, undefined, (error) => {
            console.error('無法載入環境貼圖:', error);
        });
  }
  
  // --- 更新 Metaball 效果 ---
  function updateMetaball(obj) {
      if (!clock) return;
    
      obj.reset();
      const currentTime = clock.getElapsedTime();
      const centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
      const totalLines = lineTypes.length;
  
    // 更新動畫狀態
    updateAnimationState(currentTime);
  
    // 計算並添加中心球體
          const centerBallStrength = calculateCenterBallStrength(currentTime);
          if (centerBallStrength > 0.01) {
        obj.addBall(centerOffset.x, centerOffset.y, centerOffset.z, centerBallStrength, SUBTRACT);
        centerBallVisible = true;
    } else {
        centerBallVisible = false;
          }

    // 處理線條動畫
      for (let lineIndex = 0; lineIndex < totalLines; lineIndex++) {
        if (!shouldProcessLine(lineIndex, currentTime)) continue;
        
        const localMaxLength = currentTargetLengths[lineIndex] / obj.scale.x;
        const timeSinceStart = currentTime - lineStartTimes[lineIndex];
        const localCurrentLength = calculateLineLength(localMaxLength, timeSinceStart, obj.scale.x);
        
        // 如果線條太短則跳過
        if (localCurrentLength <= 0.001) continue;

        const currentDirection = randomDirections[lineIndex];
        const currentLineType = lineTypes[lineIndex];
        if (!currentDirection || !currentLineType) continue;

        // 添加線條的 metaball 點
        addLineMetaballs(obj, localCurrentLength, currentDirection, currentLineType, centerOffset, currentTime);
    }

    obj.update();
  }
  
  // --- 計算中心球體強度 ---
  function calculateCenterBallStrength(currentTime) {
    if (globalFlowState === 'shrinking') {
        if (shrinkStartTime === null || shrinkEndTime === null) return 0;
        
        const shrinkDuration = shrinkEndTime - shrinkStartTime;
        const timeSinceShrinking = currentTime - shrinkStartTime;
        const shrinkProgress = Math.min(timeSinceShrinking / shrinkDuration, 1.0);
        
        return flowParams.centerBall.minStrength + 
               shrinkProgress * (flowParams.centerBall.maxStrength - flowParams.centerBall.minStrength);
    } 
    else if (globalFlowState === 'pauseAtStart') {
        if (centerBallFadeStartTime === null) {
            centerBallFadeStartTime = currentTime;
            return flowParams.centerBall.maxStrength;
        }
        
        const fadeElapsed = currentTime - centerBallFadeStartTime;
        const fadeProgress = Math.min(fadeElapsed / flowParams.centerBall.fadeDuration, 1.0);
        const easedProgress = applyEasing(fadeProgress, flowParams.centerBall.fadeEasing);
        
        return flowParams.centerBall.maxStrength * (1.0 - easedProgress);
    } 
    
    return flowParams.centerBall.minStrength;
  }
  
  // --- 應用緩動效果 ---
  function applyEasing(progress, easingConfig) {
    switch (easingConfig.type) {
        case 'easeIn':
            return Math.pow(progress, easingConfig.power);
        case 'easeOut':
            return 1 - Math.pow(1 - progress, easingConfig.power);
        default: // linear
            return progress;
    }
  }
  
  // --- 判斷是否需要處理該線條 ---
  function shouldProcessLine(lineIndex, currentTime) {
    return lineStartTimes[lineIndex] !== undefined && 
           currentTime >= lineStartTimes[lineIndex] && 
           currentTargetLengths[lineIndex] !== undefined;
  }
  
  // --- 計算線條當前長度 ---
  function calculateLineLength(maxLength, timeSinceStart, scaleX) {
    if (maxLength <= 0.001) return 0;
    
              switch (globalFlowState) {
              case 'growing':
                          const currentGrowthSpeed = flowParams.growth.speed * flowParams.growth.flowSpeedFactor;
            const linearDuration = maxLength / (currentGrowthSpeed / scaleX);
            const normalizedTime = linearDuration > 0 ? 
                                  Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
                          const easedTime = Math.pow(normalizedTime, flowParams.growth.easeOutPower);
            return easedTime * maxLength;
            
              case 'pauseAtEnd':
            return maxLength;
            
              case 'shrinking':
                      if (shrinkStartTime !== null && shrinkEndTime !== null) {
                const currentTime = clock.getElapsedTime();
                          const shrinkDuration = shrinkEndTime - shrinkStartTime;
                          const timeSinceShrinking = currentTime - shrinkStartTime;
                          const shrinkProgress = Math.min(timeSinceShrinking / shrinkDuration, 1.0);
                return maxLength * (1.0 - shrinkProgress);
                  }
            return maxLength;
            
              case 'pauseAtStart':
            return 0.001;
            
                  default:
            return 0;
    }
              }
              
  // --- 添加線條的 metaball 點 ---
  function addLineMetaballs(obj, length, direction, lineType, centerOffset, currentTime) {
    for (let i = 0; i <= NUM_SEGMENTS; i++) {
        const segmentT = i / NUM_SEGMENTS;
        const strengthFactor = Math.pow(segmentT, lineType === 'tt' ? 0.25 : 1.25);
              const baseStrength = THREE.MathUtils.lerp(
            lineType === 'tt' ? 0.1 : 0.01,
            lineType === 'tt' ? 0.01 : 0.1,
                  strengthFactor
              );
  
        // 計算強度和波浪效果
        let dynamicStrength = calculateSegmentStrength(baseStrength, segmentT, currentTime);
        
        // 計算位置
        const localPos = direction.clone().multiplyScalar(length * segmentT);
              const finalPos = localPos.add(centerOffset);
        
        // 添加球體
        obj.addBall(finalPos.x, finalPos.y, finalPos.z, dynamicStrength, SUBTRACT);
    }
  }
  
  // --- 計算線段強度（含波浪效果）---
  function calculateSegmentStrength(baseStrength, segmentT, currentTime) {
    const flowAmplitude = flowParams.wave.amplitudeFactor * baseStrength;
    const flowOffset = Math.sin(
        currentTime * flowParams.wave.frequency - 
        segmentT * flowParams.wave.phaseFactor
    ) * flowAmplitude;
    
    return Math.max(baseStrength + flowOffset, 0);
  }
  
  // --- 載入模型 JSON ---
  function loadModelJson() {
      fetch('/modelJson.json')
          .then(response => response.json())
          .then(config => {
            console.log("模型設定已載入");
            initializeLineData(config);
            applyModelConfiguration(config);
            startFlowAnimation();
        })
        .catch(error => {
            console.error("載入模型設定失敗:", error);
        });
  }
  
  // --- 初始化線條數據 ---
  function initializeLineData(config) {
              const totalLines = config.lineTypes.length;
              lineStartTimes = new Array(totalLines);
              randomDirections = new Array(totalLines);
              currentTargetLengths = new Array(totalLines);
              lineTypes = new Array(totalLines);
              lineFlowState = new Array(totalLines);
              
              const currentTime = clock?.getElapsedTime() ?? 0;
  
              for (let i = 0; i < totalLines; i++) {
                  lineTypes[i] = config.lineTypes[i];
                  currentTargetLengths[i] = config.currentTargetLengths[i];
        
                  if (config.randomDirections[i]) {
                      randomDirections[i] = new THREE.Vector3(
                          config.randomDirections[i].x,
                          config.randomDirections[i].y,
                          config.randomDirections[i].z
                      );
                  } else {
                      randomDirections[i] = null;
                  }
        
        lineStartTimes[i] = currentTime - 1000; // 確保線條立即可見
                  lineFlowState[i] = 'growing';
              }
  }
  
  // --- 應用模型配置 ---
  function applyModelConfiguration(config) {
    if (!effect || !config.cameraQuaternion) return;
    
                  const exportCameraQuaternion = new THREE.Quaternion(
                      config.cameraQuaternion.x,
                      config.cameraQuaternion.y,
                      config.cameraQuaternion.z,
                      config.cameraQuaternion.w
                  );
                  
                  effect.quaternion.set(0, 0, 0, 1);
                  const cameraInverseQuaternion = exportCameraQuaternion.clone().invert();
          effect.quaternion.premultiply(cameraInverseQuaternion);
                  effect.matrixWorldNeedsUpdate = true;
                  effect.updateMatrixWorld(true);
                  effect.matrixAutoUpdate = false;
              }
  
  // --- 更新動畫狀態 ---
  function updateAnimationState(currentTime) {
    // 檢查線條生長完成情況
    if (globalFlowState === 'growing' && growStartTime !== null) {
        const averageProgress = calculateAverageGrowthProgress(currentTime);
        
        if (averageProgress >= 0.99) {
            globalFlowState = 'pauseAtEnd';
            console.log("線條生長完成，進入暫停狀態");
            
            // 延遲後開始收縮
            setTimeout(startShrinking, 1000);
        }
    } 
    // 檢查線條收縮完成情況
    else if (globalFlowState === 'shrinking' && shrinkStartTime !== null && shrinkEndTime !== null) {
        if (currentTime >= shrinkEndTime) {
            globalFlowState = 'pauseAtStart';
            console.log("線條收縮完成，進入起始暫停狀態");
            
            // 延遲後開始生長
            setTimeout(startGrowing, 1000);
        }
    }
    
    // 更新所有線條的流動狀態
    for (let i = 0; i < lineFlowState.length; i++) {
        lineFlowState[i] = globalFlowState;
    }
  }
  
  // --- 計算平均生長進度 ---
  function calculateAverageGrowthProgress(currentTime) {
          const totalLines = lineTypes.length;
          let totalGrowthProgress = 0;
          let activeLines = 0;
          
          for (let i = 0; i < totalLines; i++) {
              if (lineStartTimes[i] === undefined || currentTargetLengths[i] === undefined) continue;
              
              activeLines++;
              const localMaxLength = currentTargetLengths[i] / (effect?.scale.x || 1);
              const timeSinceStart = currentTime - (lineStartTimes[i] || currentTime);
              const currentGrowthSpeed = flowParams.growth.speed * flowParams.growth.flowSpeedFactor;
              const linearDuration = localMaxLength / (currentGrowthSpeed / (effect?.scale.x || 1));
              const growthProgress = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
              
              totalGrowthProgress += growthProgress;
          }
          
    return activeLines > 0 ? totalGrowthProgress / activeLines : 0;
  }
  
  // --- 開始收縮動畫 ---
  function startShrinking() {
      if (!clock) return;
      
    console.log("開始收縮動畫，顯示中心球體");
      
      globalFlowState = 'shrinking';
      
    const currentTime = clock.getElapsedTime();
      shrinkStartTime = currentTime;
      shrinkEndTime = currentTime + flowParams.timing.baseShrinkDuration * flowParams.timing.flowShrinkDurationFactor;
      
      centerBallVisible = true;
    centerBallFadeStartTime = null;
  }
  
  // --- 開始生長動畫 ---
  function startGrowing() {
      if (!clock) return;
      
    console.log("開始生長動畫，隱藏中心球體");
      
    const currentTime = clock.getElapsedTime();
      globalFlowState = 'growing';
      growStartTime = currentTime;
      centerBallVisible = false;
    centerBallFadeStartTime = null;
    
    regenerateLines(currentTime);
  }
  
  // --- 重新生成線條 ---
  function regenerateLines(currentTime) {
    const totalLines = lineTypes.length;
    
      for (let i = 0; i < totalLines; i++) {
          if (lineStartTimes[i] === undefined) continue;
          
        // 新的隨機方向
          if (!randomDirections[i]) randomDirections[i] = new THREE.Vector3();
        randomDirections[i]?.set(
            Math.random() * 2 - 1, 
            Math.random() * 2 - 1, 
            Math.random() * 2 - 1
        ).normalize();
          
        // 新的長度和開始時間
        const minLength = 2;
        const maxLength = 3.5;
        currentTargetLengths[i] = THREE.MathUtils.randFloat(minLength, maxLength);
          lineStartTimes[i] = currentTime;
      }
  }
  
  // --- 開始流動動畫 ---
  function startFlowAnimation() {
    if (!clock) return;
    
    console.log("初始化流動動畫");
    
    // 設置初始狀態
    globalFlowState = 'growing';
    growStartTime = clock.getElapsedTime();
          
    // 重置線條狀態
    if (effect) effect.reset();
  }
  
  // --- 動畫循環 ---
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
  
    if (!effect || !materials || !camera || !renderer || !scene || !controls) return;
  
    updateMetaball(effect);
    controls.update();
  
        renderer.render(scene, camera);
  }
  
  // --- 處理視窗大小變化 ---
  function handleResize() {
    if (!camera || !renderer) return;
    
      const width = canvasContainer.value?.clientWidth ?? window.innerWidth;
      const height = canvasContainer.value?.clientHeight ?? window.innerHeight;
  
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
  }
  
  // --- 初始化場景 ---
  function initScene() {
    if (!canvasContainer.value) {
      console.error("找不到畫布容器!");
      return false;
    }
    
    const container = canvasContainer.value;
    const width = container.clientWidth;
    const height = container.clientHeight;
  
    // 場景設置
    scene = new THREE.Scene();
    scene.background = null; // 透明背景
  
    // 相機設置
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 30);
    camera.lookAt(scene.position);
  
    // 渲染器設置
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
  
    // 控制設置
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true; // 永遠自動旋轉
    controls.autoRotateSpeed = 5.0;
  
    // 燈光設置
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);
  
    // 環境貼圖
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
  
    // 準備材質
    materials = { liquid: createMaterial() };
  
    // Marching Cubes
    effect = new MarchingCubes(200, materials.liquid, true, true, 100000);
    effect.isolation = 300;
    effect.scale.set(8, 8, 8);
    effect.enableUvs = false;
    effect.enableColors = false;
    scene.add(effect);
  
    // 時鐘
    clock = new THREE.Clock();
  
    return true;
  }
  
  // --- 清理資源 ---
  function cleanupResources() {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
  
    if (controls) controls.dispose();
    if (renderer) renderer.dispose();
    if (materials && materials.liquid) {
        materials.liquid.dispose();
        if (scene?.environment) scene.environment.dispose();
    }
    
    if (effect) {
        scene?.remove(effect);
    }
    
     if (scene) {
          scene.traverse((object) => {
              if (object instanceof THREE.Mesh) {
                  object.geometry?.dispose();
                  const material = object.material;
                  if (Array.isArray(material)) {
                      material.forEach((mat) => mat.dispose());
                  } else if (material) {
                      material.dispose();
                  }
              }
          });
      }
    
    if (pmremGenerator) pmremGenerator.dispose();
  
    if (canvasContainer.value && renderer) {
      canvasContainer.value.removeChild(renderer.domElement);
    }
  
    console.log("Three.js 場景已清理");
  }
  
  // --- 生命週期掛鉤 ---
  onMounted(() => {
    if (!initScene()) return;
    
    // 載入資源
    loadEnvironmentMap();
    loadModelJson();
    
    // 啟動動畫
    animate();
    
    // 處理視窗大小變化
    window.addEventListener('resize', handleResize);
  });
  
  onUnmounted(() => {
    cleanupResources();
  });
  </script>