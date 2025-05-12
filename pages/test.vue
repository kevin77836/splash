<template>
  <div class="container">
    <canvas ref="canvasRef"></canvas>
    <button class="start-button" @click="clickStart">開始</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import gsap from 'gsap';

// 引用 DOM 元素
const canvasRef = ref(null);

// 變數定義
let renderer, camera, scene;
let meshes = [];
let clock;
let animationFrameId = null;
let controls;

// 位置狀態 - 使用 reactive 使其可響應
const position = reactive({
  x: 0,
  y: 0,
  z: 5 // 初始位置在 z=5
});

// 點擊開始按鈕
function clickStart() {
  // 使用 GSAP 動畫將位置從 (0,0,5) 移動到 (0,0,0)
  gsap.to(position, {
    x: 0,
    y: 0,
    z: 0,
    duration: 2, // 動畫持續2秒
    ease: "power2.inOut", // 使用緩入緩出的效果
    onUpdate: updatePosition // 在動畫過程中持續更新位置
  });
}

// 更新場景中物體的位置
function updatePosition() {
  if (!scene) return;
  
  // 更新場景中的相機位置
  camera.position.set(0, 0, 20 + position.z);
  
  // 更新所有物體的位置
  meshes.forEach(mesh => {
    mesh.position.z = mesh.userData.initialZ + position.z;
  });
}

// 生命週期掛鉤
onMounted(() => {
  // 初始化 Three.js
  initThree();
});

onUnmounted(() => {
  // 清理資源
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  // 釋放記憶體
  if (renderer) {
    renderer.dispose();
  }
  
  // 移除事件監聽
  window.removeEventListener('resize', onWindowResize);
});

// 初始化 Three.js
function initThree() {
  const canvas = canvasRef.value;
  
  // 初始化時鐘
  clock = new THREE.Clock();
  
  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x1f1e1c, 1);
  
  // 啟用物理光照模型 (在 r152+ 版本使用 useLegacyLights)
  renderer.useLegacyLights = false;
  // 提高輸出色彩空間 (在 r152+ 版本使用 outputColorSpace)
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  
  // 初始化相機
  const fov = 45;
  const near = 0.1;
  const far = 500;
  camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
  // 設置初始相機位置，考慮 position.z
  camera.position.z = 20 + position.z;
  
  // 初始化場景
  scene = new THREE.Scene();
  
  // 添加相機控制器
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // 嘗試方案 1: 使用 EXRLoader 載入 .exr 檔案
  const exrLoader = new EXRLoader();
  exrLoader
    .setPath('/hdr/')
    .load('HDR_Light_Studio_Free_HDRI_Design_04.exr', 
      function(texture) {
        setupScene(texture);
      }
    );
  
  // 添加直射光
  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);
  
  // 添加環境光
  let ambLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambLight);
  
  // 添加窗口大小調整事件監聽
  window.addEventListener('resize', onWindowResize);
}

// 窗口大小調整處理函數
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 設置場景函數，以便可以從不同的載入路徑重用
function setupScene(envMap) {
  // 如果有環境貼圖，設置它
  if (envMap) {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envMap;
  }
  
  // 添加背景平面
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setPath('/works/');
  const bgTexture = textureLoader.load('works1.jpg', () => {
    console.log('背景紋理加載完成');
  });
  
  const bgGeometry = new THREE.PlaneGeometry(19.2, 14.4);
  const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
  const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  bgMesh.position.set(0, 0, -1);
  scene.add(bgMesh);
  
  // 創建折射材質
  const material1 = new THREE.MeshPhysicalMaterial({
    envMap: envMap,
    roughness: 0,
    transmission: 1.0,  // 完全透光
    thickness: 2,       // 材質厚度
    ior: 1.5,           // 折射率 (玻璃)
    transparent: true,
    opacity: 1.0,
    side: THREE.DoubleSide
  });
  
  // 創建球體
  const spGeom = new THREE.SphereGeometry(3, 64, 64);
  const sp1 = new THREE.Mesh(spGeom, material1);
  // 記錄初始z位置，用於動畫
  sp1.userData.initialZ = 3;
  sp1.position.set(-4, 3, 3 + position.z);
  scene.add(sp1);
  meshes.push(sp1);
  
  // 再添加一個不同位置的球體
  const sp2 = new THREE.Mesh(spGeom, material1);
  // 記錄初始z位置，用於動畫
  sp2.userData.initialZ = 6;
  sp2.position.set(4, -2, 6 + position.z);
  sp2.scale.set(0.7, 0.7, 0.7);
  scene.add(sp2);
  meshes.push(sp2);
  
  // 添加方塊
  const boxGeom = new THREE.BoxGeometry(4, 4, 4);
  const box = new THREE.Mesh(boxGeom, material1);
  // 記錄初始z位置，用於動畫
  box.userData.initialZ = 10;
  box.position.set(0, 0, 10 + position.z);
  box.rotation.set(Math.PI/6, Math.PI/6, Math.PI/6);
  scene.add(box);
  meshes.push(box);
  
  // 開始渲染
  animate();
}

// 更新場景
function update(deltaTime) {
  const ROTATE_TIME = 20; // 完整旋轉的時間（秒）
  const rotateX = (deltaTime / ROTATE_TIME) * Math.PI * 2;
  const rotateY = (deltaTime / ROTATE_TIME) * Math.PI * 2;
  
  meshes.forEach((mesh) => {
    mesh.rotation.x += rotateX;
    mesh.rotation.y += rotateY;
  });
  
  // 更新控制器
  if (controls) {
    controls.update();
  }
}

// 動畫循環
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  
  if (clock && renderer && scene && camera) {
    const delta = clock.getDelta();
    update(delta);
    
    renderer.render(scene, camera);
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.start-button {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 30px;
  background-color: #2a6496;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  z-index: 100;
}

.start-button:hover {
  background-color: #1c4a70;
}

#c {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
