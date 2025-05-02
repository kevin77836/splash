<template>
  <div class="c-splash-component">
    <div ref="canvasContainer" class="canvas-container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

// 父組件事件
const emit = defineEmits([
  'stateChange',       // 狀態變化事件
  'animationComplete', // 動畫完成事件
  'resourcesLoaded'    // 資源載入完成事件
]);

// =========================================
// 1. 響應式狀態和參數配置
// =========================================

// --- Core Refs ---
const canvasContainer = ref(null);

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

// --- 球體參數配置 ---
const sphereParams = reactive({
  count: 20,           // 球體數量
  minRadius: 0.35,      // 最小半徑
  maxRadius: 0.5,      // 最大半徑
  minLength: 3.0,      // 最小目標長度
  maxLength: 10.0,      // 最大目標長度
  segmentDetail: 16,   // 幾何體細分
  minScale: 0        // 最小縮放值(原點狀態)
});

// --- 流動動畫參數 ---
const animParams = reactive({
  // 基本設定
  mobileResolution: 100,
  resolution: 100,                // Marching Cubes 解析度
  numSegments: 50,                // 每條線分段數量
  subtract: 20,                   // Metaball 減法參數
  
  // 統一動畫控制參數
  growSpeed: 0.1,                 // 生長速度 (值越大生長越快)
  growthEaseOutPower: 0.15,       // 生長緩動指數 (值越小結尾越平滑)
  shrinkSpeed: 1,               // 收縮速度 (值越大收縮越快)
  shrinkEaseInPower: 2.5,         // 收縮緩動指數 (值越大開頭越快)
  
  // 波浪效果設定
  flowWaveFrequency: 1.0,         // 波浪頻率
  flowWaveAmplitudeFactor: 0.3,  // 波浪振幅因子
  flowWaveAmplitudeFactorAtStart: 1.5, // 原點狀態下的波浪振幅因子
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

// --- 滑鼠控制變量 ---
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let targetPositionX = 0;
let targetPositionY = 0;
let modelRotationX = 0;
let modelRotationY = 0;

// --- 線條數據 ---
let lineStartTimes = [];      // 每條線的開始時間
let randomDirections = [];    // 每條線的隨機方向向量
let currentTargetLengths = []; // 每條線的目標長度
let lineTypes = [];           // 每條線的類型 ('tt' 或 'th')
let lineFlowState = [];       // 每條線的流動狀態

// --- 球體特效 ---
let spheres = [];             // 儲存所有射出的球體
let sphereMaterial = null;    // 共用球體材質

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
    envMapIntensity: 10.0,
    side: THREE.DoubleSide
  });
}

/**
 * 生成球體材質 - 與主材質相似但更透明
 */
function generateSphereMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.75,
    transmission: 1,
    ior: 1.5,
    thickness: 0.1,
    envMapIntensity: 10.0,
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
        
        // 更新主材質
        if (material) {
          material.envMap = envMap;
          material.needsUpdate = true;
        }
        if (sphereMaterial) {
          sphereMaterial.envMap = envMap;
          sphereMaterial.needsUpdate = true;
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
        const currentGrowthSpeed = animParams.growSpeed;
        const linearDuration = localMaxLength / currentGrowthSpeed;
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
        const linearShrinkProgress = Math.min(timeSinceShrinking / shrinkDuration, 1.0);
        // 使用收縮緩動參數
        const shrinkProgress = Math.pow(linearShrinkProgress, animParams.shrinkEaseInPower);
        const shrinkFactor = Math.max(0, 1.0 - shrinkProgress);
        
        // 當按下return開始收縮時，我們需要從當前長度開始收縮
        const currentGrowthSpeed = animParams.growSpeed;
        const linearDuration = localMaxLength / currentGrowthSpeed;
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
        const normalizedTime = Math.min(timeSinceStart / (localMaxLength / animParams.growSpeed), 1.0);
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
      // 根據狀態選擇不同的振幅因子
      if (globalFlowState === 'pauseAtStart') {
        // 當線條處於原點時，使用更大的波浪振幅
        flowAmplitude = animParams.flowWaveAmplitudeFactorAtStart * baseStrength;
      } else if (globalFlowState === 'shrinking' && localCurrentLength < 0.1) {
        // 當線條收縮接近原點時，也使用較大的波浪振幅
        // 根據收縮進度平滑過渡振幅
        const transitionFactor = Math.max(0, Math.min(1, 10 * (0.1 - localCurrentLength)));
        const normalAmplitude = animParams.flowWaveAmplitudeFactor * baseStrength;
        const startAmplitude = animParams.flowWaveAmplitudeFactorAtStart * baseStrength;
        flowAmplitude = normalAmplitude + transitionFactor * (startAmplitude - normalAmplitude);
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
      const currentGrowthSpeed = animParams.growSpeed;
      const linearDuration = localMaxLength / currentGrowthSpeed;
      const growthProgress = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
      
      totalGrowthProgress += growthProgress;
    }
    
    const averageProgress = activeLines > 0 ? totalGrowthProgress / activeLines : 0;
    
    // 當平均生長進度達到99%以上，切換到暫停狀態
    if (averageProgress >= 0.99) {
      updateFlowState('pauseAtEnd');
    }
  } else if (globalFlowState === 'shrinking' && shrinkStartTime !== null && shrinkEndTime !== null) {
    // 檢查是否達到收合結束時間
    if (currentTime >= shrinkEndTime) {
      updateFlowState('pauseAtStart');
    }
  }
}

/**
 * 創建並發射一個球體
 */
function createSphere(direction, size) {
  const geometry = new THREE.SphereGeometry(size, sphereParams.segmentDetail, sphereParams.segmentDetail);
  
  // 使用共用材質
  if (!sphereMaterial) {
    sphereMaterial = generateSphereMaterial();
  }
  
  const sphere = new THREE.Mesh(geometry, sphereMaterial);
  
  // 設置初始位置為原點
  sphere.position.set(0, 0, 0);
  
  // 儲存球體數據
  const sphereData = {
    mesh: sphere,
    direction: direction,
    targetLength: 0,                  // 將在更新時設置
    initialScale: size,
    active: true,
    progress: 0,                      // 當前進度 (0-1)
    currentPosition: 0,               // 當前位置長度
    lastUpdateTime: clock ? clock.getElapsedTime() : 0,  // 上次更新時間
    transitionStartTime: null,        // 轉換開始時間
    transitionStartPos: 0             // 轉換開始位置
  };
  
  // 添加到場景和球體陣列
  scene.add(sphere);
  spheres.push(sphereData);
  
  return sphereData;
}

/**
 * 初始化所有球體
 */
function initSpheres() {
  // 清理現有球體
  clearSpheres();
  
  // 創建新球體
  for (let i = 0; i < sphereParams.count; i++) {
    // 隨機方向
    const direction = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();
    
    // 隨機大小
    const size = sphereParams.minRadius + Math.random() * (sphereParams.maxRadius - sphereParams.minRadius);
    
    // 創建球體
    const sphere = createSphere(direction, size);
    
    // 設置目標長度 (與線條相似的範圍)
    sphere.targetLength = THREE.MathUtils.randFloat(sphereParams.minLength, sphereParams.maxLength);
  }
}

/**
 * 清理所有球體
 */
function clearSpheres() {
  // 從場景中移除所有球體並釋放資源
  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i];
    
    if (sphere.mesh) {
      scene.remove(sphere.mesh);
      sphere.mesh.geometry.dispose();
    }
  }
  
  // 清空陣列
  spheres = [];
}

/**
 * 更新球體位置和狀態
 * 支持從任何位置開始收合/生長
 */
function updateSpheres() {
  if (!clock) return;
  
  const currentTime = clock.getElapsedTime();
  
  // 計算線條的平均生長進度，用於同步球體
  let linesAverageProgress = 1.0;
  
  if (globalFlowState === 'growing' && growStartTime !== null) {
    // 只有在生長狀態時才需要計算線條進度
    const totalLines = ttParams.numLines + thParams.numLines;
    let totalGrowthProgress = 0;
    let activeLines = 0;
    
    for (let i = 0; i < totalLines; i++) {
      if (lineStartTimes[i] === undefined || currentTargetLengths[i] === undefined) continue;
      
      activeLines++;
      const localMaxLength = currentTargetLengths[i] / (effect?.scale.x || 1);
      const timeSinceStart = currentTime - (lineStartTimes[i] || currentTime);
      const currentGrowthSpeed = animParams.growSpeed;
      const linearDuration = localMaxLength / currentGrowthSpeed;
      const growthProgress = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
      
      totalGrowthProgress += growthProgress;
    }
    
    linesAverageProgress = activeLines > 0 ? totalGrowthProgress / activeLines : 1.0;
  }
  
  // 更新每個球體
  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i];
    if (!sphere.active || !sphere.mesh) continue;
    
    let currentPosition = 0;
    
    // 根據全局流動狀態更新球體位置
    if (globalFlowState === 'pauseAtStart') {
      // 原點狀態
      currentPosition = 0;
    } else if (globalFlowState === 'pauseAtEnd') {
      // 完全展開狀態
      currentPosition = sphere.targetLength;
    } else if (globalFlowState === 'growing') {
      // 生長狀態 - 與線條同步
      if (growStartTime !== null) {
        // 記錄起始位置（僅在狀態變化時）
        if (sphere.transitionStartTime !== growStartTime) {
          sphere.transitionStartTime = growStartTime;
          sphere.transitionStartPos = sphere.currentPosition;
        }
        
        // 使用與線條相同的平均進度，確保同步
        const totalProgress = Math.pow(linesAverageProgress, animParams.growthEaseOutPower);
        
        // 計算應該增長的距離比例
        const targetGrowthDist = sphere.targetLength - sphere.transitionStartPos;
        const growthDistance = targetGrowthDist * totalProgress;
        
        // 新位置是起始位置加上生長的距離
        currentPosition = sphere.transitionStartPos + growthDistance;
        
        // 當線條接近完成時，確保球體也完全到位
        if (linesAverageProgress >= 0.99) {
          currentPosition = sphere.targetLength;
        }
      }
    } else if (globalFlowState === 'shrinking') {
      // 收縮狀態 - 從當前位置開始收縮
      if (shrinkStartTime !== null && shrinkEndTime !== null) {
        // 如果這是狀態轉換的開始，記錄起始位置
        if (sphere.transitionStartTime !== shrinkStartTime) {
          sphere.transitionStartTime = shrinkStartTime;
          sphere.transitionStartPos = sphere.currentPosition;
        }
        
        const shrinkDuration = shrinkEndTime - shrinkStartTime;
        const timeSinceShrink = currentTime - shrinkStartTime;
        // 使用收縮緩動參數計算進度
        const linearShrinkProgress = Math.min(timeSinceShrink / shrinkDuration, 1.0);
        const shrinkProgress = Math.pow(linearShrinkProgress, animParams.shrinkEaseInPower);
        
        // 計算應該收縮的距離比例
        const targetShrinkDist = sphere.transitionStartPos;
        const shrinkDistance = targetShrinkDist * shrinkProgress;
        
        // 新位置是起始位置減去收縮的距離
        currentPosition = sphere.transitionStartPos - shrinkDistance;
        
        // 當收縮接近完成時，確保球體完全歸零
        if (shrinkProgress >= 0.99) {
          currentPosition = 0;
        }
      }
    }
    
    // 確保位置在有效範圍內
    currentPosition = Math.max(0, Math.min(currentPosition, sphere.targetLength));
    
    // 更新球體當前位置
    sphere.currentPosition = currentPosition;
    
    // 計算球體進度比例 (0-1)
    sphere.progress = sphere.targetLength > 0 ? currentPosition / sphere.targetLength : 0;
    
    // 根據進度計算位置
    const spherePosition = sphere.direction.clone().multiplyScalar(currentPosition);
    sphere.mesh.position.copy(spherePosition);
    
    // 根據進度計算大小
    let scale;
    if (currentPosition < 0.01) {
      scale = sphereParams.minScale; // 保持最小可見大小
    } else {
      // 根據距離計算大小，確保球體大小與位置成比例
      const sizeProgress = Math.min(sphere.progress * 1.5, 1.0); // 略微加速大小變化
      scale = sphereParams.minScale + (sphere.initialScale - sphereParams.minScale) * sizeProgress;
    }
    
    sphere.mesh.scale.set(scale, scale, scale);
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
  
  // 更新球體
  updateSpheres();
  
  // 平滑過渡到目標旋轉角度
  modelRotationX += (targetRotationX - modelRotationX) * 0.05;
  modelRotationY += (targetRotationY - modelRotationY) * 0.05;
  
  // 應用旋轉到場景
  scene.rotation.x = modelRotationX;
  scene.rotation.y = modelRotationY;
  scene.position.x = targetPositionX;
  scene.position.y = targetPositionY;
  
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

  // 禁止縮放和平移，只允許旋轉
  controls.enableZoom = false;     // 禁止縮放
  controls.enablePan = false;      // 禁止平移
  controls.enableRotate = false;
  controls.minDistance = camera.position.length(); // 固定距離
  controls.maxDistance = camera.position.length(); // 固定距離

  // PMREMGenerator
  pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // 材質
  material = generateMaterial();

  // Marching Cubes
  let resolution;
  if (!isMobileDevice()){
    controls.autoRotate = false;
    resolution = animParams.resolution;
  }else{
    controls.autoRotate = true; // 永遠啟用自動旋轉
    controls.autoRotateSpeed = 1.0;
    resolution = animParams.mobileResolution;
  }
  const derivedIsolation = resolution * 1.5;
  effect = new MarchingCubes(resolution, material, true, true, 100000);
  effect.isolation = derivedIsolation;
  effect.scale.set(8, 8, 8);
  effect.enableUvs = false;
  effect.enableColors = false;
  scene.add(effect);

  // 時鐘
  clock = new THREE.Clock();
  
  // 初始化共用材質
  sphereMaterial = generateSphereMaterial();
  
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

  // 清理球體
  clearSpheres();

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

  // 清理球體材質
  if (sphereMaterial) {
    sphereMaterial.dispose();
  }

  console.log("Three.js場景已清理");
}

// =========================================
// 8. 用戶互動控制
// =========================================

/**
 * 檢查是否為行動裝置
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 開始生長動畫
 */
function startGrowingAnimation() {
  // 不管當前是什麼狀態，直接切換到生長狀態
  if(globalFlowState!=='growing' && globalFlowState!=='pauseAtEnd') {
    globalFlowState = 'growing';
    startSyncGrowing();
  }
}

/**
 * 開始收合動畫
 */
function startShrinkingAnimation() {
  // 不管當前是什麼狀態，直接切換到收合狀態
  if(globalFlowState!=='shrinking' && globalFlowState!=='pauseAtStart') {
    globalFlowState = 'shrinking';
    startSyncShrinking();
  }
}

/**
 * 初始化為收合狀態
 */
function initializeCollapsedState() {
  // 設置全局狀態為收合完成
  updateFlowState('pauseAtStart');
  
  // 初始線條生成（但保持最小長度）
  regenerateLine();
  
  // 初始化球體
  initSpheres();
  
  // 設置所有線條狀態為初始狀態
  const totalLines = ttParams.numLines + thParams.numLines;
  for (let i = 0; i < totalLines; i++) {
    if (lineFlowState[i] === undefined) continue;
    lineFlowState[i] = 'pauseAtStart';
  }
  
  console.log("初始化完成：線條收合狀態");
}

// 當狀態改變時通知父組件
function updateFlowState(newState) {
  globalFlowState = newState;
  emit('stateChange', newState);
  
  // 檢查是否完成特定狀態，通知父組件
  if (newState === 'pauseAtEnd') {
    console.log("所有線條已生長完成，暫停動畫");
    emit('animationComplete', 'growing');
  } else if (newState === 'pauseAtStart') {
    console.log("所有線條已收合完成，進入起始暫停狀態");
    emit('animationComplete', 'shrinking');
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
  
  // 確保球體已初始化
  if (spheres.length === 0) {
    initSpheres();
  }
  
  // 更新全局狀態
  updateFlowState('growing');
  growStartTime = currentTime;
  
  // 不需要更新球體進度方向，updateSpheres 會根據全局狀態自動處理
  
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

/**
 * 開始同步收合所有線條
 */
function startSyncShrinking() {
  if (!clock) return;
  const currentTime = clock.getElapsedTime();
  
  console.log("所有線條同步收合");
  
  // 更新全局狀態
  updateFlowState('shrinking');
  
  // 設置收合時間
  shrinkStartTime = currentTime;
  // 使用直接的收縮速度參數，值越大收縮越快，因此需要倒數
  shrinkEndTime = currentTime + (1.0 / animParams.shrinkSpeed);
  
  // 不需要更新球體進度方向，updateSpheres 會根據全局狀態自動處理
  
  // 保持現有線條方向和目標長度，只更新起始時間
  const totalLines = ttParams.numLines + thParams.numLines;
  for (let i = 0; i < totalLines; i++) {
    if (lineStartTimes[i] === undefined) continue;
    // 更新線條狀態和時間，但保持當前方向和目標長度
    lineFlowState[i] = 'shrinking';
  }
}

/**
 * 添加滑鼠控制事件
 */
function addMouseControlEvents() {
  const container = canvasContainer.value;
  if (!container) return;
  
  // 只有在非行動裝置上才添加滑鼠控制
  if (!isMobileDevice()) {
    console.log('啟用桌面滑鼠控制');
    window.addEventListener('mousemove', onMouseMove);
  } else {
    console.log('行動裝置，不啟用滑鼠控制');
  }
}

/**
 * 移除滑鼠控制事件
 */
function removeMouseControlEvents() {
  const container = canvasContainer.value;
  if (!container) return;
  
  // 無論是否為行動裝置，都應移除事件以防止內存洩漏
  window.removeEventListener('mousemove', onMouseMove);
}

/**
 * 滑鼠移動事件處理
 */
function onMouseMove(event) {
  // 如果是行動裝置，則直接返回不處理
  if (isMobileDevice()) return;
  
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  targetPositionX = (event.clientX - centerX) * 0.001;
  targetPositionY = -(event.clientY - centerY) * 0.001;

  // 更新目標旋轉角度 (滑鼠水平移動控制Y軸旋轉，垂直移動控制X軸旋轉)
  targetRotationY = (event.clientX / window.innerWidth)  * 2 - 1;
  targetRotationX = (event.clientY / window.innerHeight) * 2 - 1;
  
  // 限制垂直旋轉範圍
  targetRotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, targetRotationX));
  targetRotationY = Math.max(-Math.PI/3, Math.min(Math.PI/3, targetRotationY));
  
  // 更新滑鼠位置
  mouseX = event.clientX;
  mouseY = event.clientY;
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
    
    // 通知父組件資源已載入
    emit('resourcesLoaded', true);
    
  }).catch(error => {
    console.error('環境貼圖載入失敗:', error);
  });

  // 監聽視窗大小變化
  window.addEventListener('resize', handleResize);

  // 添加滑鼠控制事件
  addMouseControlEvents();
});

onUnmounted(() => {
  cleanupScene();

  // 移除滑鼠控制事件
  removeMouseControlEvents();
});

// 暴露方法給父組件
defineExpose({
  startGrowingAnimation,
  startShrinkingAnimation,
});
</script>