<template>
  <div class="splash-container">
    <div ref="canvasContainer" class="canvas-container"></div>

    <!-- 控制面板 HTML - 由粗到細 -->
    <div id="thickToThinPanel" class="control-panel thick-to-thin-panel">
      <div class="panel-title">由粗到細 線條控制</div>
      <div class="control-group">
        <label class="control-label">最粗粗度 (強度): <span class="value-display">{{ ttStartStrength.toFixed(2) }}</span></label>
        <input type="range" v-model.number="ttStartStrength" min="0" max="0.1" step="0.01" @input="handleTtStartStrengthInput">
      </div>
      <div class="control-group">
        <label class="control-label">最細粗度 (強度): <span class="value-display">{{ ttEndStrength.toFixed(2) }}</span></label>
        <input type="range" v-model.number="ttEndStrength" min="0.0" max="0.1" step="0.01" @input="handleTtEndStrengthInput">
      </div>
      <div class="control-group">
        <label class="control-label">最短長度: <span class="value-display">{{ ttMinWorldLength.toFixed(1) }}</span></label>
        <input type="range" v-model.number="ttMinWorldLength" min="0.5" max="5.0" step="0.1" @input="handleTtMinLengthInput">
      </div>
      <div class="control-group">
        <label class="control-label">最長長度: <span class="value-display">{{ ttMaxWorldLength.toFixed(1) }}</span></label>
        <input type="range" v-model.number="ttMaxWorldLength" min="0.5" max="5.0" step="0.1" @input="handleTtMaxLengthInput">
      </div>
      <div class="control-group">
        <label class="control-label">收縮速率 (冪): <span class="value-display">{{ ttShrinkPower.toFixed(2) }}</span></label>
        <input type="range" v-model.number="ttShrinkPower" min="0.1" max="5.0" step="0.05">
      </div>
      <div class="control-group">
        <label class="control-label">線條數量: <span class="value-display">{{ ttNumLines }}</span></label>
        <input type="range" v-model.number="ttNumLines" min="0" max="10" step="1" @input="regenerateLine">
      </div>
    </div>

    <!-- 控制面板 HTML - 由細到粗 -->
    <div id="thinToThickPanel" class="control-panel thin-to-thick-panel">
        <div class="panel-title">由細到粗 線條控制</div>
        <div class="control-group">
            <label class="control-label">最細粗度 (強度): <span class="value-display">{{ thStartStrength.toFixed(2) }}</span></label>
            <input type="range" v-model.number="thStartStrength" min="0.0" max="0.1" step="0.01" @input="handleThStartStrengthInput">
        </div>
        <div class="control-group">
            <label class="control-label">最粗粗度 (強度): <span class="value-display">{{ thEndStrength.toFixed(2) }}</span></label>
            <input type="range" v-model.number="thEndStrength" min="0" max="0.1" step="0.01" @input="handleThEndStrengthInput">
        </div>
        <div class="control-group">
            <label class="control-label">最短長度: <span class="value-display">{{ thMinWorldLength.toFixed(1) }}</span></label>
            <input type="range" v-model.number="thMinWorldLength" min="0.5" max="5.0" step="0.1" @input="handleThMinLengthInput">
        </div>
        <div class="control-group">
            <label class="control-label">最長長度: <span class="value-display">{{ thMaxWorldLength.toFixed(1) }}</span></label>
            <input type="range" v-model.number="thMaxWorldLength" min="0.5" max="5.0" step="0.1" @input="handleThMaxLengthInput">
        </div>
        <div class="control-group">
            <label class="control-label">膨脹速率 (冪): <span class="value-display">{{ thShrinkPower.toFixed(2) }}</span></label>
            <input type="range" v-model.number="thShrinkPower" min="0.1" max="5.0" step="0.05">
        </div>
        <div class="control-group">
            <label class="control-label">線條數量: <span class="value-display">{{ thNumLines }}</span></label>
            <input type="range" v-model.number="thNumLines" min="0" max="10" step="1" @input="regenerateLine">
        </div>
    </div>

    <!-- 通用控制面板 HTML -->
    <div id="commonPanel" class="control-panel common-panel">
        <div class="panel-title">通用控制</div>
        <button @click="regenerateLine">重新生成所有線條</button>
        <button @click="exportConfiguration" style="margin-top: 5px;">匯出設定 (JSON)</button>
        <button @click="triggerImport" style="margin-top: 5px;">匯入設定 (JSON)</button>
        <input type="file" ref="importConfigFileRef" @change="importConfiguration" accept=".json" style="display: none;">
        <button @click="exportGLB" style="margin-top: 5px;">下載目前模型 (GLB)</button>
    </div>

    <!-- 新增左下角 Switch 控制面板 -->
    <div id="switchPanel" class="control-panel switch-panel">
        <div class="panel-title">快速切換</div>
        
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
    </div>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

// --- Refs ---
const canvasContainer = ref(null);
const importConfigFileRef = ref(null);

// --- State (Reactive Variables) ---

// Thick-to-Thin Parameters (由粗到細參數)
const ttStartStrength = ref(0.1);   // 線條起始端的粗度強度值，數值越大起始端越粗
const ttEndStrength = ref(0.01);    // 線條末端的粗度強度值，數值越小末端越細
const ttMinWorldLength = ref(2.5);  // 由粗到細線條的最小長度，影響隨機生成的短線條
const ttMaxWorldLength = ref(3.5);  // 由粗到細線條的最大長度，影響隨機生成的長線條
const ttShrinkPower = ref(0.25);    // 由粗到細的收縮速率指數，影響線條粗細變化的曲線形狀
const ttNumLines = ref(4);          // 由粗到細線條的數量

// Thin-to-Thick Parameters (由細到粗參數)
const thStartStrength = ref(0.01);  // 線條起始端的粗度強度值，數值越小起始端越細
const thEndStrength = ref(0.1);     // 線條末端的粗度強度值，數值越大末端越粗
const thMinWorldLength = ref(2);    // 由細到粗線條的最小長度，影響隨機生成的短線條
const thMaxWorldLength = ref(3);    // 由細到粗線條的最大長度，影響隨機生成的長線條
const thShrinkPower = ref(1.25);    // 由細到粗的膨脹速率指數，影響線條粗細變化的曲線形狀
const thNumLines = ref(3);          // 由細到粗線條的數量

// Shared Parameters (共享參數)
const resolution = ref(200);        // Marching Cubes 算法的解析度，影響模型細節和表面平滑度
const currentMaterial = ref('shader'); // 當前使用的材質類型，可選 'shader'(描邊) 或 'liquid'(液體)
const isFlowing = ref(false);       // 控制線條是否處於流動動畫模式
const isPixelated = ref(false);     // 控制是否啟用像素化效果

// Internal state (內部狀態變數)
let scene;                  // Three.js 場景物件
let camera;                 // 攝影機物件
let renderer;               // 渲染器物件
let controls;               // 控制器物件，用於控制攝影機移動
let effect;                 // Marching Cubes 效果物件
let clock;                  // 時鐘物件，用於時間相關計算
let materials;              // 材質集合
let pmremGenerator;         // 預計算反射環境映射生成器
let composer;               // 效果合成器，用於後處理
let pixelPass;              // 像素化效果處理器
let animationFrameId;       // 動畫幀 ID，用於取消動畫

// Line Data (線條數據)
let lineStartTimes = [];    // 儲存每條線的開始時間
let randomDirections = [];  // 儲存每條線的隨機方向向量
let currentTargetLengths = []; // 儲存每條線的目標長度
let lineTypes = [];         // 儲存每條線的類型 ('tt' 或 'th')
let lineFlowState = [];     // 儲存每條線的流動狀態

// 流動控制相關變數
let savedLineState = null;  // 儲存流動開始前的線條狀態，用於恢復
let savedCameraState = null; // 儲存流動開始前的攝影機狀態，用於恢復
let shrinkStartTime = null; // 收合開始時間，用於同步計算收合進度
let shrinkEndTime = null;   // 收合結束時間，用於同步計算收合完成度
let growStartTime = null;   // 生長開始時間，用於同步計算生長進度
let maxCenterBallStrength = 2.0; // 中心球體最大強度，控制球體最大大小
let minCenterBallStrength = 0.0; // 中心球體最小強度，控制球體最小大小
let centerBallVisible = false;   // 球體可見性狀態，控制是否顯示中心球體
let globalFlowState = 'idle';    // 全局流動狀態，控制所有線條的統一動畫行為

// Constants (常數)
const growthSpeed = 5.0;             // 線條生長速度
const growthEaseOutPower = 0.15;     // 生長緩動指數，控制生長速度變化曲線
const numSegments = 50;              // 每條線分段數量，影響線條平滑度和細節
const subtract = 20;                 // metaball 減法參數，影響形狀融合方式
const FLOW_GROWTH_SPEED_FACTOR = 0.1;  // 流動模式下的生長速度因子，會使生長變慢
const FLOW_SHRINK_DURATION_FACTOR = 0.2; // 流動模式下的收縮持續時間因子
const BASE_SHRINK_DURATION = 3.0;     // 基本收縮持續時間，秒數

// 流體波浪效果相關參數
const FLOW_WAVE_FREQUENCY = 1.0;      // 波浪頻率，控制波浪振動的速度
const FLOW_WAVE_AMPLITUDE_FACTOR = 0.15; // 波浪振幅因子，與基礎強度相乘得到波浪振幅
const FLOW_WAVE_PHASE_FACTOR = Math.PI * 4; // 波浪相位因子，控制波浪的空間分佈

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
    liquid: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        envMap: null // Will be set by loader
    })
  };
}

function loadEnvironmentMap() {
  new EXRLoader()
      .setPath('/hdr/') // Use path relative to public directory
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
          alert('無法載入 assets/hdr/HDR_Light_Studio_Free_HDRI_Design_05.exr，請檢查檔案是否存在或路徑是否正確。');
      });
}

function regenerateLine() {
    if (!clock || !effect) return; // Ensure initialization
    const currentTime = clock.getElapsedTime();
    const totalLines = ttNumLines.value + thNumLines.value;

    // 調整陣列大小
    lineStartTimes.length = totalLines;
    randomDirections.length = totalLines;
    currentTargetLengths.length = totalLines;
    lineTypes.length = totalLines;
    lineFlowState.length = totalLines;

    let lineIndex = 0;

    // 生成由粗到細線條
    for(let i = 0; i < ttNumLines.value; i++) {
        if (!randomDirections[lineIndex]) {
            randomDirections[lineIndex] = new THREE.Vector3();
        }
        randomDirections[lineIndex]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
        currentTargetLengths[lineIndex] = THREE.MathUtils.randFloat(ttMinWorldLength.value, ttMaxWorldLength.value);
        lineTypes[lineIndex] = 'tt';
        lineStartTimes[lineIndex] = currentTime;
        lineFlowState[lineIndex] = 'growing';
        lineIndex++;
    }

    // 生成由細到粗線條
    for(let i = 0; i < thNumLines.value; i++) {
        if (!randomDirections[lineIndex]) {
            randomDirections[lineIndex] = new THREE.Vector3();
        }
        randomDirections[lineIndex]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
        currentTargetLengths[lineIndex] = THREE.MathUtils.randFloat(thMinWorldLength.value, thMaxWorldLength.value);
        lineTypes[lineIndex] = 'th';
        lineStartTimes[lineIndex] = currentTime;
        lineFlowState[lineIndex] = 'growing';
        lineIndex++;
    }
    effect.reset();
}

function updateLineMetaball(obj) {
    if (!clock) return;
    obj.reset();
    const currentTime = clock.getElapsedTime();
    const centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
    const totalLines = ttNumLines.value + thNumLines.value;

    // 更新全局流動狀態
    updateGlobalFlowState(currentTime);

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
                        const currentGrowthSpeed = growthSpeed * FLOW_GROWTH_SPEED_FACTOR;
                        const linearDuration = localMaxLength / (currentGrowthSpeed / obj.scale.x);
                        const normalizedTime = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
                        const easedTime = Math.pow(normalizedTime, growthEaseOutPower);
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
                const normalizedTime = Math.min(timeSinceStart / (localMaxLength / (growthSpeed / obj.scale.x)), 1.0);
                const easedTime = Math.pow(normalizedTime, growthEaseOutPower);
                localCurrentLength = easedTime * localMaxLength;
            } else {
                localCurrentLength = 0;
            }
        }
        
        if (localCurrentLength <= 0.001) continue;

        const currentDirection = randomDirections[lineIndex];
        const currentLineType = lineTypes[lineIndex];
        if (!currentDirection || !currentLineType) continue;

        // 根據線條類型選擇參數
        let lineStartStrength, lineEndStrength, lineShrinkPowerVal;
        if (currentLineType === 'tt') {
            lineStartStrength = ttStartStrength.value;
            lineEndStrength = ttEndStrength.value;
            lineShrinkPowerVal = ttShrinkPower.value;
        } else { // 'th'
            lineStartStrength = thStartStrength.value;
            lineEndStrength = thEndStrength.value;
            lineShrinkPowerVal = thShrinkPower.value;
        }

        // 計算Metaball強度和位置
        for (let i = 0; i <= numSegments; i++) {
            const segmentT = i / numSegments;
            const strengthFactor = Math.pow(segmentT, lineShrinkPowerVal);
            const baseStrength = THREE.MathUtils.lerp(lineStartStrength, lineEndStrength, strengthFactor);

            let dynamicStrength = baseStrength;
            if (isFlowing.value) {
                const flowAmplitude = FLOW_WAVE_AMPLITUDE_FACTOR * baseStrength;
                const flowOffset = Math.sin(currentTime * FLOW_WAVE_FREQUENCY - segmentT * FLOW_WAVE_PHASE_FACTOR) * flowAmplitude;
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

function exportConfiguration() {
    if (!camera) return;
    console.log("開始匯出設定...");
    const serializableDirections = randomDirections.map(dir => dir ? { x: dir.x, y: dir.y, z: dir.z } : null);
    const cameraPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    // Use _x, _y, etc. for quaternion serialization if needed, but check GLTFExporter compatibility
    const cameraQuaternion = { x: camera.quaternion.x, y: camera.quaternion.y, z: camera.quaternion.z, w: camera.quaternion.w };

    const config = {
        ttStartStrength: ttStartStrength.value,
        ttEndStrength: ttEndStrength.value,
        ttMinWorldLength: ttMinWorldLength.value,
        ttMaxWorldLength: ttMaxWorldLength.value,
        ttShrinkPower: ttShrinkPower.value,
        ttNumLines: ttNumLines.value,
        thStartStrength: thStartStrength.value,
        thEndStrength: thEndStrength.value,
        thMinWorldLength: thMinWorldLength.value,
        thMaxWorldLength: thMaxWorldLength.value,
        thShrinkPower: thShrinkPower.value,
        thNumLines: thNumLines.value,
        resolution: resolution.value,
        currentMaterial: currentMaterial.value,
        // growthSpeed, growthEaseOutPower, numSegments, subtract are constants, maybe don't need export?
        lineTypes: lineTypes,
        randomDirections: serializableDirections,
        currentTargetLengths: currentTargetLengths,
        cameraPosition: cameraPosition,
        cameraQuaternion: cameraQuaternion // Be mindful of THREE.Quaternion serialization format
    };

    try {
        const configString = JSON.stringify(config, null, 2);
        const blob = new Blob([configString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'metaball_config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("設定已匯出為 metaball_config.json");
    } catch (e) {
        console.error("匯出設定失敗:", e);
        alert("匯出設定失敗！");
    }
}

function triggerImport() {
    importConfigFileRef.value?.click();
}

function importConfiguration(event) {
    console.log("開始匯入設定...");
    const file = (event.target)?.files?.[0];
    if (!file) {
        console.log("未選擇檔案。");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target?.result);
            console.log("讀取的設定:", config);

            if (!config || typeof config !== 'object') throw new Error("無效的設定檔格式");
            const requiredKeys = ['ttStartStrength', 'thStartStrength', 'resolution', 'lineTypes', 'randomDirections', 'currentTargetLengths', 'cameraPosition', 'cameraQuaternion'];
            for (const key of requiredKeys) {
                if (!(key in config)) throw new Error(`缺少必要欄位: ${key}`);
            }
            // Ensure ttNumLines and thNumLines exist for validation
            if (!('ttNumLines' in config) || !('thNumLines' in config)) {
                 throw new Error(`缺少必要欄位: ttNumLines or thNumLines`);
            }
            const totalLines = config.ttNumLines + config.thNumLines;
            if (!Array.isArray(config.lineTypes) || config.lineTypes.length !== totalLines ||
                !Array.isArray(config.randomDirections) || config.randomDirections.length !== totalLines ||
                !Array.isArray(config.currentTargetLengths) || config.currentTargetLengths.length !== totalLines) {
                throw new Error("線條數據數量與線條總數不符");
            }

            // Update reactive refs
            ttStartStrength.value = config.ttStartStrength;
            ttEndStrength.value = config.ttEndStrength;
            ttMinWorldLength.value = config.ttMinWorldLength;
            ttMaxWorldLength.value = config.ttMaxWorldLength;
            ttShrinkPower.value = config.ttShrinkPower;
            ttNumLines.value = config.ttNumLines;
            thStartStrength.value = config.thStartStrength;
            thEndStrength.value = config.thEndStrength;
            thMinWorldLength.value = config.thMinWorldLength;
            thMaxWorldLength.value = config.thMaxWorldLength;
            thShrinkPower.value = config.thShrinkPower;
            thNumLines.value = config.thNumLines;
            resolution.value = config.resolution;
            currentMaterial.value = config.currentMaterial || 'shader';

            // Update non-reactive Three.js state
            if (effect) {
                effect.material = materials[currentMaterial.value];
                updateMarchingCubesParams(); // 調用此函數計算 isolation 並更新效果
            }
            if (camera && controls) {
                 if (config.cameraPosition) {
                    camera.position.set(config.cameraPosition.x, config.cameraPosition.y, config.cameraPosition.z);
                }
                if (config.cameraQuaternion) {
                    // Ensure correct properties are used for Quaternion
                    camera.quaternion.set(config.cameraQuaternion.x ?? config.cameraQuaternion._x,
                                          config.cameraQuaternion.y ?? config.cameraQuaternion._y,
                                          config.cameraQuaternion.z ?? config.cameraQuaternion._z,
                                          config.cameraQuaternion.w ?? config.cameraQuaternion._w);
                }
                controls.update();
            }


            // Update line data arrays
            const currentTime = clock?.getElapsedTime() ?? 0;
            lineStartTimes.length = totalLines;
            randomDirections.length = totalLines;
            currentTargetLengths.length = totalLines;
            lineTypes.length = totalLines;

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
                lineStartTimes[i] = currentTime; // Start growing immediately after import
                lineFlowState[i] = 'growing'; // Reset flow state
            }

            effect?.reset();
            console.log("設定已成功匯入。");
            alert("設定已載入！");

        } catch (e) {
            console.error("匯入設定失敗:", e);
            alert(`匯入設定失敗！錯誤: ${e.message}`);
        } finally {
            if (importConfigFileRef.value) {
                 importConfigFileRef.value.value = ''; // Reset file input
            }
        }
    };
    reader.onerror = function(e) {
        console.error("讀取檔案錯誤:", e);
        alert("讀取檔案時發生錯誤。");
         if (importConfigFileRef.value) {
             importConfigFileRef.value.value = ''; // Reset file input
        }
    };
    reader.readAsText(file);
}

function exportGLB() {
    if (!effect || !camera) return;
    console.log("開始匯出 GLB (應用視角)...");
    const originalResolution = resolution.value;
    const originalEffectQuaternion = effect.quaternion.clone();
    const exporter = new GLTFExporter();

    try {
        // 直接使用原始解析度，無需臨時修改
        console.log(`  - 使用目前解析度: ${originalResolution}`);
        // Re-init with current resolution to ensure clean state
        effect.init(originalResolution);

        console.log("  - 重新計算模型...");
        updateLineMetaball(effect); // Force recalculation
        console.log("  - 模型計算完成.");

        console.log("  - 應用反向攝影機旋轉...");
        const cameraInverseQuaternion = camera.quaternion.clone().invert();
        effect.quaternion.premultiply(cameraInverseQuaternion);
        effect.updateMatrixWorld(true); // Force update
        console.log("  - 反向旋轉已應用.");

        exporter.parse(
            effect,
            (result) => { // Removed type annotation
                if (result instanceof ArrayBuffer) {
                    try {
                        const blob = new Blob([result], { type: 'model/gltf-binary' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `metaball_model_view_res${originalResolution}.glb`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.log(`GLB 檔案已匯出: metaball_model_view_res${originalResolution}.glb`);
                        alert(`模型 (含視角, res ${originalResolution}) GLB 已下載！`);
                    } catch (e) {
                        console.error("建立或下載 GLB Blob 時出錯:", e);
                        alert("下載 GLB 時發生錯誤！");
                    }
                } else {
                    console.error("匯出結果不是預期的 ArrayBuffer:", result);
                    alert("匯出 GLB 失敗：格式錯誤。請檢查控制台。");
                }
                 // Restore original state (Success)
                console.log("  - (成功) 恢復原始模型旋轉...");
                effect.quaternion.copy(originalEffectQuaternion);
                effect.updateMatrixWorld(true);
                // 已經使用原始解析度，無需恢復
                console.log("  - 模型旋轉已恢復.");
            },
            (error) => { // Removed type annotation
                console.error('匯出 GLB 時發生錯誤:', error);
                alert("匯出 GLB 時發生錯誤！請檢查控制台。");
                // Restore original state (Error)
                console.log("  - (錯誤) 恢復原始模型旋轉...");
                effect.quaternion.copy(originalEffectQuaternion);
                effect.updateMatrixWorld(true);
                console.log("  - 模型旋轉已恢復.");
            },
            { binary: true }
        );
    } catch (e) {
         console.error("準備匯出或應用旋轉時出錯:", e);
         alert("準備匯出模型時發生錯誤！");
         // Restore original state (Catch)
         console.log("  - (Catch) 恢復原始模型旋轉...");
         effect.quaternion.copy(originalEffectQuaternion);
         effect.updateMatrixWorld(true);
         console.log("  - 模型旋轉已恢復.");
    }
}

function toggleMaterial() {
    if (!effect || !scene) return;
    if (currentMaterial.value === 'shader') {
        currentMaterial.value = 'liquid';
        if (scene.background instanceof THREE.Color) {
             scene.background.set(0x111111); // 暗色背景配合液體材質
        }
    } else {
        currentMaterial.value = 'shader';
         if (scene.background instanceof THREE.Color) {
             scene.background.set(0xffffff); // 白色背景配合描邊材質
        }
    }
    effect.material = materials[currentMaterial.value];
    
    console.log(`材質已切換為: ${currentMaterial.value}, 背景顏色已更新.`);
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
            ttNumLines.value = savedLineState.ttNumLines;
            thNumLines.value = savedLineState.thNumLines;
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
            ttNumLines: ttNumLines.value,
            thNumLines: thNumLines.value,
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
        const totalLines = ttNumLines.value + thNumLines.value;
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

function togglePixelation() {
    if (!effect || !scene) return;
    isPixelated.value = !isPixelated.value;
    console.log(`像素化狀態已切換為: ${isPixelated.value}`);
    
    // 像素化切換不需要再額外處理，因為現在使用全局狀態控制
}

// --- Input Handlers with Validation ---
function handleTtStartStrengthInput() {
    if (ttStartStrength.value < ttEndStrength.value) {
        ttEndStrength.value = ttStartStrength.value;
    }
}
function handleTtEndStrengthInput() {
    if (ttEndStrength.value > ttStartStrength.value) {
        ttStartStrength.value = ttEndStrength.value;
    }
}
function handleTtMinLengthInput() {
    if (ttMinWorldLength.value > ttMaxWorldLength.value) {
        ttMaxWorldLength.value = ttMinWorldLength.value;
    }
}
function handleTtMaxLengthInput() {
    if (ttMaxWorldLength.value < ttMinWorldLength.value) {
        ttMinWorldLength.value = ttMaxWorldLength.value;
    }
}
function handleThStartStrengthInput() {
    if (thStartStrength.value > thEndStrength.value) {
        thEndStrength.value = thStartStrength.value;
    }
}
function handleThEndStrengthInput() {
    if (thEndStrength.value < thStartStrength.value) {
        thStartStrength.value = thEndStrength.value;
    }
}
function handleThMinLengthInput() {
    if (thMinWorldLength.value > thMaxWorldLength.value) {
        thMaxWorldLength.value = thMinWorldLength.value;
    }
}
function handleThMaxLengthInput() {
    if (thMaxWorldLength.value < thMinWorldLength.value) {
        thMinWorldLength.value = thMaxWorldLength.value;
    }
}

// --- Watchers ---
function updateMarchingCubesParams() {
     if (effect) {
        const derivedIsolation = resolution.value * 1.5;
        effect.init(resolution.value); // Reinitialize when resolution changes
        effect.isolation = derivedIsolation;
        console.log(`Marching Cubes params updated: resolution=${resolution.value}, derivedIsolation=${derivedIsolation}`);
    }
}
// Watch resolution to update MarchingCubes
watch(resolution, updateMarchingCubesParams);


// --- Animation Loop ---
function animate() {
  animationFrameId = requestAnimationFrame(animate);

  if (!effect || !materials || !camera || !renderer || !scene || !controls) return; // Guard

  // Update scene logic (always happens)
  updateLineMetaball(effect);
  controls.update();
  
  // 不再需要更新獨立的中心球體
  // updateCenterSphere();

  // Update shader material uniforms if active
  if (currentMaterial.value === 'shader' && !isPixelated.value) { // Only update if shader is active AND not pixelated (composer handles time otherwise? Check docs)
      const currentTime = clock.getElapsedTime();
      materials.shader.uniforms.uTime.value = currentTime;
      materials.shader.uniforms.viewVector.value = camera.position;
  }

  // Conditional rendering: composer or direct renderer
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

    // Update composer and passes size
    if (composer) {
        composer.setSize(width, height);
    }
    // Note: RenderPixelatedPass usually adapts automatically, but check if specific update needed

    if (materials.shader) {
        materials.shader.uniforms.uResolution.value.set(width, height);
    }
    // Consider if FXAA pass needs resize (if used)
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
  scene.background = new THREE.Color(0xffffff); // Initial background color

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 30);
  camera.lookAt(scene.position);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);

  // PMREMGenerator
  pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // Materials
  materials = generateMaterials(); // Generate materials after camera is defined

  // Marching Cubes
  const derivedIsolation = resolution.value * 1.5;
  effect = new MarchingCubes(resolution.value, materials[currentMaterial.value], true, true, 100000);
  effect.isolation = derivedIsolation;
  effect.scale.set(8, 8, 8);
  effect.enableUvs = false;
  effect.enableColors = false;
  scene.add(effect);

  // --- Post-processing Setup ---
  composer = new EffectComposer(renderer);
  // RenderPixelatedPass automatically adds a RenderPass internally
  pixelPass = new RenderPixelatedPass(10, scene, camera);
  composer.addPass(pixelPass);
  // OutputPass ensures correct colorspace and encoding
  const outputPass = new OutputPass();
  composer.addPass(outputPass);
  // --- End Post-processing Setup ---

  // Clock
  clock = new THREE.Clock();

  // Load Env Map
  loadEnvironmentMap();

  // Initial line generation
  regenerateLine();

  // Start animation
  animate();

  // Add resize listener
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // Stop animation
  cancelAnimationFrame(animationFrameId);

  // Remove resize listener
  window.removeEventListener('resize', handleResize);

  // Dispose Three.js objects
  if (controls) controls.dispose();
  if (renderer) renderer.dispose();
  if (materials) {
      materials.shader?.dispose();
      materials.liquid?.dispose();
      // Dispose envMap if loaded
      if (scene?.environment) scene.environment.dispose();
  }
  
  // 不再需要清理獨立球體資源
  
  if (effect) {
      // MarchingCubes doesn't have a direct dispose method, rely on scene cleanup
      scene?.remove(effect);
      // Dispose geometry/material if needed, but MarchingCubes manages internal geometry
  }
   if (scene) {
        // Dispose geometries, materials, textures in the scene
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry?.dispose();
                // Check if material is an array or single
                const material = object.material;
                if (Array.isArray(material)) {
                    material.forEach((mat) => mat.dispose());
                } else if (material) {
                    material.dispose();
                }
            }
        });
    }
    if(pmremGenerator) pmremGenerator.dispose(); // Dispose PMREMGenerator
    // Dispose composer and passes (composer itself doesn't have dispose, relies on GC? Check docs - better dispose passes)
    if (pixelPass) {
        // Passes usually don't have a specific dispose method, rely on GC
    }
    // composer = null; // Help GC
    // pixelPass = null;

  // Remove canvas
  if (canvasContainer.value && renderer) {
    canvasContainer.value.removeChild(renderer.domElement);
  }

  console.log("Three.js scene cleaned up.");
});

// --- 全局流動狀態管理 ---
function updateGlobalFlowState(currentTime) {
    if (!isFlowing.value || !clock) return;
    
    // 檢查當前時間和設定的時間節點
    if (globalFlowState === 'growing' && growStartTime !== null) {
        // 計算所有線條的平均生長完成度
        const totalLines = ttNumLines.value + thNumLines.value;
        let totalGrowthProgress = 0;
        let activeLines = 0;
        
        for (let i = 0; i < totalLines; i++) {
            if (lineStartTimes[i] === undefined || currentTargetLengths[i] === undefined) continue;
            
            activeLines++;
            const localMaxLength = currentTargetLengths[i] / (effect?.scale.x || 1);
            const timeSinceStart = currentTime - (lineStartTimes[i] || currentTime);
            const currentGrowthSpeed = growthSpeed * FLOW_GROWTH_SPEED_FACTOR;
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
    shrinkEndTime = currentTime + BASE_SHRINK_DURATION * FLOW_SHRINK_DURATION_FACTOR;
    
    // 顯示中心metaball球體
    centerBallVisible = true;
}

// 開始同步生長
function startSyncGrowing() {
    if (!clock) return;
    const currentTime = clock.getElapsedTime();
    const totalLines = ttNumLines.value + thNumLines.value;
    
    console.log("所有線條同步生長");
    
    // 更新全局狀態
    globalFlowState = 'growing';
    growStartTime = currentTime;
    
    // 隱藏中心球體
    centerBallVisible = false;
    
    // 重置所有線條的方向和長度
    for (let i = 0; i < totalLines; i++) {
        if (lineStartTimes[i] === undefined) continue;
        
        // 重新生成隨機方向
        if (!randomDirections[i]) randomDirections[i] = new THREE.Vector3();
        randomDirections[i]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
        
        // 更新線條類型和長度
        lineTypes[i] = (i < ttNumLines.value) ? 'tt' : 'th';
        const minL = (lineTypes[i] === 'tt') ? ttMinWorldLength.value : thMinWorldLength.value;
        const maxL = (lineTypes[i] === 'tt') ? ttMaxWorldLength.value : thMaxWorldLength.value;
        currentTargetLengths[i] = THREE.MathUtils.randFloat(minL, maxL);
        
        // 更新線條狀態
        lineStartTimes[i] = currentTime;
    }
}

// 計算中心球體的強度
function calculateCenterBallStrength(currentTime) {
    if (!clock || shrinkStartTime === null || shrinkEndTime === null) return 0;
    
    if (currentTime === undefined) {
        currentTime = clock.getElapsedTime();
    }
    
    if (globalFlowState === 'shrinking') {
        // 在收合階段，球體強度隨收合進度增加
        const shrinkDuration = shrinkEndTime - shrinkStartTime;
        const timeSinceShrinking = currentTime - shrinkStartTime;
        const shrinkProgress = Math.min(timeSinceShrinking / shrinkDuration, 1.0);
        return minCenterBallStrength + shrinkProgress * (maxCenterBallStrength - minCenterBallStrength);
    } else if (globalFlowState === 'pauseAtStart') {
        // 在收合完成階段，球體保持最大強度
        return maxCenterBallStrength;
    } else {
        // 其他狀態下球體強度最小
        return minCenterBallStrength;
    }
}

</script>