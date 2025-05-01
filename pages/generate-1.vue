<template>
  <div ref="canvasContainer" class="splash-container"></div>
  </template>
  
  <script setup>
  import * as THREE from 'three';
  import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

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
  }
};
  
  // --- Refs ---
  const canvasContainer = ref(null);

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
  
  // 線條數據
  lines: {
    directions: [],  // 方向向量
    lengths: [],     // 長度
    types: []        // 類型
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
  
  // 初始化數組
  resources.lines.directions = new Array(totalLines);
  resources.lines.lengths = new Array(totalLines);
  resources.lines.types = new Array(totalLines);
  
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
}

// --- 更新 Metaball 效果 ---
function updateMetaball() {
  const effect = resources.effect;
  if (!effect) return;
  
                  effect.reset();
  
  const centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
  const { directions, lengths, types } = resources.lines;
  const totalLines = types.length;
  
  for (let i = 0; i < totalLines; i++) {
    if (!lengths[i]) continue;
    
    const localMaxLength = lengths[i] / effect.scale.x;
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
      const strengthFactor = Math.pow(t, lineParams.shrinkPower);
      const strength = THREE.MathUtils.lerp(
        lineParams.startStrength,
        lineParams.endStrength,
        strengthFactor
      );
      
      // 計算位置
      const pos = direction.clone()
        .multiplyScalar(localMaxLength * t)
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
  
  controls.update();
  renderer.render(scene, camera);
  
  resources.animationId = requestAnimationFrame(render);
}

// --- 生命週期掛鉤 ---
onMounted(async () => {
  if (!initScene()) return;
  
  try {
    // 載入環境貼圖
    await loadEnvironmentMap();
    
    // 生成線條
    generateLines();
    
    // 開始渲染
    render();
    
    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error("初始化失敗:", error);
  }
  });
  
  onUnmounted(() => {
  resources.dispose();
    window.removeEventListener('resize', handleResize);
});
  </script>