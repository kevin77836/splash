<template>
  <div class="splash-container">
    <div ref="canvasContainer" class="splash-canvas"></div>
    <button 
      ref="controlButton" 
      class="control-button" 
      :disabled="isLoading" 
      @click="toggleAnimation">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

// --- 狀態管理 ---
const isLoading = ref(true);
const buttonText = ref('Play');
const animationState = ref('stopped'); // 'stopped', 'playing', 'returning'

// --- 配置參數 ---
const CONFIG = {
  scene: {
    scale: 8,              // 模型縮放比例
    pixelRatio: 1.5        // 渲染像素比例
  },
  metaball: {
    resolution: 200,       // Marching Cubes 解析度
    segments: 50,          // 線條分段數量
    subtract: 20,          // Metaball 減法參數
    maxBalls: 100000       // 最大球體數量
  },
  material: {
    color: 0xffffff,       // 材質顏色
    metalness: 0,        // 金屬感
    roughness: 0,          // 粗糙度
    opacity: 0.75,          // 透明度
    transmission: 1,
    ior: 1.33,
    thickness: 1.0,
    envMapIntensity: 300.0,
  },
  lines: {
    // 由粗到細線條
    thickToThin: {
      startStrength: 0.1,  // 起始端粗度
      endStrength: 0.01,   // 末端粗度
      minLength: 2.5,      // 最小長度
      maxLength: 3.5,      // 最大長度
      shrinkPower: 0.25,   // 收縮速率指數
      count: 4             // 線條數量
    },
    // 由細到粗線條
    thinToThick: {
      startStrength: 0.01, // 起始端粗度
      endStrength: 0.1,    // 末端粗度
      minLength: 2,        // 最小長度
      maxLength: 3,        // 最大長度
      shrinkPower: 1.25,   // 膨脹速率指數
      count: 3             // 線條數量
    }
  },
  controls: {
    autoRotate: true,      // 自動旋轉
    rotateSpeed: 2.0,      // 旋轉速度
    enableDamping: true    // 啟用阻尼效果
  },
  animation: {
    enabled: true,         // 是否啟用動畫
    growthSpeed: 5.0,      // 生長速度
    growthEaseOutPower: 50, // 緩動指數
    autoPlay: false        // 是否自動播放
  }
};

// --- Refs ---
const canvasContainer = ref(null);
const controlButton = ref(null);

// --- 資源管理 ---
const resources = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  effect: null,
  material: null,
  pmremGenerator: null,
  animationId: null,
  clock: null,
  
  // 線條數據
  lines: {
    directions: [],    // 方向向量
    lengths: [],       // 長度
    types: [],         // 類型
    startTimes: [],    // 動畫開始時間
    targetProgress: [], // 目標進度 (0-1)
    currentProgress: [] // 當前進度 (0-1)
  },
  
  // 清理所有資源
  dispose() {
    cancelAnimationFrame(this.animationId);
    
    if (this.controls) this.controls.dispose();
    if (this.renderer) this.renderer.dispose();
    
    if (this.material) {
      this.material.dispose();
      if (this.scene?.environment) this.scene.environment.dispose();
    }
    
    if (this.effect) this.scene?.remove(this.effect);
    
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });
    }
    
    if (this.pmremGenerator) this.pmremGenerator.dispose();
    
    if (canvasContainer.value && this.renderer) {
      canvasContainer.value.removeChild(this.renderer.domElement);
    }
  }
};

// --- 動畫控制函數 ---
function toggleAnimation() {
  if (animationState.value === 'stopped' || animationState.value === 'returning') {
    // 切換到播放狀態
    animationState.value = 'playing';
    buttonText.value = 'Return';
    
    // 設置所有線條的目標進度為 1 (完全延伸)
    setAllLinesTargetProgress(1);
  } else {
    // 切換到返回狀態
    animationState.value = 'returning';
    buttonText.value = 'Play';
    
    // 設置所有線條的目標進度為 0 (完全收回)
    setAllLinesTargetProgress(0);
  }
  
  // 記錄每條線的當前進度作為動畫起點
  captureCurrentProgress();
  
  // 重置動畫開始時間
  resetAnimationStartTimes();
}

// --- 設置所有線條的目標進度 ---
function setAllLinesTargetProgress(targetValue) {
  const { targetProgress } = resources.lines;
  const totalLines = targetProgress.length;
  
  for (let i = 0; i < totalLines; i++) {
    targetProgress[i] = targetValue;
  }
}

// --- 捕獲所有線條的當前進度 ---
function captureCurrentProgress() {
  if (!resources.clock) return;
  
  const { currentProgress } = resources.lines;
  const totalLines = currentProgress.length;
  
  // 確保我們保存的是當前的實際進度值
  for (let i = 0; i < totalLines; i++) {
    // 已經設置，不需要更改
  }
}

// --- 重置動畫開始時間 ---
function resetAnimationStartTimes() {
  if (!resources.clock) return;
  
  const currentTime = resources.clock.getElapsedTime();
  const { startTimes } = resources.lines;
  const totalLines = startTimes.length;
  
  for (let i = 0; i < totalLines; i++) {
    startTimes[i] = currentTime;
  }
}

// --- 創建液體材質 ---
function createMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: CONFIG.material.color,
    metalness: CONFIG.material.metalness,
    roughness: CONFIG.material.roughness,
    transparent: true,
    opacity: CONFIG.material.opacity,
    side: THREE.DoubleSide,
    transmission: CONFIG.material.transmission,
    ior: CONFIG.material.ior,
    thickness: CONFIG.material.thickness,
    envMapIntensity: CONFIG.material.envMapIntensity,
  });
}

// --- 載入環境貼圖 ---
function loadEnvironmentMap() {
  return new Promise((resolve, reject) => {
    new EXRLoader()
      .setPath('/hdr/')
      .load('HDR_Light_Studio_Free_HDRI_Design_04.exr', 
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          
          const envMap = resources.pmremGenerator.fromEquirectangular(texture).texture;
          resources.pmremGenerator.dispose();
          texture.dispose();
  
          resources.scene.environment = envMap;
          if (resources.material) {
            resources.material.envMap = envMap;
            resources.material.needsUpdate = true;
          }
          
          resolve(envMap);
        },
        undefined,
        (error) => {
          console.error('無法載入環境貼圖:', error);
          reject(error);
        }
      );
  });
}

// --- 生成線條 ---
function generateLines() {
  const { thickToThin, thinToThick } = CONFIG.lines;
  const totalLines = thickToThin.count + thinToThick.count;
  const currentTime = resources.clock.getElapsedTime();
  
  // 初始化數組
  resources.lines.directions = new Array(totalLines);
  resources.lines.lengths = new Array(totalLines);
  resources.lines.types = new Array(totalLines);
  resources.lines.startTimes = new Array(totalLines).fill(currentTime);
  resources.lines.targetProgress = new Array(totalLines).fill(CONFIG.animation.autoPlay ? 1 : 0);
  resources.lines.currentProgress = new Array(totalLines).fill(0);
  
  let lineIndex = 0;
  
  // 生成線條函數
  const createLine = (params, type) => {
    const direction = new THREE.Vector3(
      Math.random() * 2 - 1, 
      Math.random() * 2 - 1, 
      Math.random() * 2 - 1
    ).normalize();
    
    const length = THREE.MathUtils.randFloat(
      params.minLength,
      params.maxLength
    );
    
    resources.lines.directions[lineIndex] = direction;
    resources.lines.lengths[lineIndex] = length;
    resources.lines.types[lineIndex] = type;
    lineIndex++;
  };
  
  // 生成由粗到細線條
  for (let i = 0; i < thickToThin.count; i++) {
    createLine(thickToThin, 'tt');
  }
  
  // 生成由細到粗線條
  for (let i = 0; i < thinToThick.count; i++) {
    createLine(thinToThick, 'th');
  }
  
  // 如果效果已初始化，立即更新
  if (resources.effect) {
    updateMetaball();
  }
  
  // 初始設置動畫狀態
  if (CONFIG.animation.autoPlay) {
    animationState.value = 'playing';
    buttonText.value = 'Return';
  } else {
    animationState.value = 'stopped';
    buttonText.value = 'Play';
  }
}

// --- 更新線條動畫進度 ---
function updateLineAnimation() {
  if (!CONFIG.animation.enabled || !resources.clock) return false;
  
  // 如果不在任何動畫中，跳過更新
  if (animationState.value === 'stopped') return false;
  
  const currentTime = resources.clock.getElapsedTime();
  let anyProgressChanged = false;
  
  const { startTimes, lengths, targetProgress, currentProgress } = resources.lines;
  const totalLines = startTimes.length;
  
  for (let i = 0; i < totalLines; i++) {
    // 計算線條應該移動的方向
    const isGrowing = targetProgress[i] > currentProgress[i];
    const isShrinking = targetProgress[i] < currentProgress[i];
    
    // 如果已經達到目標進度，跳過
    if ((!isGrowing && !isShrinking) || 
        (isGrowing && currentProgress[i] >= targetProgress[i]) || 
        (isShrinking && currentProgress[i] <= targetProgress[i])) {
      continue;
    }
    
    // 計算時間進度
    const timeSinceStart = currentTime - startTimes[i];
    const localMaxLength = lengths[i];
    
    if (localMaxLength > 0.001) {
      // 計算單位時間內的進度變化
      const growthSpeed = CONFIG.animation.growthSpeed;
      const progressPerSecond = growthSpeed / localMaxLength;
      const progressDelta = progressPerSecond * timeSinceStart;
      
      // 保存舊進度以檢測變化
      const oldProgress = currentProgress[i];
      
      if (isGrowing) {
        // 向目標進度漸進
        currentProgress[i] = Math.min(
          currentProgress[i] + progressDelta, 
          targetProgress[i]
        );
      } else if (isShrinking) {
        // 向目標進度漸退
        currentProgress[i] = Math.max(
          currentProgress[i] - progressDelta, 
          targetProgress[i]
        );
      }
      
      // 應用緩動效果（可選）
      // currentProgress[i] = applyEasing(currentProgress[i]);
      
      // 檢測是否有顯著變化
      if (Math.abs(currentProgress[i] - oldProgress) > 0.001) {
        anyProgressChanged = true;
        
        // 重置起始時間以保持連續動畫
        startTimes[i] = currentTime;
      }
    }
  }
  
  // 檢查所有線條是否都達到目標，決定是否改變動畫狀態
  checkAnimationCompletion();
  
  return anyProgressChanged;
}

// --- 檢查動畫是否完成 ---
function checkAnimationCompletion() {
  const { targetProgress, currentProgress } = resources.lines;
  const totalLines = currentProgress.length;
  
  // 檢查所有線條是否都達到目標
  let allReachedTarget = true;
  
  for (let i = 0; i < totalLines; i++) {
    // 檢查每條線的進度是否接近目標進度
    if (Math.abs(currentProgress[i] - targetProgress[i]) > 0.01) {
      allReachedTarget = false;
      break;
    }
  }
  
  // 如果所有線條都達到目標
  if (allReachedTarget) {
    // 如果是返回動畫完成，轉為停止狀態
    if (animationState.value === 'returning') {
      animationState.value = 'stopped';
    }
  }
}

// --- 應用緩動效果（可根據需要調整） ---
function applyEasing(value) {
  // 二次方緩動效果
  return Math.pow(value, CONFIG.animation.growthEaseOutPower);
}

// --- 更新 Metaball 效果 ---
function updateMetaball() {
  const effect = resources.effect;
  if (!effect) return;
  
  effect.reset();
  
  const centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
  const { directions, lengths, types, currentProgress } = resources.lines;
  const totalLines = types.length;
  
  for (let i = 0; i < totalLines; i++) {
    if (!lengths[i]) continue;
    
    // 計算當前線條長度 (基於動畫進度)
    const localMaxLength = lengths[i] / effect.scale.x;
    const currentLength = localMaxLength * currentProgress[i];
    
    // 如果線條還沒有開始延伸，跳過
    if (currentLength <= 0.001) continue;
    
    const direction = directions[i];
    const type = types[i];
    
    if (!direction || !type) continue;
    
    // 根據線條類型選擇參數
    const lineParams = type === 'tt' 
      ? CONFIG.lines.thickToThin 
      : CONFIG.lines.thinToThick;
    
    // 計算 metaball 點
    for (let j = 0; j <= CONFIG.metaball.segments; j++) {
      const t = j / CONFIG.metaball.segments;
      
      // 如果超出當前延伸長度，跳過
      if (t * localMaxLength > currentLength) continue;
      
      // 調整 t 值以適應當前長度
      const adjustedT = currentLength > 0 ? (t * localMaxLength) / currentLength : 0;
      
      const strengthFactor = Math.pow(adjustedT, lineParams.shrinkPower);
      const strength = THREE.MathUtils.lerp(
        lineParams.startStrength,
        lineParams.endStrength,
        strengthFactor
      );
      
      // 計算位置
      const pos = direction.clone()
        .multiplyScalar(currentLength * adjustedT)
        .add(centerOffset);
      
      // 添加 metaball 點
      effect.addBall(
        pos.x, 
        pos.y, 
        pos.z, 
        strength, 
        CONFIG.metaball.subtract
      );
    }
  }
  
  effect.update();
}

// --- 處理視窗大小變化 ---
function handleResize() {
  if (!resources.camera || !resources.renderer) return;
  
  const width = canvasContainer.value?.clientWidth ?? window.innerWidth;
  const height = canvasContainer.value?.clientHeight ?? window.innerHeight;
  
  resources.camera.aspect = width / height;
  resources.camera.updateProjectionMatrix();
  resources.renderer.setSize(width, height);
}

// --- 初始化場景 ---
function initScene() {
  if (!canvasContainer.value) {
    console.error("找不到畫布容器!");
    return false;
  }
  
  const container = canvasContainer.value;
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  
  // 創建時鐘
  resources.clock = new THREE.Clock();
  
  // 場景
  resources.scene = new THREE.Scene();
  resources.scene.background = null; // 透明背景
  
  // 相機
  resources.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  resources.camera.position.set(0, 0, 30);
  resources.camera.lookAt(0, 0, 0);
  
  // 渲染器 (添加透明支援)
  resources.renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  });
  resources.renderer.setSize(width, height);
  resources.renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, CONFIG.scene.pixelRatio)
  );
  container.appendChild(resources.renderer.domElement);
  
  // 控制器
  resources.controls = new OrbitControls(resources.camera, resources.renderer.domElement);
  resources.controls.enableDamping = CONFIG.controls.enableDamping;
  resources.controls.autoRotate = CONFIG.controls.autoRotate;
  resources.controls.autoRotateSpeed = CONFIG.controls.rotateSpeed;
  
  // 環境貼圖處理器
  resources.pmremGenerator = new THREE.PMREMGenerator(resources.renderer);
  resources.pmremGenerator.compileEquirectangularShader();
  
  // 液體材質
  resources.material = createMaterial();
  
  // Marching Cubes 效果
  const isolation = CONFIG.metaball.resolution * 1.5;
  resources.effect = new MarchingCubes(
    CONFIG.metaball.resolution,
    resources.material,
    true, 
    true,
    CONFIG.metaball.maxBalls
  );
  
  resources.effect.isolation = isolation;
  resources.effect.scale.set(
    CONFIG.scene.scale, 
    CONFIG.scene.scale, 
    CONFIG.scene.scale
  );
  resources.effect.enableUvs = false;
  resources.effect.enableColors = false;
  resources.scene.add(resources.effect);
  
  return true;
}

// --- 渲染場景 ---
function render() {
  const { camera, renderer, scene, controls, effect } = resources;
  if (!effect || !camera || !renderer || !scene || !controls) return;
  
  // 更新控制器
  controls.update();
  
  // 更新線條動畫
  const animationUpdated = updateLineAnimation();
  
  // 如果線條動畫有更新，則更新 metaball
  if (animationUpdated) {
    updateMetaball();
  }
  
  renderer.render(scene, camera);
  
  resources.animationId = requestAnimationFrame(render);
}

// --- 生命週期掛鉤 ---
onMounted(async () => {
  if (!initScene()) return;
  
  try {
    isLoading.value = true;
    
    // 載入環境貼圖
    await loadEnvironmentMap();
    
    // 生成線條
    generateLines();
    
    // 開始渲染
    render();
    
    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize);
    
    // 載入完成，啟用按鈕
    isLoading.value = false;
  } catch (error) {
    console.error("初始化失敗:", error);
    isLoading.value = false;
  }
});

onUnmounted(() => {
  resources.dispose();
  window.removeEventListener('resize', handleResize);
});
</script>