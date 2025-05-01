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
  
  // --- 常量設定 ---
  const CONFIG = {
    segments: 50,      // 線條分段數
    subtract: 20,      // Metaball 減值
    resolution: 200,   // Marching Cubes 解析度
    isolation: 300,    // Marching Cubes 獨立閾值
    scale: 8,          // 效果縮放比例
    randomRange: 2,    // 隨機方向範圍
    directionCount: 3, // 方向向量維度
    lineRange: {       // 線條長度範圍
      min: 2,
      max: 3.5
    }
  };
  
  // --- 核心組件 ---
  let scene, camera, renderer, controls, effect, clock;
  let materials, pmremGenerator, animationFrameId;
  
  // --- 模型數據 ---
  let lineData = {
    startTimes: [],
    directions: [],
    lengths: [],
    types: [],
    states: []
  };
  
  // --- 動畫狀態 ---
  const animation = {
    state: 'idle',        // 當前動畫狀態 (idle, growing, pauseAtEnd, shrinking, pauseAtStart)
    shrinkStart: null,    // 收縮開始時間
    shrinkEnd: null,      // 收縮結束時間
    growStart: null,      // 生長開始時間
    centerBallVisible: false,  // 中心球體可見性
    ballFadeStart: null   // 球體淡出開始時間
  };
  
  // --- 動畫參數 ---
  const params = {
      centerBall: {
      max: 1.0,        // 最大強度
      min: 0.0,        // 最小強度
      fadeDuration: 5.0, // 淡出時間
      easing: {
        type: 'easeIn', // 緩動類型
        power: 0.5      // 緩動強度
          }
      },
      timing: {
      shrinkBase: 3.0,    // 基礎收縮時間
      shrinkFactor: 0.2   // 收縮時間因子
      },
      growth: {
      speed: 5.0,         // 基礎生長速度
      easePower: 0.15,    // 生長緩動指數
      speedFactor: 0.1    // 生長速度因子
      },
      wave: {
      frequency: 1.0,     // 波浪頻率
      amplitude: 0.3,     // 波浪振幅因子
      phase: Math.PI * 4  // 波浪相位因子
    },
    render: {
      pixelRatio: 1.5,    // 像素比例
      rotateSpeed: 5.0    // 旋轉速度
      }
  };
  
  // --- 材質與渲染 ---
  
  // 創建液體材質
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
  
  // 載入環境貼圖
  function loadEnvironmentMap() {
    return new Promise((resolve, reject) => {
    new EXRLoader()
        .setPath('/hdr/')
        .load('HDR_Light_Studio_Free_HDRI_Design_04.exr', 
          (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            pmremGenerator.dispose();
            texture.dispose();
  
            scene.environment = envMap;
            if (materials?.liquid) {
                materials.liquid.envMap = envMap;
                materials.liquid.needsUpdate = true;
            }
            
            resolve(envMap);
          }, 
          undefined, 
          (error) => {
            console.error('環境貼圖載入失敗:', error);
            reject(error);
          }
        );
        });
  }
  
  // --- Metaball 和動畫相關 ---
  
  // 主要更新函數
  function updateMetaball(obj) {
    if (!clock) return;
    
    obj.reset();
    const time = clock.getElapsedTime();
    const centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);

    // 更新狀態並處理狀態轉換
    updateAnimationState(time);

    // 添加中心球體
    addCenterBall(obj, centerOffset, time);
    
    // 更新所有線條
    updateLines(obj, centerOffset, time);

    obj.update();
  }
  
  // 添加中心球體
  function addCenterBall(obj, offset, time) {
    const strength = calculateBallStrength(time);
    
    if (strength > 0.01) {
      obj.addBall(offset.x, offset.y, offset.z, strength, CONFIG.subtract);
      animation.centerBallVisible = true;
    } else {
      animation.centerBallVisible = false;
    }
  }
  
  // 計算球體強度
  function calculateBallStrength(time) {
    const { state, shrinkStart, shrinkEnd, ballFadeStart } = animation;
    const { min, max, fadeDuration, easing } = params.centerBall;
    
    if (state === 'shrinking' && shrinkStart !== null && shrinkEnd !== null) {
      // 收縮階段 - 球體逐漸變大
      const shrinkDuration = shrinkEnd - shrinkStart;
      const progress = Math.min((time - shrinkStart) / shrinkDuration, 1.0);
      return min + progress * (max - min);
    } 
    else if (state === 'pauseAtStart') {
      // 暫停階段 - 球體逐漸淡出
      if (ballFadeStart === null) {
        animation.ballFadeStart = time;
        return max;
        }
        
      const fadeProgress = Math.min((time - ballFadeStart) / fadeDuration, 1.0);
      const easedProgress = applyEasing(fadeProgress, easing);
      return max * (1.0 - easedProgress);
    } 
    
    return min;
  }
  
  // 更新所有線條
  function updateLines(obj, centerOffset, time) {
    const count = lineData.types.length;
    
    for (let i = 0; i < count; i++) {
      if (!isLineActive(i, time)) continue;
      
      const direction = lineData.directions[i];
      const type = lineData.types[i];
      const maxLength = lineData.lengths[i] / obj.scale.x;
      const timeSinceStart = time - lineData.startTimes[i];
      
      const length = calculateLineLength(maxLength, timeSinceStart, obj.scale.x);
      if (length <= 0.001 || !direction || !type) continue;
      
      addLineSegments(obj, length, direction, type, centerOffset, time);
    }
  }
  
  // 檢查線條是否處於活動狀態
  function isLineActive(index, time) {
    return lineData.startTimes[index] !== undefined && 
           time >= lineData.startTimes[index] && 
           lineData.lengths[index] !== undefined;
  }
  
  // 計算線條長度
  function calculateLineLength(maxLength, timeSinceStart, scaleX) {
    if (maxLength <= 0.001) return 0;
    
    const { state, shrinkStart, shrinkEnd } = animation;
    const { speed, easePower, speedFactor } = params.growth;
    const currentTime = clock.getElapsedTime();
    
    switch (state) {
        case 'growing':
        // 生長階段 - 線條逐漸變長
        const currentSpeed = speed * speedFactor;
        const duration = maxLength / (currentSpeed / scaleX);
        const timeRatio = Math.min(timeSinceStart / duration, 1.0);
        return Math.pow(timeRatio, easePower) * maxLength;
            
        case 'pauseAtEnd':
        // 生長結束暫停
            return maxLength;
            
        case 'shrinking':
        // 收縮階段 - 線條逐漸變短
        if (shrinkStart !== null && shrinkEnd !== null) {
          const shrinkDuration = shrinkEnd - shrinkStart;
          const progress = Math.min((currentTime - shrinkStart) / shrinkDuration, 1.0);
          return maxLength * (1.0 - progress);
            }
            return maxLength;
            
        case 'pauseAtStart':
        // 收縮結束暫停
            return 0.001;
            
        default:
            return 0;
    }
  }
  
  // 為線條添加所有 metaball 分段
  function addLineSegments(obj, length, direction, type, offset, time) {
    for (let i = 0; i <= CONFIG.segments; i++) {
      const t = i / CONFIG.segments;
      const strength = calculateSegmentStrength(t, type, time);
      const position = calculateSegmentPosition(t, length, direction, offset);
      
      obj.addBall(position.x, position.y, position.z, strength, CONFIG.subtract);
    }
  }
  
  // 計算 metaball 分段的強度
  function calculateSegmentStrength(t, type, time) {
    const isTipType = type === 'tt';
    const strengthFactor = Math.pow(t, isTipType ? 0.25 : 1.25);
    
        const baseStrength = THREE.MathUtils.lerp(
      isTipType ? 0.1 : 0.01,
      isTipType ? 0.01 : 0.1,
            strengthFactor
        );

    // 添加波浪效果
    const { frequency, amplitude, phase } = params.wave;
    const waveOffset = Math.sin(time * frequency - t * phase) * amplitude * baseStrength;
    
    return Math.max(baseStrength + waveOffset, 0);
  }
        
  // 計算分段位置
  function calculateSegmentPosition(t, length, direction, offset) {
    const localPos = direction.clone().multiplyScalar(length * t);
    return localPos.add(offset);
  }
  
  // --- 動畫流程控制 ---
  
  // 更新全局動畫狀態
  function updateAnimationState(time) {
    const { state, growStart, shrinkStart, shrinkEnd } = animation;
    
    // 生長完成後轉換到暫停
    if (state === 'growing' && growStart !== null) {
      const progress = calculateGrowthProgress(time);
      if (progress >= 0.99) {
        animation.state = 'pauseAtEnd';
        console.log("生長完成，暫停中");
        setTimeout(startShrinking, 1000);
      }
    } 
    // 收縮完成後轉換到暫停
    else if (state === 'shrinking' && shrinkStart !== null && shrinkEnd !== null) {
      if (time >= shrinkEnd) {
        animation.state = 'pauseAtStart';
        console.log("收縮完成，暫停中");
        setTimeout(startGrowing, 1000);
      }
    }
    
    // 更新所有線條狀態
    updateLineStates();
  }
  
  // 更新所有線條狀態
  function updateLineStates() {
    const count = lineData.states.length;
    const currentState = animation.state;
    
    for (let i = 0; i < count; i++) {
      lineData.states[i] = currentState;
    }
  }
  
  // 計算平均生長進度
  function calculateGrowthProgress(time) {
    const count = lineData.types.length;
    let totalProgress = 0;
    let activeCount = 0;
    
    for (let i = 0; i < count; i++) {
      if (!lineData.startTimes[i] || !lineData.lengths[i]) continue;
      
      activeCount++;
      const maxLength = lineData.lengths[i] / (effect?.scale.x || 1);
      const elapsed = time - (lineData.startTimes[i] || time);
      const speed = params.growth.speed * params.growth.speedFactor;
      const duration = maxLength / (speed / (effect?.scale.x || 1));
      
      totalProgress += Math.min(elapsed / duration, 1.0);
    }
    
    return activeCount > 0 ? totalProgress / activeCount : 0;
  }
  
  // 開始收縮階段
  function startShrinking() {
    if (!clock) return;
    
    const time = clock.getElapsedTime();
    animation.state = 'shrinking';
    animation.shrinkStart = time;
    animation.shrinkEnd = time + params.timing.shrinkBase * params.timing.shrinkFactor;
    animation.centerBallVisible = true;
    animation.ballFadeStart = null;
    
    console.log("開始收縮，顯示中心球體");
  }
  
  // 開始生長階段
  function startGrowing() {
    if (!clock) return;
    
    const time = clock.getElapsedTime();
    animation.state = 'growing';
    animation.growStart = time;
    animation.centerBallVisible = false;
    animation.ballFadeStart = null;
    
    regenerateLines(time);
    console.log("開始生長，隱藏中心球體");
  }
  
  // 重新生成線條
  function regenerateLines(time) {
    const count = lineData.types.length;
    const { min, max } = CONFIG.lineRange;
    
    for (let i = 0; i < count; i++) {
      if (lineData.startTimes[i] === undefined) continue;
      
      // 生成新的隨機方向
      if (!lineData.directions[i]) {
        lineData.directions[i] = new THREE.Vector3();
      }
      
      // 填充隨機方向
      const vector = lineData.directions[i];
      const range = CONFIG.randomRange;
      vector.set(
        Math.random() * range - range/2,
        Math.random() * range - range/2,
        Math.random() * range - range/2
      ).normalize();
      
      // 更新長度和開始時間
      lineData.lengths[i] = THREE.MathUtils.randFloat(min, max);
      lineData.startTimes[i] = time;
    }
  }
  
  // 應用緩動效果
  function applyEasing(progress, config) {
    switch (config.type) {
      case 'easeIn':
        return Math.pow(progress, config.power);
      case 'easeOut':
        return 1 - Math.pow(1 - progress, config.power);
      default: // linear
        return progress;
    }
  }
  
  // --- 資源加載 ---
  
  // 載入模型JSON
  function loadModelJson() {
    return fetch('/modelJson.json')
        .then(response => response.json())
        .then(config => {
        initializeModelData(config);
            applyModelConfiguration(config);
        startAnimation();
        return config;
        })
        .catch(error => {
        console.error("模型設定載入失敗:", error);
        throw error;
        });
  }
  
  // 初始化模型數據
  function initializeModelData(config) {
    const count = config.lineTypes.length;
    const time = clock?.getElapsedTime() ?? 0;
    
    // 重置數據結構
    lineData = {
      startTimes: new Array(count),
      directions: new Array(count),
      lengths: new Array(count),
      types: new Array(count),
      states: new Array(count)
    };
    
    // 填充數據
    for (let i = 0; i < count; i++) {
      lineData.types[i] = config.lineTypes[i];
      lineData.lengths[i] = config.currentTargetLengths[i];
        
        if (config.randomDirections[i]) {
        lineData.directions[i] = new THREE.Vector3(
                config.randomDirections[i].x,
                config.randomDirections[i].y,
                config.randomDirections[i].z
            );
        }
        
      lineData.startTimes[i] = time - 1000; // 立即可見
      lineData.states[i] = 'growing';
    }
  }
  
  // 應用模型配置
  function applyModelConfiguration(config) {
    if (!effect || !config.cameraQuaternion) return;
    
    const quaternion = new THREE.Quaternion(
        config.cameraQuaternion.x,
        config.cameraQuaternion.y,
        config.cameraQuaternion.z,
        config.cameraQuaternion.w
    );
    
    effect.quaternion.set(0, 0, 0, 1);
    const invertedQuaternion = quaternion.clone().invert();
    effect.quaternion.premultiply(invertedQuaternion);
    effect.matrixWorldNeedsUpdate = true;
    effect.updateMatrixWorld(true);
    effect.matrixAutoUpdate = false;
  }
  
  // 開始動畫循環
  function startAnimation() {
    animation.state = 'growing';
    animation.growStart = clock.getElapsedTime();
    
    if (effect) effect.reset();
  }
  
  // --- 核心渲染循環 ---
  
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
  
    if (!isSceneReady()) return;
  
    updateMetaball(effect);
    controls.update();
    renderer.render(scene, camera);
  }
  
  // 檢查場景是否準備就緒
  function isSceneReady() {
    return effect && materials && camera && renderer && scene && controls;
  }
  
  // --- 場景管理 ---
  
  // 處理視窗大小變化
  function handleResize() {
    if (!camera || !renderer) return;
    
    const width = canvasContainer.value?.clientWidth ?? window.innerWidth;
    const height = canvasContainer.value?.clientHeight ?? window.innerHeight;
  
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  
  // 初始化場景
  function initScene() {
    if (!canvasContainer.value) {
      console.error("找不到畫布容器!");
      return false;
    }
    
    // 獲取容器尺寸
    const container = canvasContainer.value;
    const width = container.clientWidth;
    const height = container.clientHeight;
  
    // 場景設置
    scene = new THREE.Scene();
    scene.background = null; // 透明背景
  
    // 相機設置
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
  
    // 渲染器設置
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, params.render.pixelRatio));
    container.appendChild(renderer.domElement);
  
    // 控制器設置
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = params.render.rotateSpeed;
    controls.enableZoom = false;
  
    // 燈光設置
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);
  
    // 環境貼圖處理
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
  
    // 材質準備
    materials = { liquid: createMaterial() };
  
    // Marching Cubes 效果
    effect = new MarchingCubes(
      CONFIG.resolution, 
      materials.liquid, 
      true, 
      true, 
      100000
    );
    effect.isolation = CONFIG.isolation;
    effect.scale.set(CONFIG.scale, CONFIG.scale, CONFIG.scale);
    effect.enableUvs = false;
    effect.enableColors = false;
    scene.add(effect);
  
    // 時鐘
    clock = new THREE.Clock();
    
    return true;
  }
  
  // 清理資源
  function cleanupResources() {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
  
    // 釋放控制器
    if (controls) controls.dispose();
    
    // 釋放渲染器
    if (renderer) renderer.dispose();
    
    // 釋放材質和環境
    if (materials?.liquid) {
        materials.liquid.dispose();
        if (scene?.environment) scene.environment.dispose();
    }
    
    // 移除效果
    if (effect) {
        scene?.remove(effect);
    }
    
    // 清理場景
    if (scene) {
      scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          
              const material = object.material;
              if (Array.isArray(material)) {
            material.forEach(mat => mat.dispose());
              } else if (material) {
                  material.dispose();
              }
          }
      });
    }
    
    // 釋放環境處理器
    if (pmremGenerator) pmremGenerator.dispose();
  
    // 移除畫布
    if (canvasContainer.value && renderer) {
      canvasContainer.value.removeChild(renderer.domElement);
    }
  }
  
  // --- 生命週期掛鉤 ---
  
  onMounted(async () => {
    if (!initScene()) return;
    
    try {
      // 並行加載資源
      await Promise.all([
        loadEnvironmentMap(),
        loadModelJson()
      ]);
    
      // 啟動渲染循環
    animate();
    
    // 處理視窗大小變化
    window.addEventListener('resize', handleResize);
    } catch (error) {
      console.error("初始化失敗:", error);
    }
  });
  
  onUnmounted(() => {
    cleanupResources();
  });
  </script>