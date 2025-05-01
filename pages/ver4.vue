<template>
    <div class="main-container">
        <h1 class="company-name">
            <div class="front-name">
                Splash
      </div>
            <div class="back-name">
                DigiLab
      </div>
        </h1>
      </div>
    <div class="splash-container">
      <div ref="canvasContainer" class="canvas-container"></div>
      <!-- <div id="switchPanel" class="control-panel switch-panel">
            <div class="panel-title">效果切換</div>
        <div class="switch-control-group">
            <label class="switch-label">{{ currentMaterial === 'shader' ? '描邊材質' : '液體材質' }}</label>
            <label class="switch">
                <input type="checkbox" :checked="currentMaterial === 'liquid'" @change="toggleMaterial">
                <span class="slider round"></span>
            </label>
        </div>

        <div class="switch-control-group">
            <label class="switch-label">{{ isFlowing ? '流動中' : '靜止' }}</label>
            <label class="switch">
                <input type="checkbox" :checked="isFlowing" @change="toggleFlow">
                <span class="slider round"></span>
            </label>
        </div>

        <div class="switch-control-group">
            <label class="switch-label">{{ isPixelated ? '像素化' : '正常' }}</label>
            <label class="switch">
                <input type="checkbox" :checked="isPixelated" @change="togglePixelation">
                <span class="slider round"></span>
            </label>
        </div>
            
            <div class="switch-control-group">
                <label class="switch-label">{{ isAutoRotating ? '自動旋轉中' : '靜止' }}</label>
                <label class="switch">
                    <input type="checkbox" :checked="isAutoRotating" @change="toggleAutoRotate">
                    <span class="slider round"></span>
                </label>
    </div>
      </div> -->
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

// --- Refs ---
const canvasContainer = ref(null);

// --- State (Reactive Variables) ---
  const currentMaterial = ref('liquid');
  const isPixelated = ref(false);
  const isAutoRotating = ref(true);
  const isFlowing = ref(true);
  
  // Internal state (內部狀態變數)
let scene;
let camera;
let renderer;
let controls;
let effect;
let clock;
let materials;
let pmremGenerator;
  let composer;
  let pixelPass;
let animationFrameId;
  let spheres = []; // 儲存噴射球體

  // Line Data (線條數據)
let lineStartTimes = [];
let randomDirections = [];
let currentTargetLengths = [];
let lineTypes = [];
  let lineFlowState = [];     // 儲存每條線的流動狀態
  
  // 流動控制相關變數
  let savedLineState = null;  // 儲存流動開始前的線條狀態，用於恢復
  let savedCameraState = null; // 儲存流動開始前的攝影機狀態，用於恢復
  let shrinkStartTime = null; // 收合開始時間，用於同步計算收合進度
  let shrinkEndTime = null;   // 收合結束時間，用於同步計算收合完成度
  let growStartTime = null;   // 生長開始時間，用於同步計算生長進度
  let centerBallVisible = false;   // 球體可見性狀態，控制是否顯示中心球體
  let globalFlowState = 'idle';    // 全局流動狀態，控制所有線條的統一動畫行為
  let centerBallFadeStartTime = null; // 中心球體淡出開始時間
  
  // 材質基本設定
  const materialBaseConfig = {
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transparent: true,
      opacity: 0.75,
      transmission: 1,
      ior: 1.33,
      thickness: 1.0,
      envMapIntensity: 50.0,
      side: THREE.DoubleSide
  };
  
  // 所有控制參數整合
  const flowParams = {
      // 球體參數
      centerBall: {
          maxStrength: 1.0,         // 中心球體最大強度，控制球體最大大小
          minStrength: 0.0,         // 中心球體最小強度，控制球體最小大小
          fadeDuration: 5.0,        // 中心球體淡出持續時間（秒）
          // 球體收縮曲線參數
          fadeEasing: {
              type: 'easeIn',       // 'easeIn' 由慢到快, 'easeOut' 由快到慢, 'linear' 線性變化
              power: 0.5            // 曲線指數，值越大效果越明顯
          }
      },
      
      // 噴射球體參數
      shootingSpheres: {
          count: 12,               // 噴射球體數量
          radius: 0.15,           // 球體半徑
          speed: 3.0,             // 基礎速度
          maxDistance: 8.0,       // 最大飛行距離
          geometry: {
              segments: 16,        // 球體分段數
              rings: 16           // 球體環數
          }
      },
      
      // 時間控制參數
      timing: {
          ballMaxReachAdvance: 1.0,    // 球體提前多少秒達到最大尺寸（秒）
          ballShrinkStartAdvance: 1.0, // 球體提前多少秒開始收縮（秒）
          lineShrinkDuration: 3.0,     // 線條收縮持續時間（秒）
          baseShrinkDuration: 3.0,     // 基本收縮持續時間（秒）
          flowShrinkDurationFactor: 0.2, // 流動模式下的收縮持續時間因子
          pauseDuration: 1000,         // 暫停持續時間（毫秒）
      },
      
      // 生長參數
      growth: {
          speed: 5.0,              // 線條生長速度
          easeOutPower: 0.15,      // 生長緩動指數，控制生長速度變化曲線
          flowSpeedFactor: 0.1     // 流動模式下的生長速度因子，會使生長變慢
      },
      
      // 波浪效果參數
      wave: {
          frequency: 1.0,          // 波浪頻率，控制波浪振動的速度
          amplitudeFactor: 0.3,    // 波浪振幅因子，與基礎強度相乘得到波浪振幅
          phaseFactor: Math.PI * 4 // 波浪相位因子，控制波浪的空間分佈
      },

      // 渲染器設定
      renderer: {
          pixelRatio: 1.5,         // 最大像素比
          antialias: true,         // 抗鋸齒
          alpha: true              // 透明背景
      },

      // 相機設定
      camera: {
          fov: 45,                // 視野角度
          near: 0.1,              // 近裁剪面
          far: 1000,              // 遠裁剪面
          position: {             // 相機位置
              x: 0,
              y: 0,
              z: 25
          }
      },

      // 控制器設定
      controls: {
          enableDamping: true,     // 啟用阻尼
          autoRotateSpeed: 5.0,    // 自動旋轉速度
          enablePan: false,        // 禁止平移
          enableZoom: false,       // 禁止縮放
          polarAngle: Math.PI / 2  // 垂直角度
      }
  };
  
  // Constants (常數)
const numSegments = 50;
const subtract = 20;

// --- Shaders ---
const vertexShader = `
  uniform vec3 viewVector;
  uniform vec2 uResolution;
  uniform float uTime;
  varying vec2 vUv;
  varying float opacity;
  void main() {
    vUv = uv;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
    vec3 nNormal = normalize(normalMatrix * normal);
    vec3 nView   = normalize(viewVector - mvPos.xyz);
    opacity = dot(nNormal, nView);
    opacity = 1.0 - abs(opacity * 1.3);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform float uTime;
  varying vec2 vUv;
  varying float opacity;
  void main() {
    vec2 d = gl_FragCoord.xy / uResolution;
    vec3 fade = vec3(d.x, d.y, 1.0);
    vec3 c = mix(vec3(0.0), fade * uColor, opacity);
    gl_FragColor = vec4(c, 1.0);
  }
`;

// --- Functions ---
function generateMaterials() {
  return {
    shader: new THREE.ShaderMaterial({
      uniforms: {
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTime:       { value: 0 },
        uColor:      { value: new THREE.Color(0x000000) },
        viewVector:  { value: camera.position }
      },
      vertexShader:   vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    }),
      liquid: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
          metalness: 0,
        roughness: 0,
        transparent: true,
          opacity: 0.75,
          transmission: 1, // 增加透光性，模擬玻璃效果
        //   reflectivity: 1, // 反射率
          ior: 1.33, // 折射率 (玻璃約為1.5，水約為1.33)
          thickness: 1.0, // 材質厚度
        //   clearcoat: 0.5, // 清漆層強度
        //   clearcoatRoughness: 0.1, // 清漆層粗糙度
          envMap: null,
          envMapIntensity: 50.0,
          side: THREE.DoubleSide
    })
  };
}

function loadEnvironmentMap() {
  new EXRLoader()
        .setPath('/hdr/')
      .load('HDR_Light_Studio_Free_HDRI_Design_04.exr', (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          pmremGenerator.dispose();
          texture.dispose();

          console.log("本地 EXR 環境貼圖已載入並處理完成。");
          scene.environment = envMap;
          if (materials && materials.liquid) {
              materials.liquid.envMap = envMap;
              materials.liquid.needsUpdate = true;
          }
      }, undefined, (error) => {
          console.error('無法載入本地 EXR 環境貼圖:', error);
      });
}

  function updateLineMetaball(obj) {
      if (!clock) return;
      obj.reset();
    const currentTime = clock.getElapsedTime();
      const centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
      const totalLines = lineTypes.length;
  
      // 更新全局流動狀態
      if (isFlowing.value) {
          updateGlobalFlowState(currentTime);
      }
  
      // 添加中心metaball球體 (如果可見)
      if (centerBallVisible) {
          // 計算中心球體的強度
          const centerBallStrength = calculateCenterBallStrength(currentTime);
          if (centerBallStrength > 0.01) {
              // 將中心球體添加到metaball系統
              obj.addBall(centerOffset.x, centerOffset.y, centerOffset.z, centerBallStrength, subtract);
          }
      }

    for (let lineIndex = 0; lineIndex < totalLines; lineIndex++) {
        if (lineStartTimes[lineIndex] === undefined || currentTime < lineStartTimes[lineIndex]) {
            continue;
        }

        if (currentTargetLengths[lineIndex] === undefined) continue;
          
        const localMaxLength = currentTargetLengths[lineIndex] / obj.scale.x;
        let localCurrentLength = 0;
        let timeSinceStart = currentTime - lineStartTimes[lineIndex];

          // 使用全局狀態控制所有線條
          if (isFlowing.value) {
              switch (globalFlowState) {
            case 'growing':
                if (localMaxLength > 0.001) {
                          const currentGrowthSpeed = flowParams.growth.speed * flowParams.growth.flowSpeedFactor;
                    const linearDuration = localMaxLength / (currentGrowthSpeed / obj.scale.x);
                    const normalizedTime = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
                          const easedTime = Math.pow(normalizedTime, flowParams.growth.easeOutPower);
                    localCurrentLength = easedTime * localMaxLength;
                } else {
                    localCurrentLength = 0;
                }
                break;
            case 'pauseAtEnd':
                    localCurrentLength = localMaxLength;
                break;
            case 'shrinking':
                      // 計算收合進度（所有線條使用相同的開始和結束時間）
                      if (shrinkStartTime !== null && shrinkEndTime !== null) {
                          const shrinkDuration = shrinkEndTime - shrinkStartTime;
                          const timeSinceShrinking = currentTime - shrinkStartTime;
                          const shrinkProgress = Math.min(timeSinceShrinking / shrinkDuration, 1.0);
                          const shrinkFactor = Math.max(0, 1.0 - shrinkProgress);
                localCurrentLength = localMaxLength * shrinkFactor;
                    } else {
                          localCurrentLength = localMaxLength;
                }
                break;
            case 'pauseAtStart':
                    localCurrentLength = 0.001;
                break;
                  default:
                      localCurrentLength = 0;
                      break;
              }
              
              // 更新單獨線條狀態以匹配全局狀態
              lineFlowState[lineIndex] = globalFlowState;
          } else {
              // 非流動模式的原始邏輯
              if (localMaxLength > 0.001) {
                  const normalizedTime = Math.min(timeSinceStart / (localMaxLength / (flowParams.growth.speed / obj.scale.x)), 1.0);
                  const easedTime = Math.pow(normalizedTime, flowParams.growth.easeOutPower);
                    localCurrentLength = easedTime * localMaxLength;
                } else {
                    localCurrentLength = 0;
                }
        }

        if (localCurrentLength <= 0.001) continue;

        const currentDirection = randomDirections[lineIndex];
        const currentLineType = lineTypes[lineIndex];
        if (!currentDirection || !currentLineType) continue;

          // 計算Metaball強度和位置
        for (let i = 0; i <= numSegments; i++) {
            const segmentT = i / numSegments;
              const strengthFactor = Math.pow(segmentT, currentLineType === 'tt' ? 0.25 : 1.25);
              const baseStrength = THREE.MathUtils.lerp(
                  currentLineType === 'tt' ? 0.1 : 0.01,
                  currentLineType === 'tt' ? 0.01 : 0.1,
                  strengthFactor
              );

            let dynamicStrength = baseStrength;
            if (isFlowing.value) {
                  const flowAmplitude = flowParams.wave.amplitudeFactor * baseStrength;
                  const flowOffset = Math.sin(currentTime * flowParams.wave.frequency - segmentT * flowParams.wave.phaseFactor) * flowAmplitude;
                dynamicStrength += flowOffset;
                dynamicStrength = Math.max(dynamicStrength, 0);
            }

            const localPos = currentDirection.clone().multiplyScalar(localCurrentLength * segmentT);
            const finalPos = localPos.add(centerOffset);
            obj.addBall(finalPos.x, finalPos.y, finalPos.z, dynamicStrength, subtract);
        }
    }

    obj.update();
}

  function loadModelJson() {
      fetch('/modelJson.json')
          .then(response => response.json())
          .then(config => {
            console.log("讀取的設定:", config);

              // 設置線條數據
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
                  lineStartTimes[i] = currentTime - 1000;
                  lineFlowState[i] = 'growing';
              }
  
              // 應用相機旋轉
              if (effect && config.cameraQuaternion) {
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
  
              console.log("模型設定已載入完成");
          })
          .catch(error => {
              console.error("載入模型設定失敗:", error);
          });
  }
  
  // 恢復切換功能
function toggleMaterial() {
    if (!effect || !scene) return;
    if (currentMaterial.value === 'shader') {
        currentMaterial.value = 'liquid';
    } else {
        currentMaterial.value = 'shader';
    }
    effect.material = materials[currentMaterial.value];
      
      console.log(`材質已切換為: ${currentMaterial.value}`);
  }
  
  function togglePixelation() {
      if (!effect || !scene) return;
      isPixelated.value = !isPixelated.value;
      console.log(`像素化狀態已切換為: ${isPixelated.value}`);
  }
  
  function toggleAutoRotate() {
      if (!controls) return;
      isAutoRotating.value = !isAutoRotating.value;
      controls.autoRotate = isAutoRotating.value;
      controls.autoRotateSpeed = 5.0; // 設置旋轉速度
      console.log(`自動旋轉狀態已切換為: ${isAutoRotating.value}`);
}

function toggleFlow() {
    if (!clock || !effect || !camera || !controls) return;

    if (isFlowing.value) {
          // --- 停止流動 ---
        isFlowing.value = false;
          globalFlowState = 'idle';
          shrinkStartTime = null;
          shrinkEndTime = null;
          growStartTime = null;
          centerBallVisible = false;
          
        console.log("流動動畫已停止，正在恢復狀態...");

        if (savedLineState) {
            lineTypes = [...savedLineState.lineTypes];
            randomDirections = savedLineState.randomDirections.map((dir) => dir ? new THREE.Vector3(dir.x, dir.y, dir.z) : null);
            currentTargetLengths = [...savedLineState.currentTargetLengths];
            lineStartTimes = [...savedLineState.lineStartTimes];
            lineFlowState = lineTypes.map(() => 'growing');

            console.log("線條狀態已恢復");
            savedLineState = null;
        } else {
            console.warn("找不到保存的狀態來恢復。")
        }

        if (savedCameraState) {
            camera.position.copy(savedCameraState.position);
            camera.quaternion.copy(savedCameraState.quaternion);
            controls.update();
            console.log("相機狀態已恢復");
            savedCameraState = null;
        } else {
             console.warn("找不到保存的相機狀態來恢復。")
        }

        effect.reset();
    } else {
          // --- 開始流動 ---
          console.log("開始流動動畫，正在保存當前狀態...");
        savedLineState = {
            lineTypes: [...lineTypes],
            randomDirections: randomDirections.map(dir => dir ? { x: dir.x, y: dir.y, z: dir.z } : null),
            currentTargetLengths: [...currentTargetLengths],
            lineStartTimes: [...lineStartTimes]
        };
        savedCameraState = {
            position: camera.position.clone(),
            quaternion: camera.quaternion.clone()
        };
        console.log("狀態已保存。");

        isFlowing.value = true;
          
          // 設置初始全局狀態
          globalFlowState = 'growing';
          growStartTime = clock.getElapsedTime();

        const startTime = clock.getElapsedTime();
          const totalLines = lineTypes.length;
        lineFlowState.length = totalLines;

          // 所有線條同時開始生長
          console.log("所有線條同時開始生長。");
            for (let i = 0; i < totalLines; i++) {
                lineStartTimes[i] = startTime;
                lineFlowState[i] = 'growing';
        }

        effect.reset();
    }
    effect.material = materials[currentMaterial.value];
}

  // --- 全局流動狀態管理 ---
  function updateGlobalFlowState(currentTime) {
      if (!isFlowing.value || !clock) return;
      
      // 檢查當前時間和設定的時間節點
      if (globalFlowState === 'growing' && growStartTime !== null) {
          // 計算所有線條的平均生長完成度
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
          
          const averageProgress = activeLines > 0 ? totalGrowthProgress / activeLines : 0;
          
          // 當平均生長進度達到99%以上，切換到暫停狀態
          if (averageProgress >= 0.99) {
              globalFlowState = 'pauseAtEnd';
              console.log("所有線條已生長完成，進入暫停狀態");
              
              // 延遲一段時間後開始收合
              setTimeout(() => {
                  if (isFlowing.value) {
                      startSyncShrinking();
                  }
              }, 1000); // 暫停1秒後開始收合
          }
      } else if (globalFlowState === 'shrinking' && shrinkStartTime !== null && shrinkEndTime !== null) {
          // 檢查是否達到收合結束時間
          if (currentTime >= shrinkEndTime) {
              globalFlowState = 'pauseAtStart';
              console.log("所有線條已收合完成，進入起始暫停狀態");
              
              // 延遲一段時間後開始新的生長週期
              setTimeout(() => {
                  if (isFlowing.value) {
                      startSyncGrowing();
                  }
              }, 1000); // 暫停1秒後開始生長
          }
      }
  }
  
  // 開始同步收合
  function startSyncShrinking() {
      if (!clock) return;
      const currentTime = clock.getElapsedTime();
      
      console.log("所有線條同步收合");
      
      // 更新全局狀態
      globalFlowState = 'shrinking';
      
      // 設置收合時間
      shrinkStartTime = currentTime;
      shrinkEndTime = currentTime + flowParams.timing.baseShrinkDuration * flowParams.timing.flowShrinkDurationFactor;
      
      // 顯示中心metaball球體
      centerBallVisible = true;
  }
  
  // 開始同步生長
  function startSyncGrowing() {
      if (!clock) return;
      const currentTime = clock.getElapsedTime();
      const totalLines = lineTypes.length;
      
      console.log("所有線條同步生長");
      
      // 更新全局狀態
      globalFlowState = 'growing';
      growStartTime = currentTime;
      centerBallVisible = false;
      centerBallFadeStartTime = null;
      
      // 重置並啟動所有球體
      spheres.forEach(sphere => {
          sphere.startTime = currentTime;
          sphere.active = true;
          sphere.mesh.position.set(0, 0, 0);
          
          // 重新生成隨機方向
          sphere.direction.set(
              Math.random() * 2 - 1,
              Math.random() * 2 - 1,
              Math.random() * 2 - 1
          ).normalize();
      });

      // 重置所有線條的方向和長度
      for (let i = 0; i < totalLines; i++) {
          if (lineStartTimes[i] === undefined) continue;
          
          // 重新生成隨機方向
          if (!randomDirections[i]) randomDirections[i] = new THREE.Vector3();
          randomDirections[i]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
          
          // 更新線條類型和長度
          const minL = 2;
          const maxL = 3.5;
          currentTargetLengths[i] = THREE.MathUtils.randFloat(minL, maxL);
          
          // 更新線條狀態
          lineStartTimes[i] = currentTime;
      }
  }
  
  function calculateCenterBallStrength(currentTime) {
      if (!clock) return 0;
      
      if (currentTime === undefined) {
          currentTime = clock.getElapsedTime();
      }
      
      if (globalFlowState === 'shrinking') {
          // 在收合階段，球體隨著線條收縮而放大
          if (shrinkStartTime === null || shrinkEndTime === null) return 0;
          
          const shrinkDuration = shrinkEndTime - shrinkStartTime;
          const timeSinceShrinking = currentTime - shrinkStartTime;
          
          // 計算線條收縮進度
          const shrinkProgress = Math.min(timeSinceShrinking / shrinkDuration, 1.0);
          
          // 球體隨著線條收縮進度同步放大
          // 當線條完全收縮時(shrinkProgress=1)，球體達到最大尺寸
          return flowParams.centerBall.minStrength + shrinkProgress * (flowParams.centerBall.maxStrength - flowParams.centerBall.minStrength);
      } else if (globalFlowState === 'pauseAtStart') {
          // 僅在線條完全收縮後（pauseAtStart狀態）才開始縮小球體
          if (centerBallFadeStartTime === null) {
              // 第一次進入此狀態，設置淡出開始時間為當前時間
              centerBallFadeStartTime = currentTime;
              // 返回最大尺寸
              return flowParams.centerBall.maxStrength;
          }
          
          // 計算淡出進度
          const fadeElapsed = currentTime - centerBallFadeStartTime;
          const fadeProgress = Math.min(fadeElapsed / flowParams.centerBall.fadeDuration, 1.0);
          
          // 根據設定的緩動類型應用不同的曲線函數
          let easedProgress;
          switch (flowParams.centerBall.fadeEasing.type) {
              case 'easeIn':
                  // 由慢到快 (加速效果)
                  easedProgress = Math.pow(fadeProgress, flowParams.centerBall.fadeEasing.power);
                  break;
              case 'easeOut':
                  // 由快到慢 (減速效果)
                  easedProgress = 1 - Math.pow(1 - fadeProgress, flowParams.centerBall.fadeEasing.power);
                  break;
              case 'linear':
              default:
                  // 線性變化
                  easedProgress = fadeProgress;
                  break;
          }
          
          // 球體從最大強度開始收縮
          return flowParams.centerBall.maxStrength * (1.0 - easedProgress);
      } else {
          return flowParams.centerBall.minStrength;
      }
  }
  
  // 創建噴射球體
  function createSpheres() {
      // 清除現有的球體
      cleanupSpheres();

      const geometry = new THREE.SphereGeometry(
          flowParams.shootingSpheres.radius,
          flowParams.shootingSpheres.geometry.segments,
          flowParams.shootingSpheres.geometry.rings
      );
      
      // 使用基本材質設定
      const material = new THREE.MeshPhysicalMaterial({
          ...materialBaseConfig,
          envMap: scene.environment
      });

      for (let i = 0; i < flowParams.shootingSpheres.count; i++) {
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(0, 0, 0);
          
          spheres.push({
              mesh,
              direction: generateRandomDirection(),
              startTime: null,
              active: false
          });

          scene.add(mesh);
      }
  }

  // 生成隨機方向
  function generateRandomDirection() {
      return new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
      ).normalize();
  }

  // 清理球體
  function cleanupSpheres() {
      spheres.forEach(sphere => {
          if (sphere.mesh) {
              scene.remove(sphere.mesh);
              sphere.mesh.geometry.dispose();
              sphere.mesh.material.dispose();
          }
      });
      spheres = [];
  }

  // 更新球體位置
  function updateSpheres(currentTime) {
      if (!isFlowing.value || !clock) return;

      spheres.forEach(sphere => {
          if (!sphere.active) return;

          const progress = calculateSphereProgress(sphere, currentTime);
          updateSpherePosition(sphere, progress);
      });
  }

  // 計算球體進度
  function calculateSphereProgress(sphere, currentTime) {
      const timeSinceStart = currentTime - sphere.startTime;
      
      switch (globalFlowState) {
          case 'growing':
              const normalizedTime = Math.min(
                  timeSinceStart / (flowParams.shootingSpheres.maxDistance / flowParams.shootingSpheres.speed),
                  1.0
              );
              return Math.pow(normalizedTime, flowParams.growth.easeOutPower);
          
          case 'shrinking':
              if (shrinkStartTime !== null && shrinkEndTime !== null) {
                  const shrinkDuration = shrinkEndTime - shrinkStartTime;
                  const timeSinceShrinking = currentTime - shrinkStartTime;
                  const shrinkProgress = Math.min(timeSinceShrinking / shrinkDuration, 1.0);
                  return 1.0 - shrinkProgress;
              }
              return 1.0;
          
          case 'pauseAtEnd':
              return 1.0;
          
          case 'pauseAtStart':
          default:
              return 0;
      }
  }

  // 更新球體位置
  function updateSpherePosition(sphere, progress) {
      sphere.mesh.position.copy(
          sphere.direction.clone().multiplyScalar(flowParams.shootingSpheres.maxDistance * progress)
      );
  }

  // 初始化球體狀態
  function initializeSpheres(currentTime) {
      spheres.forEach(sphere => {
          sphere.startTime = currentTime;
          sphere.active = true;
          sphere.mesh.position.set(0, 0, 0);
          sphere.direction = generateRandomDirection();
      });
  }

// --- Animation Loop ---
function animate() {
  animationFrameId = requestAnimationFrame(animate);

    if (!effect || !materials || !camera || !renderer || !scene || !controls) return;

    const currentTime = clock.getElapsedTime();
    
  updateLineMetaball(effect);
    updateSpheres(currentTime);
  controls.update();

    if (currentMaterial.value === 'shader' && !isPixelated.value) {
      materials.shader.uniforms.uTime.value = currentTime;
      materials.shader.uniforms.viewVector.value = camera.position;
  }

  if (isPixelated.value && composer) {
      composer.render();
  } else {
      renderer.render(scene, camera);
  }
}

// --- Resize Handler ---
function handleResize() {
    if (!camera || !renderer || !materials) return;
    const width = canvasContainer.value?.clientWidth ?? window.innerWidth;
    const height = canvasContainer.value?.clientHeight ?? window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    if (composer) {
        composer.setSize(width, height);
    }

    if (materials.shader) {
        materials.shader.uniforms.uResolution.value.set(width, height);
    }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  if (!canvasContainer.value) {
    console.error("Canvas container not found!");
    return;
  }
  const container = canvasContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  scene = new THREE.Scene();
    scene.background = null;

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 25);
  camera.lookAt(scene.position);

  // Renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
    controls.autoRotate = isAutoRotating.value;
    controls.autoRotateSpeed = 5.0;
    
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);

  // PMREMGenerator
  pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // Materials
    materials = generateMaterials();

  // Marching Cubes
    effect = new MarchingCubes(200, materials[currentMaterial.value], true, true, 100000);
    effect.isolation = 300;
  effect.scale.set(8, 8, 8);
  effect.enableUvs = false;
  effect.enableColors = false;
  scene.add(effect);

    // Post-processing Setup
  composer = new EffectComposer(renderer);
    pixelPass = new RenderPixelatedPass(5, scene, camera);
  composer.addPass(pixelPass);
  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // Clock
  clock = new THREE.Clock();

  // Load Env Map
  loadEnvironmentMap();

    // 在場景初始化後創建球體
    createSpheres();

  // Start animation
  animate();
    
    // 自動啟動流動動畫（如果預設為開啟）
    if (isFlowing.value) {
        // 立即初始化流動狀態
        console.log("初始化流動動畫狀態...");
        const currentTime = clock.getElapsedTime();
        
        // 保存當前狀態
        savedLineState = {
            lineTypes: [],
            randomDirections: [],
            currentTargetLengths: [],
            lineStartTimes: []
        };
        
        savedCameraState = {
            position: camera.position.clone(),
            quaternion: camera.quaternion.clone()
        };
        
        // 設置初始全局狀態
        globalFlowState = 'growing';
        growStartTime = currentTime;
        
        // 初始化球體
        spheres.forEach(sphere => {
            sphere.startTime = currentTime;
            sphere.active = true;
            sphere.mesh.position.set(0, 0, 0);
            sphere.direction.set(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            ).normalize();
        });

        // Load Model JSON 並在加載完成後開始動畫
        loadModelJson();
    }

  // Add resize listener
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);

  if (controls) controls.dispose();
  if (renderer) renderer.dispose();
  if (materials) {
      materials.shader?.dispose();
      materials.liquid?.dispose();
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
    if(pmremGenerator) pmremGenerator.dispose();
  
  if (canvasContainer.value && renderer) {
    canvasContainer.value.removeChild(renderer.domElement);
  }

  console.log("Three.js scene cleaned up.");
});
</script>