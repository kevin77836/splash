<template>
  <div class="c-splash-component">
    <div ref="canvasContainer" class="canvas-container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import gsap from 'gsap';
import Stats from 'stats.js';

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
  segmentDetail: 6,   // 幾何體細分
  minScale: 0        // 最小縮放值(原點狀態)
});

// --- 流動動畫參數 ---
const animParams = reactive({
  // 基本設定
  mobileResolution: 80,
  resolution: 80,                // Marching Cubes 解析度
  numSegments: 50,                // 每條線分段數量
  subtract: 20,                   // Metaball 減法參數
  
  // 統一動畫控制參數（現在代表秒數）
  growSpeed: 5,                 // 生長動畫持續時間（秒）
  growthEaseOutPower: 0.15,       // 生長緩動指數 (值越小結尾越平滑)
  shrinkSpeed: 0.5,               // 收縮動畫持續時間（秒）
  shrinkEaseInPower: 2.5,         // 收縮緩動指數 (值越大開頭越快)
  
  // 波浪效果設定
  flowWaveFrequency: 1.0,         // 波浪頻率
  flowWaveAmplitudeFactor: 0.15,  // 波浪振幅因子
  flowWaveAmplitudeFactorAtStart: 0.5, // 原點狀態下的波浪振幅因子
  flowWavePhaseFactor: Math.PI * 4, // 波浪相位因子
});

// =========================================
// 2. Three.js 核心物件和狀態
// =========================================

// --- Three.js 核心物件 ---
let scene = null;
let camera = null;
let renderer = null;
let effect = null;
let clock = null;
let material = null;
let pmremGenerator = null;
let animationFrameId = null;
let sphereGroup = null; // 新增球體群組物件

let targetRotationX = 0;
let targetRotationY = 0;
let targetPositionX = 0;
let targetPositionY = 0;
let modelRotationX = 0;
let modelRotationY = 0;

// --- 滾動位移控制變量 ---
let targetScrollOffsetX = 0;
let targetScrollOffsetY = 0;
let targetScrollOffsetZ = 0;

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
let delayedStateUpdateId = null; // 用於跟踪狀態更新的延遲回調ID

// --- 文字物件 ---
let textMesh1 = null;
let textMesh2 = null;
let font = null;
let textTargetPosition1 = null; // 儲存文字1的目標位置
let textTargetPosition2 = null; // 儲存文字2的目標位置
let textOriginPosition1 = null; // 儲存文字1的原點位置
let textOriginPosition2 = null; // 儲存文字2的原點位置
// =========================================
// 3. 材質和環境設定
// =========================================

let stats = null;

// --- 材質設定 ---
const materialTypes = {
  WATER: 'water',          // 水晶材質
  METALLIC: 'metallic',    // 金屬材質
  MATTE: 'matte',          // 霧面材質
  WIREFRAME: 'wireframe',  // 線框材質
  NEON: 'neon',            // 霓虹材質
  NOISE: 'noise',          // 噪點材質
  CIRCUIT: 'circuit',      // 電路板材質
  MARBLE: 'marble',        // 大理石材質
  GALAXY: 'galaxy',        // 星系材質
  ANIMATED_WAVES: 'animated_waves'  // 動態波浪材質
};

// 當前材質類型
let currentMaterialType = materialTypes.WATER;

function generateWaterMaterial() {
  return new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.75,
    transmission: 1.0,   // 增加透光性
    ior: 1.5,          // 折射率
    thickness: 2,    // 材質厚度
    envMapIntensity: 10.0,
    side: THREE.DoubleSide,
    dispersion: 2,
  });
}
function generateMetallicMaterial() {
  return new THREE.MeshPhysicalMaterial({
    metalness: 0.95,
    roughness: 0.05,
    transparent: false,
    reflectivity: 1.0,
    envMapIntensity: 1.5,
    color: 0x888888,
    side: THREE.DoubleSide,
  });
}
function generateMatteMaterial() {
  return new THREE.MeshStandardMaterial({
    metalness: 0.1,
    roughness: 0.9,
    transparent: true,
    opacity: 0.9,
    color: 0xffffff,
    side: THREE.DoubleSide,
    envMapIntensity: 0.3,
  });
}
function generateWireFrameMaterial(){
  return new THREE.MeshBasicMaterial({
    color: 0xe0e0ff,
    wireframe: true
  });
}
function generateNeonMaterial() {
  // 創建霓虹效果著色器
  const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `;
  
  const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  
  void main() {
    // 創建波紋效果
    float distFromCenter = length(vPosition.xy);
    float wave = sin(distFromCenter * 10.0 - time * 2.0) * 0.5 + 0.5;
    
    // 根據波紋選擇顏色
    vec3 color1 = vec3(0.0, 1.0, 1.0); // 青色
    vec3 color2 = vec3(1.0, 0.0, 1.0); // 品紅色
    vec3 finalColor = mix(color1, color2, wave);
    
    // 添加發光效果
    float glow = 0.6 + 0.4 * sin(time);
    
    gl_FragColor = vec4(finalColor * glow, 1.0);
  }
  `;
  
  // 創建材質
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    transparent: true
  });
}
function generateNoiseMaterial() {
  // 創建噪點紋理
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  
  // 填充灰色背景
  context.fillStyle = '#444444';
  context.fillRect(0, 0, size, size);
  
  // 生成噪點
  const imageData = context.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // 添加隨機噪點
    const noise = Math.random() * 50 - 25;
    
    // 修改RGB通道
    data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
  }
  
  // 更新canvas
  context.putImageData(imageData, 0, 0);
  
  // 創建紋理
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  
  // 創建材質
  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.8,
    metalness: 0.2,
    bumpMap: texture,
    bumpScale: 0.05,
    side: THREE.DoubleSide,
  });
}
function generateCircuitMaterial() {
  // 創建電路板紋理
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  
  // 填充深色背景
  context.fillStyle = '#0a1a2a';
  context.fillRect(0, 0, size, size);
  
  // 繪製電路線
  context.strokeStyle = '#00ff88';
  context.lineWidth = 2;
  
  // 生成隨機電路路徑
  const paths = 40;
  for (let i = 0; i < paths; i++) {
    let x = Math.random() * size;
    let y = Math.random() * size;
    
    context.beginPath();
    context.moveTo(x, y);
    
    // 每條路徑生成多個連接點
    const segments = 5 + Math.floor(Math.random() * 10);
    for (let j = 0; j < segments; j++) {
      // 90度轉角
      if (Math.random() > 0.5) {
        x += (Math.random() - 0.5) * 200;
        context.lineTo(x, y);
      } else {
        y += (Math.random() - 0.5) * 200;
        context.lineTo(x, y);
      }
    }
    
    context.stroke();
    
    // 在某些端點添加節點
    if (Math.random() > 0.7) {
      context.fillStyle = '#00ff88';
      context.beginPath();
      context.arc(x, y, 3 + Math.random() * 5, 0, Math.PI * 2);
      context.fill();
    }
  }
  
  // 添加一些發光點
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    
    // 創建漸變發光效果
    const gradient = context.createRadialGradient(
      x, y, 0,
      x, y, 5 + Math.random() * 10
    );
    
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
    
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fill();
  }
  
  // 創建紋理
  const texture = new THREE.CanvasTexture(canvas);
  
  // 創建發光材質
  return new THREE.MeshStandardMaterial({
    map: texture,
    emissive: new THREE.Color(0x00ff88),
    emissiveMap: texture,
    emissiveIntensity: 0.5,
    roughness: 0.7,
    metalness: 0.3,
    side: THREE.DoubleSide,
  });
}
function generateMarbleMaterial() {
  // 創建大理石紋理
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  
  // 填充白色底色
  context.fillStyle = '#f5f5f5';
  context.fillRect(0, 0, size, size);
  
  // 添加大理石紋理
  for (let layer = 0; layer < 5; layer++) {
    // 生成大理石紋層
    const veins = 3 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < veins; i++) {
      // 選擇紋理顏色 - 淺灰到深灰
      context.strokeStyle = `rgba(60, 60, 60, ${0.1 + Math.random() * 0.2})`;
      context.lineWidth = 1 + Math.random() * 3;
      
      // 起點
      let x = Math.random() * size;
      let y = Math.random() * size;
      
      context.beginPath();
      context.moveTo(x, y);
      
      // 生成彎曲路徑
      const points = 5 + Math.floor(Math.random() * 10);
      for (let j = 0; j < points; j++) {
        // 控制點
        const cp1x = x + (Math.random() - 0.5) * 300;
        const cp1y = y + (Math.random() - 0.5) * 300;
        const cp2x = x + (Math.random() - 0.5) * 300;
        const cp2y = y + (Math.random() - 0.5) * 300;
        
        // 下一個點
        x = x + (Math.random() - 0.5) * 300;
        y = y + (Math.random() - 0.5) * 300;
        
        // 貝塞爾曲線
        context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      }
      
      context.stroke();
    }
  }
  
  // 添加一些金色斑點
  context.fillStyle = 'rgba(212, 175, 55, 0.1)';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 1 + Math.random() * 3;
    
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  
  // 創建紋理
  const texture = new THREE.CanvasTexture(canvas);
  
  // 創建材質
  return new THREE.MeshPhysicalMaterial({
    map: texture,
    roughness: 0.1,
    metalness: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    side: THREE.DoubleSide,
    envMapIntensity: 1.5,
    flatShading: false
  });
}
function generateGalaxyMaterial() {
  // 創建星系紋理
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  
  // 填充深空背景
  context.fillStyle = '#000000';
  context.fillRect(0, 0, size, size);
  
  // 創建星系漩渦中心漸變
  const centerX = size / 2;
  const centerY = size / 2;
  
  const gradient = context.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, size * 0.4
  );
  
  gradient.addColorStop(0, 'rgba(120, 0, 255, 0.5)');
  gradient.addColorStop(0.5, 'rgba(0, 50, 120, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(centerX, centerY, size * 0.5, 0, Math.PI * 2);
  context.fill();
  
  // 繪製星系旋臂
  const arms = 3;
  const rotation = Math.random() * Math.PI * 2;
  
  for (let arm = 0; arm < arms; arm++) {
    const armAngle = (arm / arms) * Math.PI * 2 + rotation;
    
    // 每條旋臂添加500顆星星
    for (let i = 0; i < 500; i++) {
      // 距離中心的距離
      const distance = Math.pow(Math.random(), 0.5) * size * 0.45;
      
      // 旋臂彎曲角度
      const curve = distance * 0.006;
      const angle = armAngle + curve;
      
      // 星星位置
      const x = centerX + Math.cos(angle) * distance + (Math.random() - 0.5) * distance * 0.3;
      const y = centerY + Math.sin(angle) * distance + (Math.random() - 0.5) * distance * 0.3;
      
      // 星星大小和亮度
      const radius = Math.random() * 2 + 0.5;
      const brightness = Math.random() * 0.8 + 0.2;
      
      // 選擇星星顏色
      let starColor;
      const colorRandom = Math.random();
      if (colorRandom < 0.6) {
        // 藍白色星星
        starColor = `rgba(180, 200, 255, ${brightness})`;
      } else if (colorRandom < 0.8) {
        // 橙色星星
        starColor = `rgba(255, 180, 100, ${brightness})`;
      } else {
        // 紫色星星
        starColor = `rgba(200, 100, 255, ${brightness})`;
      }
      
      // 繪製星星
      context.fillStyle = starColor;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      
      // 添加星星光暈
      if (radius > 1.5) {
        const glow = context.createRadialGradient(
          x, y, 0,
          x, y, radius * 3
        );
        glow.addColorStop(0, starColor);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, radius * 3, 0, Math.PI * 2);
        context.fill();
      }
    }
  }
  
  // 添加背景星星
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 1.2;
    
    // 隨機星星亮度
    const brightness = Math.random() * 0.8 + 0.2;
    context.fillStyle = `rgba(255, 255, 255, ${brightness})`;
    
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  
  // 創建紋理
  const texture = new THREE.CanvasTexture(canvas);
  
  // 創建材質
  return new THREE.MeshStandardMaterial({
    map: texture,
    emissive: new THREE.Color(0x3333ff),
    emissiveMap: texture,
    emissiveIntensity: 0.8,
    roughness: 1.0,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
}
function generateAnimatedWavesMaterial() {
  // 使用著色器材質創建動態波浪效果
  const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `;
  
  const fragmentShader = `
  uniform float time;
  uniform vec3 baseColor;
  uniform vec3 waveColor;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  // 簡單的柏林噪聲函數
  float noise(vec2 p) {
    return sin(p.x * 10.0) * sin(p.y * 10.0);
  }
  
  void main() {
    // 創建多層次波浪
    float wave1 = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time * 0.7) * 0.5 + 0.5;
    float wave2 = sin(vUv.x * 20.0 - time * 0.5) * sin(vUv.y * 20.0 + time * 0.3) * 0.5 + 0.5;
    
    // 添加一些柏林噪聲
    float noiseValue = noise(vUv * 5.0 + time * 0.1) * 0.5 + 0.5;
    
    // 合併波浪
    float waves = wave1 * 0.6 + wave2 * 0.3 + noiseValue * 0.1;
    
    // 計算光照效果
    float lighting = dot(normalize(vNormal), normalize(vec3(1.0, 1.0, 1.0)));
    lighting = lighting * 0.5 + 0.5; // 轉換到 0-1 範圍
    
    // 混合顏色
    vec3 color = mix(baseColor, waveColor, waves);
    
    // 應用光照
    color *= 0.8 + lighting * 0.2;
    
    gl_FragColor = vec4(color, 1.0);
  }
  `;
  
  // 著色器 uniform 參數
  const uniforms = {
    time: { value: 0 },
    baseColor: { value: new THREE.Color(0x0066cc) }, // 深藍
    waveColor: { value: new THREE.Color(0x66ccff) }  // 淺藍
  };
  
  // 創建著色器材質
  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
  });
}

function updateMaterialAnimate(){
  const elapsedTime = clock.getElapsedTime();
  
  // 更新霓虹材質
  if (currentMaterialType === materialTypes.NEON) {
    if (material && material.uniforms && material.uniforms.time !== undefined) {
      material.uniforms.time.value = elapsedTime;
    }
    
    if (sphereMaterial && sphereMaterial.uniforms && sphereMaterial.uniforms.time !== undefined) {
      sphereMaterial.uniforms.time.value = elapsedTime;
    }
  }
  
  // 更新彩虹材質
  if (currentMaterialType === materialTypes.RAINBOW && material && material.map) {
    material.map.offset.x = elapsedTime * 0.05;
    material.map.needsUpdate = true;
    
    if (sphereMaterial && sphereMaterial.map) {
      sphereMaterial.map.offset.x = elapsedTime * 0.07;
      sphereMaterial.map.needsUpdate = true;
    }
  }
  
  // 更新動態波浪材質
  if (currentMaterialType === materialTypes.ANIMATED_WAVES) {
    if (material && material.uniforms && material.uniforms.time !== undefined) {
      material.uniforms.time.value = elapsedTime;
    }
    
    if (sphereMaterial && sphereMaterial.uniforms && sphereMaterial.uniforms.time !== undefined) {
      sphereMaterial.uniforms.time.value = elapsedTime;
    }
  }
  
  // 更新星系材質（添加旋轉效果）
  if (currentMaterialType === materialTypes.GALAXY && material && material.map) {
    material.map.rotation += 0.001;
    material.map.needsUpdate = true;
    
    if (sphereMaterial && sphereMaterial.map) {
      sphereMaterial.map.rotation += 0.001;
      sphereMaterial.map.needsUpdate = true;
    }
  }
  
  // 更新電路板材質（變換顏色）
  if (currentMaterialType === materialTypes.CIRCUIT) {
    if (material) {
      const hue = 0.3 + 0.1 * Math.sin(elapsedTime * 0.2); // 在綠色範圍內變化
      material.emissive.setHSL(hue, 1.0, 0.5);
      material.needsUpdate = true;
    }
    
    if (sphereMaterial) {
      const hue = 0.3 + 0.1 * Math.sin(elapsedTime * 0.3);
      sphereMaterial.emissive.setHSL(hue, 1.0, 0.5);
      sphereMaterial.needsUpdate = true;
    }
  }
}

function generateMaterial() {
  switch(currentMaterialType) {
    case materialTypes.WATER:
      return generateWaterMaterial();
    case materialTypes.METALLIC:
      return generateMetallicMaterial();
    case materialTypes.MATTE:
      return generateMatteMaterial();
    case materialTypes.WIREFRAME:
      return generateWireFrameMaterial();
    case materialTypes.NEON:
      return generateNeonMaterial();
    case materialTypes.NOISE:
      return generateNoiseMaterial();
    case materialTypes.CIRCUIT:
      return generateCircuitMaterial();
    case materialTypes.MARBLE:
      return generateMarbleMaterial();
    case materialTypes.GALAXY:
      return generateGalaxyMaterial();
    case materialTypes.ANIMATED_WAVES:
      return generateAnimatedWavesMaterial();
    default:
      return generateWaterMaterial();
  }
}

function changeMaterialType(materialType) {
  if (!Object.values(materialTypes).includes(materialType)) {
    console.error(`無效的材質類型: ${materialType}`);
    return;
  }
  
  // 記錄舊材質類型
  const oldMaterialType = currentMaterialType;
  
  // 設置新材質類型
  currentMaterialType = materialType;
  
  // 更新 Marching Cubes 的材質
  if (effect && material) {
    // 釋放舊材質資源
    material.dispose();
    
    // 生成新材質
    material = generateMaterial();
    
    // 更新環境貼圖
    if (scene && scene.environment) {
      material.envMap = scene.environment;
      material.needsUpdate = true;
    }
    
    // 更新 Marching Cubes 材質
    effect.material = material;
  }
  
  // 更新球體材質
  if (sphereMaterial) {
    // 釋放舊材質資源
    sphereMaterial.dispose();
    
    // 生成新材質
    sphereMaterial = generateMaterial();
    
    // 更新環境貼圖
    if (scene && scene.environment) {
      sphereMaterial.envMap = scene.environment;
      sphereMaterial.needsUpdate = true;
    }
    
    // 更新所有球體的材質
    for (let i = 0; i < spheres.length; i++) {
      if (spheres[i].mesh) {
        spheres[i].mesh.material = sphereMaterial;
      }
    }
  }
  
  console.log(`材質已從 ${oldMaterialType} 切換為 ${materialType}`);
}

function loadEnvironmentMap() {
  return new Promise((resolve, reject) => {
    new EXRLoader()
      .setPath('/hdr/')
      .load('HDR_Light_Studio_Free_HDRI_Design_04.exr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        texture.dispose();

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

function loadFontAndCreateText() {
  const ttfLoader = new TTFLoader();
  const fontLoader = new FontLoader();

  ttfLoader.load('/fonts/Orbitron-Regular.ttf', (json) => {
    font = fontLoader.parse(json);
    
    // 儲存目標位置
    textTargetPosition1 = new THREE.Vector3(-4, 0, -5);
    textTargetPosition2 = new THREE.Vector3(4, 0, -5);
    
    // 創建第一個文字 - 初始位置為原點
    textMesh1 = createText('Splash', new THREE.Vector3(3, 0, -5),'left', 1);
    scene.add(textMesh1);
    
    // 創建第二個文字 - 初始位置為原點
    textMesh2 = createText('DigiLab', new THREE.Vector3(-3, 0, -5),'right', 1);
    scene.add(textMesh2);
  });
}

/**
 * 創建文字物件
 */
function createText(text, position, align, size = 0.5) {
  const shapes = font.generateShapes(text, size);
  const geometry = new THREE.ShapeGeometry(shapes);
  geometry.computeBoundingBox();

  // 使用物理材質替代基本材質，以便能夠被折射
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0,
    transmission: 1,  // 輕微的透射性
  });

  const mesh = new THREE.Mesh(geometry, material);
  const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
  const textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
  if(align === 'left'){
    mesh.position.set(position.x - textWidth, position.y - textHeight / 4, position.z);
    textOriginPosition1 = new THREE.Vector3(position.x - textWidth, position.y - textHeight / 4, position.z);
  }else if(align === 'right'){
    mesh.position.set(position.x , position.y - textHeight / 4, position.z);
    textOriginPosition2 = new THREE.Vector3(position.x , position.y - textHeight / 4, position.z);
  }

  mesh.renderOrder = 1;
  
  return mesh;
}

/**
 * 文字從原點到目標位置的動畫
 */
function animateTextToTargetPosition() {
  if (!textMesh1 || !textMesh2 || !textTargetPosition1 || !textTargetPosition2) return;
  
  // 停止當前可能正在執行的動畫
  gsap.killTweensOf(textMesh1.position);
  gsap.killTweensOf(textMesh2.position);
  gsap.killTweensOf(textMesh1.material);
  gsap.killTweensOf(textMesh2.material);
  
  // 計算文字1的目標位置（考慮文字寬度）
  const text1Width = textMesh1.geometry.boundingBox.max.x - textMesh1.geometry.boundingBox.min.x;
  const text1Height = textMesh1.geometry.boundingBox.max.y - textMesh1.geometry.boundingBox.min.y;
  const targetPos1 = textTargetPosition1.clone();
  targetPos1.x -= text1Width / 2;
  targetPos1.y -= text1Height / 4;
  
  // 計算文字2的目標位置（考慮文字寬度）
  const text2Width = textMesh2.geometry.boundingBox.max.x - textMesh2.geometry.boundingBox.min.x;
  const text2Height = textMesh2.geometry.boundingBox.max.y - textMesh2.geometry.boundingBox.min.y;
  const targetPos2 = textTargetPosition2.clone();
  targetPos2.x -= text2Width / 2;
  targetPos2.y -= text2Height / 4;
  
  // 設置動畫參數
  // const duration = animParams.growSpeed;
  const duration = 1;
  
  // 確保文字一開始是透明的
  textMesh1.material.opacity = 0;
  textMesh2.material.opacity = 0;
  
  // 文字1位置動畫
  gsap.to(textMesh1.position, {
    x: targetPos1.x,
    y: targetPos1.y,
    z: targetPos1.z,
    duration: duration,
    ease: "customGrowEase"
  });
  
  // 文字1透明度動畫
  gsap.to(textMesh1.material, {
    opacity: 1,
    duration: duration,
    ease: "easeOut"
  });
  
  // 文字2位置動畫
  gsap.to(textMesh2.position, {
    x: targetPos2.x,
    y: targetPos2.y,
    z: targetPos2.z,
    duration: duration,
    ease: "customGrowEase"
  });
  
  // 文字2透明度動畫
  gsap.to(textMesh2.material, {
    opacity: 1,
    duration: duration,
    ease: "easeOut"
  });
}

/**
 * 文字從目標位置回到原點的動畫
 */
function animateTextToOrigin() {
  if (!textMesh1 || !textMesh2) return;
  
  // 停止當前可能正在執行的動畫
  gsap.killTweensOf(textMesh1.position);
  gsap.killTweensOf(textMesh2.position);
  gsap.killTweensOf(textMesh1.material);
  gsap.killTweensOf(textMesh2.material);
  
  // 設置動畫參數
  // const duration = animParams.shrinkSpeed;
  const duration = 1;
  
  // 文字1位置動畫
  gsap.to(textMesh1.position, {
    x: textOriginPosition1.x,
    y: textOriginPosition1.y,
    z: textOriginPosition1.z,
    duration: 1,
    ease: "customShrinkEase" // 使用已註冊的自定義緩動函數
  });
  
  // 文字1透明度動畫
  gsap.to(textMesh1.material, {
    opacity: 0,
    duration: duration, // 透明度變化稍快，提前完全透明
    ease: "easeIn"
  });
  
  // 文字2位置動畫
  gsap.to(textMesh2.position, {
    x: textOriginPosition2.x,
    y: textOriginPosition2.y,
    z: textOriginPosition2.z,
    duration: duration,
    ease: "customShrinkEase" // 使用已註冊的自定義緩動函數
  });
  
  // 文字2透明度動畫
  gsap.to(textMesh2.material, {
    opacity: 0,
    duration: duration, // 透明度變化稍快，提前完全透明
    ease: "easeIn"
  });
}

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
      localCurrentLength = 0.01; // 調大一點以確保可見流動效果
    } else if (globalFlowState === 'pauseAtEnd') {
      // 在生長完成狀態下，線條保持最長
      localCurrentLength = localMaxLength;
    } else if (globalFlowState === 'growing') {
      // 生長狀態 - 使用 GSAP 控制的進度
      if (localMaxLength > 0.001) {
        const duration = animParams.growSpeed;
        const progress = Math.min(timeSinceStart / duration, 1.0);
        // 使用 GSAP 風格的 ease out
        const easedTime = Math.pow(progress, animParams.growthEaseOutPower);
        localCurrentLength = easedTime * localMaxLength;
      } else {
        localCurrentLength = 0;
      }
    } else if (globalFlowState === 'shrinking') {
      // 收縮狀態 - 使用 GSAP 控制的進度
      if (shrinkStartTime !== null && shrinkEndTime !== null) {
        const shrinkDuration = shrinkEndTime - shrinkStartTime;
        const timeSinceShrinking = currentTime - shrinkStartTime;
        const linearShrinkProgress = Math.min(timeSinceShrinking / shrinkDuration, 1.0);
        // 使用收縮緩動參數
        const shrinkProgress = Math.pow(linearShrinkProgress, animParams.shrinkEaseInPower);
        const shrinkFactor = Math.max(0, 1.0 - shrinkProgress);
        
        // 當開始收縮時，我們需要從當前長度開始收縮
        const duration = animParams.growSpeed;
        const growProgress = Math.min(timeSinceStart / duration, 1.0);
        const easedGrowTime = Math.pow(growProgress, animParams.growthEaseOutPower);
        const lengthBeforeShrinking = easedGrowTime * localMaxLength;
        
        // 從當前長度開始按比例收縮
        localCurrentLength = lengthBeforeShrinking * shrinkFactor;
      } else {
        localCurrentLength = localMaxLength;
      }
    } else {
      // 默認狀態 - 靜態展示
      if (localMaxLength > 0.001) {
        const duration = animParams.growSpeed;
        const progress = Math.min(timeSinceStart / duration, 1.0);
        const easedTime = Math.pow(progress, animParams.growthEaseOutPower);
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

/**
 * 初始化所有球體
 */
function initSpheres() {
  // 清理現有球體
  // clearSpheres();
  
  // 建立球體群組
  if (!sphereGroup) {
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
  }
  
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
// function clearSpheres() {
//   // 從場景中移除所有球體並釋放資源
//   for (let i = 0; i < spheres.length; i++) {
//     const sphere = spheres[i];
    
//     if (sphere.mesh) {
//       if (sphereGroup) {
//         sphereGroup.remove(sphere.mesh);
//       } else {
//         scene.remove(sphere.mesh);
//       }
//       sphere.mesh.geometry.dispose();
//     }
//   }
  
//   // 清空陣列
//   spheres = [];
  
//   // 清空群組
//   if (sphereGroup) {
//     scene.remove(sphereGroup);
//     sphereGroup = new THREE.Group();
//     scene.add(sphereGroup);
//   }
// }

/**
 * 創建並發射一個球體
 */
function createSphere(direction, size) {
  const geometry = new THREE.SphereGeometry(size, sphereParams.segmentDetail, sphereParams.segmentDetail);
  
  // 使用共用材質
  if (!sphereMaterial) {
    sphereMaterial = generateMaterial();
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
  
  // 添加到球體群組和球體陣列
  sphereGroup.add(sphere);
  spheres.push(sphereData);
  
  return sphereData;
}

/**
 * 更新球體位置和狀態
 */
function updateSpheres() {
  if (!clock) return;
  
  // 更新每個球體的可視屬性
  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i];
    if (!sphere.active || !sphere.mesh) continue;
    
    // 計算球體在其本地座標系中的位置
    const spherePosition = sphere.direction.clone().multiplyScalar(sphere.currentPosition);
    sphere.mesh.position.copy(spherePosition);
    
    // 更新進度比例 (0-1)
    sphere.progress = sphere.targetLength > 0 ? sphere.currentPosition / sphere.targetLength : 0;
    
    // 根據進度計算大小
    let scale;
    if (sphere.currentPosition < 0.01) {
      scale = sphereParams.minScale; // 保持最小可見大小
    } else {
      // 根據距離計算大小，確保球體大小與位置成比例
      const sizeProgress = Math.min(sphere.progress * 1.5, 1.0); // 略微加速大小變化
      scale = sphereParams.minScale + (sphere.initialScale - sphereParams.minScale) * sizeProgress;
    }
    
    sphere.mesh.scale.set(scale, scale, scale);
  }
}

/**
 * 動畫主循環
 */
function animate() {
  stats.begin();
  
  // 僅在需要時進行渲染，節省資源
  if (!effect || !material || !camera || !renderer || !scene) {
    return;
  }
  
  updateMaterialAnimate();
  // 更新場景邏輯
  updateLineMetaball(effect);
  
  // 更新球體
  updateSpheres();
  
  // 應用旋轉到場景
  // if(isMobileDevice()){
  //   effect.rotation.y += 0.0025;
  //   if (sphereGroup) {
  //     sphereGroup.rotation.y += 0.0025;
  //   }
  // }else{
  //   // 平滑過渡到目標旋轉角度
  //   modelRotationX += (targetRotationX - modelRotationX) * 0.05;/*  */
  //   modelRotationY += (targetRotationY - modelRotationY) * 0.05;

  //   effect.rotation.y = modelRotationY;
  //   effect.rotation.x = modelRotationX;
  //   // 更新 effect 和球體群組位置
  //   effect.position.x = targetPositionX;
  //   effect.position.y = targetPositionY;
  //   if (sphereGroup) {
  //     sphereGroup.rotation.x = modelRotationX;
  //     sphereGroup.rotation.y = modelRotationY;
  //     sphereGroup.position.x = targetPositionX;
  //     sphereGroup.position.y = targetPositionY;
  //   }
  // }
  effect.rotation.y += 0.0025;
  if (sphereGroup) {
    sphereGroup.rotation.y += 0.0025;
  }
  
  // 結合滑鼠控制和滾動位移的最終位置
  scene.position.set(targetScrollOffsetX, targetScrollOffsetY, targetScrollOffsetZ);
  
  // 渲染前確保所有矩陣已更新
  scene.updateMatrixWorld();
  
  stats.end();     
  // 渲染場景
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
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

  // PMREMGenerator
  pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // 材質
  material = generateMaterial();

  // const spGeom = new THREE.SphereGeometry(4, 64, 64);
  // const sp1 = new THREE.Mesh(spGeom, generateMaterial());
  // sp1.position.set(4, -2, 6);
  // sp1.scale.set(0.7, 0.7, 0.7);
  // scene.add(sp1);

  // Marching Cubes
  let resolution;
  if (!isMobileDevice()){
    resolution = animParams.resolution;
  }else{
    resolution = animParams.mobileResolution;
  }
  const derivedIsolation = resolution * 1.5;
  effect = new MarchingCubes(resolution, material, true, true, 100000);
  effect.isolation = derivedIsolation;
  effect.scale.set(8, 8, 8);
  effect.enableUvs = false;
  effect.enableColors = false;
  
  // 設置線條的渲染順序，確保可以對文字進行折射
  effect.renderOrder = 2;
  
  scene.add(effect);
  
  // 創建球體群組
  sphereGroup = new THREE.Group();
  // 設置球體群組的渲染順序
  sphereGroup.renderOrder = 2;
  scene.add(sphereGroup);

  // 時鐘
  clock = new THREE.Clock();
  
  // 初始化共用材質
  sphereMaterial = generateMaterial();
  
  // 初始化滾動位移變量
  targetScrollOffsetX = 0;
  targetScrollOffsetY = 0;
  targetScrollOffsetZ = 0;
  
  // 載入字體並創建文字
  loadFontAndCreateText();

  stats = new Stats();
  stats.showPanel(0);               // 0: fps, 1: ms, 2: mb, 3+: custom
  stats.dom.style.position = 'fixed';
  stats.dom.style.top = '0px';
  document.body.appendChild(stats.dom);

  // const textureLoader = new THREE.TextureLoader();
  // textureLoader.setPath('/works/');
  // const bgTexture = textureLoader.load('works1.jpg', () => {
  //   console.log('背景紋理加載完成');
  // });
  
  // const bgGeometry = new THREE.PlaneGeometry(19.2, 14.4);
  // const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
  // const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  // bgMesh.position.set(0, 0, -1);
  // scene.add(bgMesh);

  // 註冊自定義緩動函數（只註冊一次）
  gsap.registerEase("customGrowEase", function(x) {
    return Math.pow(x, animParams.growthEaseOutPower);
  });
  
  // 自定義緩動函數，完全匹配線條使用的 Math.pow(x, shrinkEaseInPower)
  gsap.registerEase("customShrinkEase", function(x) {
    return Math.pow(x, animParams.shrinkEaseInPower);
  });
  
  return true;
}

/**
 * 清理Three.js資源
 */
// function cleanupScene() {
//   // 停止動畫
//   cancelAnimationFrame(animationFrameId);

//   // 移除視窗大小變化監聽
//   window.removeEventListener('resize', handleResize);

//   // 重置滾動位移變量
//   targetScrollOffsetX = 0;
//   targetScrollOffsetY = 0;
//   targetScrollOffsetZ = 0;

//   // 清理球體
//   clearSpheres();

//   // 清理Three.js資源
//   if (renderer) renderer.dispose();
//   if (material) {
//     material.dispose();
//     if (scene?.environment) scene.environment.dispose();
//   }
  
//   if (effect) {
//     scene?.remove(effect);
//   }
  
//   // 清理球體群組
//   if (sphereGroup) {
//     scene?.remove(sphereGroup);
//     sphereGroup = null;
//   }
  
//   // 清理文字相關資源
//   textTargetPosition1 = null;
//   textTargetPosition2 = null;
//   textOriginPosition1 = null;
//   textOriginPosition2 = null;
  
//   if (scene) {
//     // 清理場景中的物件
//     scene.traverse((object) => {
//       if (object instanceof THREE.Mesh) {
//         object.geometry?.dispose();
//         const objMaterial = object.material;
//         if (Array.isArray(objMaterial)) {
//           objMaterial.forEach((mat) => mat.dispose());
//         } else if (objMaterial) {
//           objMaterial.dispose();
//         }
//       }
//     });
//   }
  
//   if (pmremGenerator) pmremGenerator.dispose();

//   // 移除畫布
//   if (canvasContainer.value && renderer) {
//     canvasContainer.value.removeChild(renderer.domElement);
//   }

//   // 清理球體材質
//   if (sphereMaterial) {
//     sphereMaterial.dispose();
//   }

//   // 清理文字物件
//   if (textMesh1) {
//     scene.remove(textMesh1);
//     textMesh1.geometry.dispose();
//     textMesh1.material.dispose();
//   }
//   if (textMesh2) {
//     scene.remove(textMesh2);
//     textMesh2.geometry.dispose();
//     textMesh2.material.dispose();
//   }
// }

// =========================================
// 8. 用戶互動控制
// =========================================

/**
 * 檢查是否為行動裝置
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

//開始生長動畫
function startGrowingAnimation() {
  if(globalFlowState=='growing' || globalFlowState=='pauseAtEnd') return;
  if (delayedStateUpdateId !== null) {
    gsap.killTweensOf(delayedStateUpdateId);
    delayedStateUpdateId = null;
  }
  globalFlowState = 'growing';
  startSyncGrowing();
}

//開始收合動畫
function startShrinkingAnimation() {
  if(globalFlowState=='shrinking' || globalFlowState=='pauseAtStart') return;
  
  if (delayedStateUpdateId !== null) {
    gsap.killTweensOf(delayedStateUpdateId);
    delayedStateUpdateId = null;
  }

  globalFlowState = 'shrinking';
  startSyncShrinking();
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
}

// 當狀態改變時通知父組件
function updateFlowState(newState) {
  globalFlowState = newState;
  emit('stateChange', newState);
  
  // 檢查是否完成特定狀態，通知父組件
  if (newState === 'pauseAtEnd') {
    emit('animationComplete', 'growing');
  } else if (newState === 'pauseAtStart') {
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
  
  // 確保球體已初始化
  if (spheres.length === 0) {
    initSpheres();
  }
  
  // 清除所有現有的 GSAP 動畫和延遲回調
  gsap.killTweensOf(spheres);
  if (delayedStateUpdateId !== null) {
    gsap.killTweensOf(delayedStateUpdateId);
    delayedStateUpdateId = null;
  }
  
  // 更新全局狀態
  updateFlowState('growing');
  growStartTime = currentTime;
  
  // 設置生長動畫時間
  const growDuration = animParams.growSpeed;
  
  // 使用 GSAP 控制球體動畫
  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i];
    if (sphere.mesh) {
      // 記錄起始位置
      sphere.transitionStartTime = currentTime;
      sphere.transitionStartPos = sphere.currentPosition;
      
      // 使用自定義緩動函數
      gsap.to(sphere, {
        currentPosition: sphere.targetLength,
        duration: growDuration,
        ease: "customGrowEase",
        // onUpdate: function() {
        //   // 確保狀態一致
        //   if (globalFlowState !== 'growing' && globalFlowState !== 'pauseAtEnd') {
        //     sphere.currentPosition = sphere.targetLength;
        //   }
        // },
        // onComplete: function() {
        //   // 確保完全到位
        //   sphere.currentPosition = sphere.targetLength;
        // }
      });
    }
  }
  
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
  
  // 在線條預計完成生長時更新全局狀態
  delayedStateUpdateId = { id: "stateUpdate" };
  gsap.to(delayedStateUpdateId, {
    id: "stateUpdate", 
    duration: growDuration,
    onComplete: function() {
      updateFlowState('pauseAtEnd');
      delayedStateUpdateId = null;
    }
  });
}

/**
 * 開始同步收合所有線條
 */
function startSyncShrinking() {
  if (!clock) return;
  const currentTime = clock.getElapsedTime();
  
  // 清除所有現有的 GSAP 動畫和延遲回調
  gsap.killTweensOf(spheres);
  if (delayedStateUpdateId !== null) {
    gsap.killTweensOf(delayedStateUpdateId);
    delayedStateUpdateId = null;
  }
  
  // 更新全局狀態
  updateFlowState('shrinking');
  
  // 設置收合時間
  shrinkStartTime = currentTime;
  
  // 使用 GSAP 設置收合動畫
  const shrinkDuration = animParams.shrinkSpeed;
  
  // 設置結束時間（為了兼容現有代碼）
  shrinkEndTime = currentTime + shrinkDuration;
  
  // 為每個球體設置收縮動畫
  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i];
    if (sphere.mesh) {
      // 記錄起始位置
      sphere.transitionStartTime = currentTime;
      sphere.transitionStartPos = sphere.currentPosition;
      
      // 使用 GSAP 直接為每個球體設置收縮動畫
      gsap.to(sphere, {
        currentPosition: 0,
        duration: shrinkDuration,
        ease: "customShrinkEase",
        // onUpdate: function() {
        //   // 確保狀態一致
        //   if (globalFlowState !== 'shrinking' && globalFlowState !== 'pauseAtStart') {
        //     sphere.currentPosition = 0;
        //   }
        // },
        // onComplete: function() {
        //   // 確保完全歸零
        //   sphere.currentPosition = 0;
        // }
      });
    }
  }
  
  // 保持現有線條方向和目標長度，只更新起始時間
  const totalLines = ttParams.numLines + thParams.numLines;
  for (let i = 0; i < totalLines; i++) {
    if (lineStartTimes[i] === undefined) continue;
    // 更新線條狀態和時間，但保持當前方向和目標長度
    lineFlowState[i] = 'shrinking';
  }
  
  // 在線條預計完成收縮時更新全局狀態
  delayedStateUpdateId = { id: "stateUpdate" };
  gsap.to(delayedStateUpdateId, {
    id: "stateUpdate",
    duration: shrinkDuration,
    onComplete: function() {
      updateFlowState('pauseAtStart');
      delayedStateUpdateId = null;
    }
  });
}

/**
 * 添加滑鼠控制事件
 */
function addMouseControlEvents() {
  const container = canvasContainer.value;
  if (!container) return;
  
  // 只有在非行動裝置上才添加滑鼠控制
  // if (!isMobileDevice()) {
  //   window.addEventListener('mousemove', onMouseMove);
  // }
}

/**
 * 移除滑鼠控制事件
 */
// function removeMouseControlEvents() {
//   const container = canvasContainer.value;
//   if (!container) return;
  
//   // 無論是否為行動裝置，都應移除事件以防止內存洩漏
//   window.removeEventListener('mousemove', onMouseMove);
// }

/**
 * 滑鼠移動事件處理
 */
function onMouseMove(event) {
  // 如果是行動裝置，則直接返回不處理
  if (isMobileDevice()) return;
  
  // 計算滑鼠與視窗中心的偏移
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // 計算偏移並加上減速因子使移動不那麼劇烈
  const offsetX = (event.clientX - centerX) * 0.001;
  const offsetY = (event.clientY - centerY) * 0.001;
  
  // 更新目標位置 (使偏移更小以獲得更細膩的移動)
  targetPositionX = offsetX;
  targetPositionY = -offsetY; // 負值使移動方向與滑鼠一致
  
  // 更新目標旋轉角度 (滑鼠水平移動控制Y軸旋轉，垂直移動控制X軸旋轉)
  // 使用百分比計算以適應不同螢幕尺寸
  targetRotationY = (event.clientX / window.innerWidth - 0.5) * Math.PI * 2;
  targetRotationX = (event.clientY / window.innerHeight - 0.5) * Math.PI * 2;
  
  // 限制旋轉範圍
  targetRotationX = Math.max(-Math.PI, Math.min(Math.PI, targetRotationX));
  targetRotationY = Math.max(-Math.PI, Math.min(Math.PI, targetRotationY));
}

onMounted(() => {
  // 初始化場景
  if (!initializeScene()) return;

  // 開始動畫循環（但不啟動流動）
  animate();
  
  // 載入環境貼圖
  loadEnvironmentMap().then(() => {
    
    // 初始化為收合狀態
    initializeCollapsedState();
    
    // 通知父組件資源已載入
    emit('resourcesLoaded', true);
    
  }).catch(error => {
    console.error('環境貼圖載入失敗:', error);
  });

  // 監聽視窗大小變化
  window.addEventListener('resize', handleResize);
});

// onUnmounted(() => {
//   cleanupScene();

//   // 移除滑鼠控制事件
//   removeMouseControlEvents();
// });

// 暴露方法給父組件
defineExpose({
  startGrowingAnimation,
  startShrinkingAnimation,
  addMouseControlEvents,
  updatePosition,
  animateTextToTargetPosition,
  animateTextToOrigin,
  changeMaterialType,
});

/**
 * 根據滾動位置更新模型位置
 */
function updatePosition(xOffset, yOffset, zOffset) {
  if (!scene) return;
  
  // 設置目標滾動位移，animate 函數會平滑過渡到這些值
  targetScrollOffsetX = xOffset;
  targetScrollOffsetY = -yOffset;
  targetScrollOffsetZ = zOffset;
}
</script>