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
         <div class="control-group">
            <label class="control-label">MarchingCubes 解析度: <span class="value-display">{{ resolution }}</span></label>
            <input type="range" v-model.number="resolution" min="10" max="500" step="1" @input="updateMarchingCubesParams">
        </div>
        <div class="control-group">
            <label class="control-label">MarchingCubes Isolation: <span class="value-display">{{ isolation }}</span></label>
            <input type="range" v-model.number="isolation" min="10" max="300" step="10" @input="updateMarchingCubesParams">
        </div>
        <button @click="regenerateLine">重新生成所有線條</button>
        <button @click="exportConfiguration" style="margin-top: 5px;">匯出設定 (JSON)</button>
        <button @click="triggerImport" style="margin-top: 5px;">匯入設定 (JSON)</button>
        <input type="file" ref="importConfigFileRef" @change="importConfiguration" accept=".json" style="display: none;">
        <button @click="exportGLB" style="margin-top: 5px;">下載目前模型 (GLB)</button>
        <button @click="toggleMaterial" style="margin-top: 5px;">{{ toggleMaterialButtonText }}</button>
        <button @click="toggleFlow" style="margin-top: 5px;">{{ toggleFlowButtonText }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
// EffectComposer and passes are not used in the original script, excluding them for now.
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

// --- Refs ---
const canvasContainer = ref<HTMLDivElement | null>(null);
const importConfigFileRef = ref<HTMLInputElement | null>(null);

// --- State (Reactive Variables) ---

// Thick-to-Thin Parameters
const ttStartStrength = ref(0.1);
const ttEndStrength = ref(0.01);
const ttMinWorldLength = ref(2.5);
const ttMaxWorldLength = ref(3.5);
const ttShrinkPower = ref(0.25);
const ttNumLines = ref(4);

// Thin-to-Thick Parameters
const thStartStrength = ref(0.01);
const thEndStrength = ref(0.1);
const thMinWorldLength = ref(2);
const thMaxWorldLength = ref(3);
const thShrinkPower = ref(1.25);
const thNumLines = ref(3);

// Shared Parameters
const resolution = ref(200);
const isolation = ref(300);
const currentMaterial = ref<'shader' | 'liquid'>('shader');
const isFlowing = ref(false);

// Internal state (non-reactive or managed internally by Three.js objects)
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let effect: MarchingCubes;
let clock: THREE.Clock;
let materials: { shader: THREE.ShaderMaterial; liquid: THREE.MeshStandardMaterial };
let pmremGenerator: THREE.PMREMGenerator;
let animationFrameId: number;

// Line Data (Using simple arrays, could be reactive if needed for UI binding beyond counts)
let lineStartTimes: (number | undefined)[] = [];
let randomDirections: (THREE.Vector3 | null)[] = [];
let currentTargetLengths: number[] = [];
let lineTypes: ('tt' | 'th')[] = [];
let lineFlowState: ('growing' | 'pauseAtEnd' | 'shrinking' | 'pauseAtStart')[] = [];
let lineShrinkStartTimes: (number | undefined)[] = [];
let linePauseAtEndEndTime: (number | undefined)[] = [];
let linePauseAtStartEndTime: (number | undefined)[] = [];

let savedLineState: any = null;
let savedCameraState: any = null;
let isFirstFlowTrigger = true;

// Constants
const growthSpeed = 5.0;
const growthEaseOutPower = 0.5;
const numSegments = 50;
const subtract = 20;
const FLOW_GROWTH_SPEED_FACTOR = 0.2;
const FLOW_SHRINK_DURATION_FACTOR = 1.5;
const MAX_INITIAL_FLOW_DELAY = 2.5;
const BASE_SHRINK_DURATION = 1.0;
const MAX_PAUSE_AT_END_DELAY = 10.0;
const MAX_PAUSE_AT_START_DELAY = 1.0;

// --- Computed Properties ---
const toggleMaterialButtonText = computed(() => {
  return currentMaterial.value === 'shader' ? '切換為液體材質' : '切換為描邊材質';
});

const toggleFlowButtonText = computed(() => {
  return isFlowing.value ? '停止流動動畫' : '開始流動動畫';
});

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
      .load('HDR_Light_Studio_Free_HDRI_Design_05.exr', (texture: THREE.Texture) => {
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
      }, undefined, (error: Error | ProgressEvent<EventTarget>) => {
          console.error('無法載入本地 EXR 環境貼圖:', error);
          alert('無法載入 assets/hdr/HDR_Light_Studio_Free_HDRI_Design_05.exr，請檢查檔案是否存在或路徑是否正確。');
      });
}

function regenerateLine() {
    if (!clock || !effect) return; // Ensure initialization
    const currentTime = clock.getElapsedTime();
    const totalLines = ttNumLines.value + thNumLines.value;

    // Adjust array sizes
    lineStartTimes.length = totalLines;
    randomDirections.length = totalLines;
    currentTargetLengths.length = totalLines;
    lineTypes.length = totalLines;
    lineFlowState.length = totalLines;
    lineShrinkStartTimes.length = totalLines;
    linePauseAtEndEndTime.length = totalLines;
    linePauseAtStartEndTime.length = totalLines;

    // Note: Marching Cubes resolution/isolation update handled by watcher/direct function

    let lineIndex = 0;

    // Generate Thick-to-Thin lines
    for(let i = 0; i < ttNumLines.value; i++) {
        if (!randomDirections[lineIndex]) {
            randomDirections[lineIndex] = new THREE.Vector3();
        }
        randomDirections[lineIndex]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
        currentTargetLengths[lineIndex] = THREE.MathUtils.randFloat(ttMinWorldLength.value, ttMaxWorldLength.value);
        lineTypes[lineIndex] = 'tt';
        lineStartTimes[lineIndex] = currentTime;
        lineFlowState[lineIndex] = 'growing';
        lineShrinkStartTimes[lineIndex] = undefined;
        linePauseAtEndEndTime[lineIndex] = undefined;
        linePauseAtStartEndTime[lineIndex] = undefined;
        lineIndex++;
    }

    // Generate Thin-to-Thick lines
    for(let i = 0; i < thNumLines.value; i++) {
         if (!randomDirections[lineIndex]) {
            randomDirections[lineIndex] = new THREE.Vector3();
        }
        randomDirections[lineIndex]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
        currentTargetLengths[lineIndex] = THREE.MathUtils.randFloat(thMinWorldLength.value, thMaxWorldLength.value);
        lineTypes[lineIndex] = 'th';
        lineStartTimes[lineIndex] = currentTime;
        lineFlowState[lineIndex] = 'growing';
        lineShrinkStartTimes[lineIndex] = undefined;
        linePauseAtEndEndTime[lineIndex] = undefined;
        linePauseAtStartEndTime[lineIndex] = undefined;
        lineIndex++;
    }
    effect.reset();
    isFirstFlowTrigger = true;
}

function updateLineMetaball(obj: MarchingCubes) {
    if (!clock) return;
    obj.reset();
    const currentTime = clock.getElapsedTime();
    const centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
    const totalLines = ttNumLines.value + thNumLines.value;

    for (let lineIndex = 0; lineIndex < totalLines; lineIndex++) {

        if (lineStartTimes[lineIndex] === undefined || currentTime < lineStartTimes[lineIndex]!) {
            continue;
        }

        if (currentTargetLengths[lineIndex] === undefined) continue;
        const localMaxLength = currentTargetLengths[lineIndex] / obj.scale.x;
        let localCurrentLength = 0;
        let timeSinceStart = currentTime - lineStartTimes[lineIndex]!;
        const currentFlowState = lineFlowState[lineIndex];

        // --- Calculate length based on flow state ---
        switch (currentFlowState) {
            case 'growing':
                if (localMaxLength > 0.001) {
                    const currentGrowthSpeed = isFlowing.value ? growthSpeed * FLOW_GROWTH_SPEED_FACTOR : growthSpeed;
                    const linearDuration = localMaxLength / (currentGrowthSpeed / obj.scale.x);
                    const normalizedTime = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
                    const easedTime = Math.pow(normalizedTime, growthEaseOutPower);
                    localCurrentLength = easedTime * localMaxLength;
                } else {
                    localCurrentLength = 0;
                }
                if (isFlowing.value && localCurrentLength >= localMaxLength * 0.999) {
                    lineFlowState[lineIndex] = 'pauseAtEnd';
                    const randomDelay = Math.random() * MAX_PAUSE_AT_END_DELAY;
                    linePauseAtEndEndTime[lineIndex] = currentTime + randomDelay;
                    localCurrentLength = localMaxLength;
                }
                break;

            case 'pauseAtEnd':
                if (currentTime >= (linePauseAtEndEndTime[lineIndex] || currentTime + 1)) {
                    lineFlowState[lineIndex] = 'shrinking';
                    lineShrinkStartTimes[lineIndex] = currentTime;
                    linePauseAtEndEndTime[lineIndex] = undefined;
                    localCurrentLength = localMaxLength;
                } else {
                    localCurrentLength = localMaxLength;
                }
                break;

            case 'shrinking':
                const timeSinceShrinking = currentTime - (lineShrinkStartTimes[lineIndex] || currentTime);
                const currentShrinkDuration = BASE_SHRINK_DURATION * FLOW_SHRINK_DURATION_FACTOR;
                const shrinkFactor = Math.max(0, 1.0 - timeSinceShrinking / currentShrinkDuration);
                localCurrentLength = localMaxLength * shrinkFactor;

                if (shrinkFactor === 0) {
                    if (isFlowing.value) {
                        lineFlowState[lineIndex] = 'pauseAtStart';
                        const randomDelay = Math.random() * MAX_PAUSE_AT_START_DELAY;
                        linePauseAtStartEndTime[lineIndex] = currentTime + randomDelay;
                        lineShrinkStartTimes[lineIndex] = undefined;
                        localCurrentLength = 0.001;
                    } else {
                        lineFlowState[lineIndex] = 'growing'; // Or set to idle
                        lineShrinkStartTimes[lineIndex] = undefined;
                        lineStartTimes[lineIndex] = undefined; // Stop updating
                        localCurrentLength = 0.001;
                    }
                }
                break;

            case 'pauseAtStart':
                if (currentTime >= (linePauseAtStartEndTime[lineIndex] || currentTime + 1)) {
                    if (!randomDirections[lineIndex]) randomDirections[lineIndex] = new THREE.Vector3();
                    randomDirections[lineIndex]?.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
                    lineTypes[lineIndex] = (lineIndex < ttNumLines.value) ? 'tt' : 'th';
                    const minL = (lineTypes[lineIndex] === 'tt') ? ttMinWorldLength.value : thMinWorldLength.value;
                    const maxL = (lineTypes[lineIndex] === 'tt') ? ttMaxWorldLength.value : thMaxWorldLength.value;
                    currentTargetLengths[lineIndex] = THREE.MathUtils.randFloat(minL, maxL);
                    lineStartTimes[lineIndex] = currentTime;
                    lineFlowState[lineIndex] = 'growing';
                    linePauseAtStartEndTime[lineIndex] = undefined;
                    localCurrentLength = 0.001;
                } else {
                     localCurrentLength = 0.001;
                }
                break;

            default: // Includes non-flowing case
                 if (localMaxLength > 0.001 && lineStartTimes[lineIndex] !== undefined) {
                    const currentGrowthSpeed = growthSpeed;
                    const linearDuration = localMaxLength / (currentGrowthSpeed / obj.scale.x);
                    const normalizedTime = linearDuration > 0 ? Math.min(timeSinceStart / linearDuration, 1.0) : 1.0;
                    const easedTime = Math.pow(normalizedTime, growthEaseOutPower);
                    localCurrentLength = easedTime * localMaxLength;
                } else {
                    localCurrentLength = 0;
                }
                break;
        }
        // --- Length calculation finished ---

        if (localCurrentLength <= 0.001) continue;

        const currentDirection = randomDirections[lineIndex];
        const currentLineType = lineTypes[lineIndex];
        if (!currentDirection || !currentLineType) continue;

        // Select parameters based on type
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

        // Calculate Metaball strength and position
        for (let i = 0; i <= numSegments; i++) {
            const segmentT = i / numSegments;
            const strengthFactor = Math.pow(segmentT, lineShrinkPowerVal);
            const baseStrength = THREE.MathUtils.lerp(lineStartStrength, lineEndStrength, strengthFactor);

            let dynamicStrength = baseStrength;
            if (isFlowing.value) {
                const flowFrequency = 1.0;
                const flowAmplitude = 0.15 * baseStrength;
                const flowOffset = Math.sin(currentTime * flowFrequency - segmentT * Math.PI * 4) * flowAmplitude;
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
        isolation: isolation.value,
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

function importConfiguration(event: Event) {
    console.log("開始匯入設定...");
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
        console.log("未選擇檔案。");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target?.result as string);
            console.log("讀取的設定:", config);

            if (!config || typeof config !== 'object') throw new Error("無效的設定檔格式");
            const requiredKeys = ['ttStartStrength', 'thStartStrength', 'resolution', 'isolation', 'lineTypes', 'randomDirections', 'currentTargetLengths', 'cameraPosition', 'cameraQuaternion'];
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
            isolation.value = config.isolation;
            currentMaterial.value = config.currentMaterial || 'shader';

            // Update non-reactive Three.js state
            if (effect) {
                // effect.init(resolution.value); // updateMarchingCubesParams handles this via watcher
                effect.isolation = isolation.value;
                effect.material = materials[currentMaterial.value as keyof typeof materials];
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
                lineShrinkStartTimes[i] = undefined;
                linePauseAtEndEndTime[i] = undefined;
                linePauseAtStartEndTime[i] = undefined;
            }

            effect?.reset();
            console.log("設定已成功匯入。");
            alert("設定已載入！");

        } catch (e: any) {
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
    console.log("開始匯出 GLB (應用視角, 臨時提高解析度至 200)...");
    const originalResolution = resolution.value;
    const originalEffectQuaternion = effect.quaternion.clone();
    const exporter = new GLTFExporter();

    try {
        const exportResolution = 200; // Use fixed export resolution
        console.log(`  - 原解析度: ${originalResolution}, 臨時設為: ${exportResolution}`);
        // resolution.value = exportResolution; // Temporarily change - DON'T, use init directly
        effect.init(exportResolution); // Re-init with higher resolution

        console.log("  - 重新計算高解析度模型...");
        updateLineMetaball(effect); // Force recalculation at high res
        console.log("  - 高解析度模型計算完成.");

        console.log("  - 應用反向攝影機旋轉...");
        const cameraInverseQuaternion = camera.quaternion.clone().invert();
        effect.quaternion.premultiply(cameraInverseQuaternion);
        effect.updateMatrixWorld(true); // Force update
        console.log("  - 反向旋轉已應用.");

        exporter.parse(
            effect,
            (result: ArrayBuffer) => { // result is ArrayBuffer or JSON object based on options
                if (result instanceof ArrayBuffer) {
                    try {
                        const blob = new Blob([result], { type: 'model/gltf-binary' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `metaball_model_view_res${exportResolution}.glb`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.log(`GLB 檔案已匯出: metaball_model_view_res${exportResolution}.glb`);
                        alert(`高解析度 (含視角, res ${exportResolution}) GLB 模型已下載！`);
                    } catch (e) {
                        console.error("建立或下載 GLB Blob 時出錯:", e);
                        alert("下載 GLB 時發生錯誤！");
                    }
                } else {
                    console.error("匯出結果不是預期的 ArrayBuffer:", result);
                    alert("匯出 GLB 失敗：格式錯誤。請檢查控制台。");
                }
                 // Restore original state (Success)
                console.log("  - (成功) 恢復原始模型旋轉和解析度...");
                effect.quaternion.copy(originalEffectQuaternion);
                effect.updateMatrixWorld(true);
                // resolution.value = originalResolution; // Restore reactive ref
                effect.init(originalResolution); // Re-init with original resolution
                console.log("  - 模型旋轉和解析度已恢復.");
            },
            (error: Error | unknown) => { // Error callback type can vary
                console.error('匯出 GLB 時發生錯誤:', error);
                alert("匯出 GLB 時發生錯誤！請檢查控制台。");
                // Restore original state (Error)
                console.log("  - (錯誤) 恢復原始模型旋轉和解析度...");
                effect.quaternion.copy(originalEffectQuaternion);
                effect.updateMatrixWorld(true);
                // if (resolution.value !== originalResolution) {
                //     resolution.value = originalResolution;
                // }
                effect.init(originalResolution); // Re-init with original resolution
                console.log("  - 模型旋轉和解析度已恢復.");
            },
            { binary: true }
        );
    } catch (e) {
         console.error("準備匯出或應用旋轉時出錯:", e);
         alert("準備匯出高解析度模型時發生錯誤！");
         // Restore original state (Catch)
         console.log("  - (Catch) 恢復原始模型旋轉和解析度...");
         effect.quaternion.copy(originalEffectQuaternion);
         effect.updateMatrixWorld(true);
         // if (resolution.value !== originalResolution) {
         //     resolution.value = originalResolution;
         // }
         effect.init(originalResolution); // Re-init with original resolution
         console.log("  - 模型旋轉和解析度已恢復.");
    }
}

function toggleMaterial() {
    if (!effect || !scene) return;
    if (currentMaterial.value === 'shader') {
        currentMaterial.value = 'liquid';
        if (scene.background instanceof THREE.Color) {
             scene.background.set(0x111111); // Dark background for liquid
        }
    } else {
        currentMaterial.value = 'shader';
         if (scene.background instanceof THREE.Color) {
             scene.background.set(0xffffff); // White background for shader
        }
    }
    effect.material = materials[currentMaterial.value as keyof typeof materials];
    console.log(`材質已切換為: ${currentMaterial.value}, 背景顏色已更新.`);
}

function toggleFlow() {
    if (!clock || !effect || !camera || !controls) return;

    if (isFlowing.value) {
        // --- Stop Flow ---
        isFlowing.value = false;
        console.log("流動動畫已停止，正在恢復狀態...");
        // isFirstFlowTrigger = true; // Optional: Reset for next time

        if (savedLineState) {
            ttNumLines.value = savedLineState.ttNumLines;
            thNumLines.value = savedLineState.thNumLines;
            lineTypes = [...savedLineState.lineTypes];
            randomDirections = savedLineState.randomDirections.map((dir: any) => dir ? new THREE.Vector3(dir.x, dir.y, dir.z) : null);
            currentTargetLengths = [...savedLineState.currentTargetLengths];
            lineStartTimes = [...savedLineState.lineStartTimes];

            lineFlowState = lineTypes.map(() => 'growing');
            lineShrinkStartTimes = lineTypes.map(() => undefined);
            linePauseAtEndEndTime = lineTypes.map(() => undefined);
            linePauseAtStartEndTime = lineTypes.map(() => undefined);

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
        // --- Start Flow ---
        console.log("開始流動動畫，正在保存當前狀態並設置隨機延遲...");
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

        const startTime = clock.getElapsedTime();
        const totalLines = ttNumLines.value + thNumLines.value;
        lineFlowState.length = totalLines;
        lineShrinkStartTimes.length = totalLines;
        linePauseAtEndEndTime.length = totalLines;
        linePauseAtStartEndTime.length = totalLines;

        if (isFirstFlowTrigger) {
             console.log("首次觸發流動：所有線條同時開始。");
            for (let i = 0; i < totalLines; i++) {
                lineStartTimes[i] = startTime;
                lineFlowState[i] = 'growing';
                lineShrinkStartTimes[i] = undefined;
                linePauseAtEndEndTime[i] = undefined;
                linePauseAtStartEndTime[i] = undefined;
            }
            isFirstFlowTrigger = false;
        } else {
            console.log(`非首次觸發流動：各線條將在 ${MAX_INITIAL_FLOW_DELAY.toFixed(1)} 秒內隨機開始。`);
            for (let i = 0; i < totalLines; i++) {
                const randomInitialDelay = Math.random() * MAX_INITIAL_FLOW_DELAY;
                lineStartTimes[i] = startTime + randomInitialDelay;
                lineFlowState[i] = 'growing';
                lineShrinkStartTimes[i] = undefined;
                linePauseAtEndEndTime[i] = undefined;
                linePauseAtStartEndTime[i] = undefined;
            }
        }

        effect.reset();
    }
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
        effect.init(resolution.value); // Reinitialize when resolution changes
        effect.isolation = isolation.value;
        console.log(`Marching Cubes params updated: resolution=${resolution.value}, isolation=${isolation.value}`);
    }
}
// Watch resolution and isolation to update MarchingCubes
watch(resolution, updateMarchingCubesParams);
watch(isolation, updateMarchingCubesParams);


// --- Animation Loop ---
function animate() {
  animationFrameId = requestAnimationFrame(animate);

  if (!effect || !materials || !camera || !renderer || !scene || !controls) return; // Guard

  effect.material = materials[currentMaterial.value as keyof typeof materials];
  if (currentMaterial.value === 'shader') {
      const currentTime = clock.getElapsedTime();
      effect.material.uniforms.uTime.value = currentTime;
      effect.material.uniforms.viewVector.value = camera.position;
  }

  updateLineMetaball(effect);

  controls.update();
  renderer.render(scene, camera);
}

// --- Resize Handler ---
function handleResize() {
    if (!camera || !renderer || !materials) return;
    const width = canvasContainer.value?.clientWidth ?? window.innerWidth;
    const height = canvasContainer.value?.clientHeight ?? window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
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
  effect = new MarchingCubes(resolution.value, materials[currentMaterial.value as keyof typeof materials], true, true, 100000);
  effect.isolation = isolation.value;
  effect.scale.set(8, 8, 8);
  effect.enableUvs = false;
  effect.enableColors = false;
  scene.add(effect);

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
  if (effect) {
      // MarchingCubes doesn't have a direct dispose method, rely on scene cleanup
      scene?.remove(effect);
      // Dispose geometry/material if needed, but MarchingCubes manages internal geometry
  }
   if (scene) {
        // Dispose geometries, materials, textures in the scene
        scene.traverse((object: THREE.Object3D) => {
            if (object instanceof THREE.Mesh) {
                object.geometry?.dispose();
                // Check if material is an array or single
                const material = object.material as THREE.Material | THREE.Material[];
                if (Array.isArray(material)) {
                    material.forEach((mat: THREE.Material) => mat.dispose());
                } else if (material) {
                    material.dispose();
                }
            }
        });
    }
    if(pmremGenerator) pmremGenerator.dispose(); // Dispose PMREMGenerator

  // Remove canvas
  if (canvasContainer.value && renderer) {
    canvasContainer.value.removeChild(renderer.domElement);
  }

  console.log("Three.js scene cleaned up.");
});

</script>