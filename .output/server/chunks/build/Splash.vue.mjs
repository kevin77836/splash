import { ref, reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = {
  __name: "Splash",
  __ssrInlineRender: true,
  emits: [
    "stateChange",
    // 狀態變化事件
    "animationComplete",
    // 動畫完成事件
    "resourcesLoaded"
    // 資源載入完成事件
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const canvasContainer = ref(null);
    reactive({
      startStrength: 0.1,
      // 粗到細線條：起始端粗度
      endStrength: 0.01,
      // 粗到細線條：末端粗度
      minLength: 2.5,
      // 粗到細線條：最小長度
      maxLength: 3.5,
      // 粗到細線條：最大長度
      shrinkPower: 0.25,
      // 粗到細線條：粗細變化曲線指數
      numLines: 4
      // 粗到細線條：數量
    });
    reactive({
      startStrength: 0.01,
      // 細到粗線條：起始端粗度
      endStrength: 0.1,
      // 細到粗線條：末端粗度
      minLength: 2,
      // 細到粗線條：最小長度
      maxLength: 3,
      // 細到粗線條：最大長度
      shrinkPower: 1.25,
      // 細到粗線條：粗細變化曲線指數
      numLines: 3
      // 細到粗線條：數量
    });
    reactive({
      count: 20,
      // 球體數量
      minRadius: 0.35,
      // 最小半徑
      maxRadius: 0.5,
      // 最大半徑
      minLength: 3,
      // 最小目標長度
      maxLength: 10,
      // 最大目標長度
      segmentDetail: 16,
      // 幾何體細分
      minScale: 0
      // 最小縮放值(原點狀態)
    });
    reactive({
      // 基本設定
      mobileResolution: 100,
      resolution: 100,
      // Marching Cubes 解析度
      numSegments: 50,
      // 每條線分段數量
      subtract: 20,
      // Metaball 減法參數
      // 統一動畫控制參數
      growSpeed: 0.1,
      // 生長速度 (值越大生長越快)
      growthEaseOutPower: 0.15,
      // 生長緩動指數 (值越小結尾越平滑)
      shrinkSpeed: 1,
      // 收縮速度 (值越大收縮越快)
      shrinkEaseInPower: 2.5,
      // 收縮緩動指數 (值越大開頭越快)
      // 波浪效果設定
      flowWaveFrequency: 1,
      // 波浪頻率
      flowWaveAmplitudeFactor: 0.3,
      // 波浪振幅因子
      flowWaveAmplitudeFactorAtStart: 1.5,
      // 原點狀態下的波浪振幅因子
      flowWavePhaseFactor: Math.PI * 4
      // 波浪相位因子
    });
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test((void 0).userAgent);
    }
    function startGrowingAnimation() {
    }
    function startShrinkingAnimation() {
    }
    function addMouseControlEvents() {
      const container = canvasContainer.value;
      if (!container) return;
      if (!isMobileDevice()) {
        console.log("啟用桌面滑鼠控制");
        (void 0).addEventListener("mousemove", onMouseMove);
      } else {
        console.log("行動裝置，不啟用滑鼠控制");
      }
    }
    function onMouseMove(event) {
      if (isMobileDevice()) return;
      const centerX = (void 0).innerWidth / 2;
      const centerY = (void 0).innerHeight / 2;
      (event.clientX - centerX) * 1e-3;
      (event.clientY - centerY) * 1e-3;
      (event.clientX / (void 0).innerWidth - 0.5) * Math.PI * 0.5;
      (event.clientY / (void 0).innerHeight - 0.5) * Math.PI * 0.5;
      event.clientX;
      event.clientY;
    }
    __expose({
      startGrowingAnimation,
      startShrinkingAnimation,
      addMouseControlEvents,
      updatePositionFromScroll
    });
    function updatePositionFromScroll(xOffset, yOffset) {
      return;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-splash-component" }, _attrs))}><div class="canvas-container"></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Splash.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Splash.vue.mjs.map
