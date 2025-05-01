<template>
  <div class="splash-container">
    <div ref="canvasContainer" class="canvas-container"></div>
    <button 
      ref="controlButton" 
      class="control-button" 
      :disabled="!resourcesLoaded" 
      @click="handleButtonClick"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

// =========================================
// 1. 響應式狀態和參數配置
// =========================================

// --- Core Refs ---
const canvasContainer = ref(null);
const controlButton = ref(null);

// --- UI 狀態 ---
const resourcesLoaded = ref(false);
const isPlaying = ref(false);
const buttonText = computed(() => isPlaying.value ? '返回' : '播放');

// --- 線條參數配置 ---
const ttParams = reactive({
  startStrength: 0.1,    // 粗到細線條：起始端粗度
  endStrength: 0.01,     // 粗到細線條：末端粗度
  minLength: 2.5,        // 粗到細線條：最小長度
  maxLength: 3.5,        // 粗到細線條：最大長度
  shrinkPower: 0.25,     // 粗到細線條：粗細變化曲線指數
  numLines: 4            // 粗到細線條：數量
});

const thParams = reactive({
  startStrength: 0.01,   // 細到粗線條：起始端粗度
  endStrength: 0.1,      // 細到粗線條：末端粗度
  minLength: 2,          // 細到粗線條：最小長度
  maxLength: 3,          // 細到粗線條：最大長度
  shrinkPower: 1.25,     // 細到粗線條：粗細變化曲線指數
  numLines: 3            // 細到粗線條：數量
});

// --- 流動動畫參數 ---
const animParams = reactive({
  // 基本設定
  resolution: 200,                // Marching Cubes 解析度
  growthSpeed: 5.0,               // 線條生長速度
  growthEaseOutPower: 0.15,       // 生長緩動指數
  numSegments: 50,                // 每條線分段數量
  subtract: 20,                   // Metaball 減法參數
  
  // 流動效果設定
  flowGrowthSpeedFactor: 0.1,
  flowWaveAmplitudeFactorAtStart: 0.5,     // 流動模式下的生長速度因子
  flowShrinkDurationFactor: 0.2,  // 流動模式下的收縮持續時間因子
  baseShrinkDuration: 3.0,        // 基本收縮持續時間 (秒)
  
  // 波浪效果設定
  flowWaveFrequency: 1.0,         // 波浪頻率
  flowWaveAmplitudeFactor: 0.15,  // 波浪振幅因子
  flowWavePhaseFactor: Math.PI * 4, // 波浪相位因子
});

// =========================================
// 2. Three.js 核心物件和狀態
// =========================================

// --- Three.js 核心物件 ---
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let effect = null;
let clock = null;
let material = null;
let pmremGenerator = null;
let animationFrameId = null;

// --- 線條數據 ---
let lineStartTimes = [];      // 每條線的開始時間
let randomDirections = [];    // 每條線的隨機方向向量
let currentTargetLengths = []; // 每條線的目標長度
let lineTypes = [];           // 每條線的類型 ('tt' 或 'th')
let lineFlowState = [];       // 每條線的流動狀態

// --- 流動控制狀態 ---
let shrinkStartTime = null;   // 收合開始時間
let shrinkEndTime = null;     // 收合結束時間
let growStartTime = null;     // 生長開始時間
let globalFlowState = 'idle'; // 全局流動狀態

// =========================================
// 3. 材質和環境設定
// =========================================

/**
 * 生成液體材質
 */
function generateMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.75,
    transmission: 1,   // 增加透光性
    ior: 1.5,          // 折射率
    thickness: 1.0,    // 材質厚度
    envMapIntensity: 100.0,
    side: THREE.DoubleSide
  });
}

/**
 * 載入環境貼圖
 */
function loadEnvironmentMap() {
  return new Promise((resolve, reject) => {
    new EXRLoader()
      .setPath('/hdr/')
      .load('HDR_Light_Studio_Free_HDRI_Design_04.exr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        texture.dispose();

        console.log("環境貼圖已載入");
        scene.environment = envMap;
        if (material) {
          material.envMap = envMap;
          material.needsUpdate = true;
        }
        resolve(envMap);
      }, undefined, (error) => {
        console.error('無法載入環境貼圖:', error);
        reject(error);
      });
  });
}

// =========================================
// 4. 線條和動畫控制
// =========================================

/**
 * 重新生成所有線條
 */
function regenerateLine() {
  if (!clock || !effect) return;
  const currentTime = clock.getElapsedTime();
  const totalLines = ttParams.numLines + thParams.numLines;

  // 調整陣列大小
  lineStartTimes.length = totalLines;
  randomDirections.length = totalLines;
  currentTargetLengths.length = totalLines;
  lineTypes.length = totalLines;
  lineFlowState.length = totalLines;

  let lineIndex = 0;

  // 生成由粗到細線條
  for(let i = 0; i < ttParams.numLines; i++) {
    if (!randomDirections[lineIndex]) {
      randomDirections[lineIndex] = new THREE.Vector3();
    }
    randomDirections[lineIndex]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    currentTargetLengths[lineIndex] = THREE.MathUtils.randFloat(ttParams.minLength, ttParams.maxLength);
    lineTypes[lineIndex] = 'tt';
    lineStartTimes[lineIndex] = currentTime;
    
    // 設置初始流動狀態
    if (globalFlowState) {
      lineFlowState[lineIndex] = globalFlowState;
    } else {
      lineFlowState[lineIndex] = 'growing';
    }
    
    lineIndex++;
  }

  // 生成由細到粗線條
  for(let i = 0; i < thParams.numLines; i++) {
    if (!randomDirections[lineIndex]) {
      randomDirections[lineIndex] = new THREE.Vector3();
    }
    randomDirections[lineIndex]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    currentTargetLengths[lineIndex] = THREE.MathUtils.randFloat(thParams.minLength, thParams.maxLength);
    lineTypes[lineIndex] = 'th';
    lineStartTimes[lineIndex] = currentTime;
    
    // 設置初始流動狀態
    if (globalFlowState) {
      lineFlowState[lineIndex] = globalFlowState;
    } else {
      lineFlowState[lineIndex] = 'growing';
    }
    
    lineIndex++;
  }
  effect.reset();
}

/**
 * 更新Metaball線條效果
 */
function updateLineMetaball(obj) {
  if (!clock) return;
  obj.reset();
  const currentTime = clock.getElapsedTime();
  const centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
  const totalLines = ttParams.numLines + thParams.numLines;

  // 更新全局流動狀態
  updateGlobalFlowState(currentTime);

  // 處理每條線的metaball效果
  for (let lineIndex = 0; lineIndex < totalLines; lineIndex++) {
    if (lineStartTimes[lineIndex] === undefined || currentTime < lineStartTimes[lineIndex]) {
      continue;
    }

    if (currentTargetLengths[lineIndex] === undefined) continue;
    const localMaxLength = currentTargetLengths[lineIndex] / obj.scale.x;
    let localCurrentLength = 0;
    let timeSinceStart = currentTime - lineStartTimes[lineIndex];

    // 計算當前線條長度
    if (globalFlowState === 'pauseAtStart') {
      // 在收合完成狀態下，線條仍可見但保持最短
      localCurrentLength = 0.05; // 調大一點以確保可見流動效果
    } else if (globalFlowState === 'pauseAtEnd') {
      // 在生長完成狀態下，線條保持最長
      localCurrentLength = localMaxLength;
    } else if (globalFlowState === 'growing') {
      // 生長狀態
      if (localMaxLength > 0.001) {
        const currentGrowthSpeed = animParams.growthSpeed * animParams.flowGrowthSpeedFactor;
        const linearDuration = localMaxLength / (currentGrowthSpeed / obj.scale.x);
        const normalizedTime = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
        const easedTime = Math.pow(normalizedTime, animParams.growthEaseOutPower);
        localCurrentLength = easedTime * localMaxLength;
      } else {
        localCurrentLength = 0;
      }
    } else if (globalFlowState === 'shrinking') {
      // 收縮狀態
      if (shrinkStartTime !== null && shrinkEndTime !== null) {
        const shrinkDuration = shrinkEndTime - shrinkStartTime;
        const timeSinceShrinking = currentTime - shrinkStartTime;
        const shrinkProgress = Math.min(timeSinceShrinking / shrinkDuration, 1.0);
        const shrinkFactor = Math.max(0, 1.0 - shrinkProgress);
        
        // 當按下return開始收縮時，我們需要從當前長度開始收縮
        const currentGrowthSpeed = animParams.growthSpeed * animParams.flowGrowthSpeedFactor;
        const linearDuration = localMaxLength / (currentGrowthSpeed / obj.scale.x);
        const normalizedTime = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
        const easedTime = Math.pow(normalizedTime, animParams.growthEaseOutPower);
        const lengthBeforeShrinking = easedTime * localMaxLength;
        
        // 從當前長度開始按比例收縮
        localCurrentLength = lengthBeforeShrinking * shrinkFactor;
      } else {
        localCurrentLength = localMaxLength;
      }
    } else {
      // 默認狀態 - 靜態展示
      if (localMaxLength > 0.001) {
        const normalizedTime = Math.min(timeSinceStart / (localMaxLength / (animParams.growthSpeed / obj.scale.x)), 1.0);
        const easedTime = Math.pow(normalizedTime, animParams.growthEaseOutPower);
        localCurrentLength = easedTime * localMaxLength;
      } else {
        localCurrentLength = 0;
      }
    }
    
    // 如果線條過短則跳過
    if (localCurrentLength <= 0.001) continue;

    const currentDirection = randomDirections[lineIndex];
    const currentLineType = lineTypes[lineIndex];
    if (!currentDirection || !currentLineType) continue;

    // 根據線條類型選擇參數
    let lineStartStrength, lineEndStrength, lineShrinkPowerVal;
    if (currentLineType === 'tt') {
      lineStartStrength = ttParams.startStrength;
      lineEndStrength = ttParams.endStrength;
      lineShrinkPowerVal = ttParams.shrinkPower;
    } else { // 'th'
      lineStartStrength = thParams.startStrength;
      lineEndStrength = thParams.endStrength;
      lineShrinkPowerVal = thParams.shrinkPower;
    }

    // 計算Metaball強度和位置
    for (let i = 0; i <= animParams.numSegments; i++) {
      const segmentT = i / animParams.numSegments;
      const strengthFactor = Math.pow(segmentT, lineShrinkPowerVal);
      const baseStrength = THREE.MathUtils.lerp(lineStartStrength, lineEndStrength, strengthFactor);

      // 添加波浪效果
      let dynamicStrength = baseStrength;
      // 永遠啟用波浪效果，不受狀態影響
      let flowAmplitude;
      if (globalFlowState === 'pauseAtStart') {
        // 當線條處於原點時，使用更大的波浪振幅
        flowAmplitude = animParams.flowWaveAmplitudeFactorAtStart * baseStrength;
      } else {
        // 其他狀態使用標準振幅
        flowAmplitude = animParams.flowWaveAmplitudeFactor * baseStrength;
      }
      const flowOffset = Math.sin(currentTime * animParams.flowWaveFrequency - segmentT * animParams.flowWavePhaseFactor) * flowAmplitude;
      dynamicStrength += flowOffset;
      dynamicStrength = Math.max(dynamicStrength, 0);

      // 設置球體位置
      const localPos = currentDirection.clone().multiplyScalar(localCurrentLength * segmentT);
      const finalPos = localPos.add(centerOffset);

      // 添加Metaball
      obj.addBall(finalPos.x, finalPos.y, finalPos.z, dynamicStrength, animParams.subtract);
    }
  }

  obj.update();
}

// =========================================
// 5. 流動狀態控制
// =========================================

/**
 * 更新全局流動狀態
 */
function updateGlobalFlowState(currentTime) {
  if (!clock) return;
  
  // 檢查當前時間和設定的時間節點
  if (globalFlowState === 'growing' && growStartTime !== null) {
    // 計算所有線條的平均生長完成度
    const totalLines = ttParams.numLines + thParams.numLines;
    let totalGrowthProgress = 0;
    let activeLines = 0;
    
    for (let i = 0; i < totalLines; i++) {
      if (lineStartTimes[i] === undefined || currentTargetLengths[i] === undefined) continue;
      
      activeLines++;
      const localMaxLength = currentTargetLengths[i] / (effect?.scale.x || 1);
      const timeSinceStart = currentTime - (lineStartTimes[i] || currentTime);
      const currentGrowthSpeed = animParams.growthSpeed * animParams.flowGrowthSpeedFactor;
      const linearDuration = localMaxLength / (currentGrowthSpeed / (effect?.scale.x || 1));
      const growthProgress = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
      
      totalGrowthProgress += growthProgress;
    }
    
    const averageProgress = activeLines > 0 ? totalGrowthProgress / activeLines : 0;
    
    // 當平均生長進度達到99%以上，切換到暫停狀態
    if (averageProgress >= 0.99) {
      globalFlowState = 'pauseAtEnd';
      console.log("所有線條已生長完成，暫停動畫");
    }
  } else if (globalFlowState === 'shrinking' && shrinkStartTime !== null && shrinkEndTime !== null) {
    // 檢查是否達到收合結束時間
    if (currentTime >= shrinkEndTime) {
      globalFlowState = 'pauseAtStart';
      console.log("所有線條已收合完成，進入起始暫停狀態");
    }
  }
}

/**
 * 開始同步收合所有線條
 */
function startSyncShrinking() {
  if (!clock) return;
  const currentTime = clock.getElapsedTime();
  
  console.log("所有線條同步收合");
  
  // 更新全局狀態
  globalFlowState = 'shrinking';
  
  // 設置收合時間
  shrinkStartTime = currentTime;
  shrinkEndTime = currentTime + animParams.baseShrinkDuration * animParams.flowShrinkDurationFactor;
  
  // 保持現有線條方向和目標長度，只更新起始時間
  const totalLines = ttParams.numLines + thParams.numLines;
  for (let i = 0; i < totalLines; i++) {
    if (lineStartTimes[i] === undefined) continue;
    // 更新線條狀態和時間，但保持當前方向和目標長度
    lineFlowState[i] = 'shrinking';
  }
}

/**
 * 開始同步生長所有線條
 */
function startSyncGrowing() {
  if (!clock) return;
  const currentTime = clock.getElapsedTime();
  const totalLines = ttParams.numLines + thParams.numLines;
  
  console.log("所有線條同步生長");
  
  // 更新全局狀態
  globalFlowState = 'growing';
  growStartTime = currentTime;
  
  // 重置所有線條的方向和長度
  for (let i = 0; i < totalLines; i++) {
    if (lineStartTimes[i] === undefined) continue;
    
    // 重新生成隨機方向
    if (!randomDirections[i]) randomDirections[i] = new THREE.Vector3();
    randomDirections[i]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    
    // 更新線條類型和長度
    lineTypes[i] = (i < ttParams.numLines) ? 'tt' : 'th';
    const minL = (lineTypes[i] === 'tt') ? ttParams.minLength : thParams.minLength;
    const maxL = (lineTypes[i] === 'tt') ? ttParams.maxLength : thParams.maxLength;
    currentTargetLengths[i] = THREE.MathUtils.randFloat(minL, maxL);
    
    // 更新線條狀態
    lineStartTimes[i] = currentTime;
    lineFlowState[i] = 'growing';
  }
}

// =========================================
// 6. 動畫和渲染
// =========================================

/**
 * 動畫主循環
 */
function animate() {
  animationFrameId = requestAnimationFrame(animate);

  if (!effect || !material || !camera || !renderer || !scene || !controls) return;

  // 更新場景邏輯
  updateLineMetaball(effect);
  
  // 確保控制器始終更新 - 保持自動旋轉
  controls.update();
  
  // 渲染場景
  renderer.render(scene, camera);
}

/**
 * 處理視窗大小變化
 */
function handleResize() {
  if (!camera || !renderer) return;
  const width = canvasContainer.value?.clientWidth ?? window.innerWidth;
  const height = canvasContainer.value?.clientHeight ?? window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// =========================================
// 7. 生命週期鉤子
// =========================================

/**
 * 初始化Three.js場景和相關物件
 */
function initializeScene() {
  if (!canvasContainer.value) {
    console.error("Canvas container not found!");
    return false;
  }
  
  const container = canvasContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // 場景
  scene = new THREE.Scene();
  scene.background = null;

  // 相機
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 30);
  camera.lookAt(scene.position);

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true; // 永遠啟用自動旋轉
  controls.autoRotateSpeed = 2.0;

  // PMREMGenerator
  pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // 材質
  material = generateMaterial();

  // Marching Cubes
  const derivedIsolation = animParams.resolution * 1.5;
  effect = new MarchingCubes(animParams.resolution, material, true, true, 100000);
  effect.isolation = derivedIsolation;
  effect.scale.set(8, 8, 8);
  effect.enableUvs = false;
  effect.enableColors = false;
  scene.add(effect);

  // 時鐘
  clock = new THREE.Clock();
  
  return true;
}

/**
 * 清理Three.js資源
 */
function cleanupScene() {
  // 停止動畫
  cancelAnimationFrame(animationFrameId);

  // 移除視窗大小變化監聽
  window.removeEventListener('resize', handleResize);

  // 清理Three.js資源
  if (controls) controls.dispose();
  if (renderer) renderer.dispose();
  if (material) {
    material.dispose();
    if (scene?.environment) scene.environment.dispose();
  }
  
  if (effect) {
    scene?.remove(effect);
  }
  
  if (scene) {
    // 清理場景中的物件
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();
        const objMaterial = object.material;
        if (Array.isArray(objMaterial)) {
          objMaterial.forEach((mat) => mat.dispose());
        } else if (objMaterial) {
          objMaterial.dispose();
        }
      }
    });
  }
  
  if (pmremGenerator) pmremGenerator.dispose();

  // 移除畫布
  if (canvasContainer.value && renderer) {
    canvasContainer.value.removeChild(renderer.domElement);
  }

  console.log("Three.js場景已清理");
}

// =========================================
// 8. 用戶互動控制
// =========================================

/**
 * 處理按鈕點擊事件
 */
function handleButtonClick() {
  if (isPlaying.value) {
    // 返回按鈕被點擊 - 立即變成播放狀態並開始收合動畫
    isPlaying.value = false;
    console.log("返回按鈕被點擊，立即開始收合動畫");
    startShrinkingAnimation();
  } else {
    // 播放按鈕被點擊 - 立即變成返回狀態並開始生長動畫
    isPlaying.value = true;
    console.log("播放按鈕被點擊，立即開始生長動畫");
    startGrowingAnimation();
  }
}

/**
 * 開始生長動畫
 */
function startGrowingAnimation() {
  // 不管當前是什麼狀態，直接切換到生長狀態
  globalFlowState = 'growing';
  startSyncGrowing();
}

/**
 * 開始收合動畫
 */
function startShrinkingAnimation() {
  // 不管當前是什麼狀態，直接切換到收合狀態
  globalFlowState = 'shrinking';
  startSyncShrinking();
}

/**
 * 初始化為收合狀態
 */
function initializeCollapsedState() {
  // 設置全局狀態為收合完成
  globalFlowState = 'pauseAtStart';
  
  // 初始線條生成（但保持最小長度）
  regenerateLine();
  
  // 設置所有線條狀態為初始狀態
  const totalLines = ttParams.numLines + thParams.numLines;
  for (let i = 0; i < totalLines; i++) {
    if (lineFlowState[i] === undefined) continue;
    lineFlowState[i] = 'pauseAtStart';
  }
  
  console.log("初始化完成：線條收合狀態");
}

onMounted(() => {
  // 初始化場景
  if (!initializeScene()) return;

  // 開始動畫循環（但不啟動流動）
  animate();
  
  // 載入環境貼圖
  loadEnvironmentMap().then(() => {
    console.log('環境貼圖載入完成');
    
    // 初始化為收合狀態
    initializeCollapsedState();
    
    // 資源載入完成，啟用按鈕
    resourcesLoaded.value = true;
    
  }).catch(error => {
    console.error('環境貼圖載入失敗:', error);
  });

  // 監聽視窗大小變化
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cleanupScene();
});
</script>