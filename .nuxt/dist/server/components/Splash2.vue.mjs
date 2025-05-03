import { ref, reactive, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
/* empty css              */
import _export_sfc from "../_virtual/_plugin-vue_export-helper.mjs";
const _sfc_main = {
  __name: "Splash2",
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
    ref(null);
    const isPlaying = ref(false);
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
      minRadius: 0.2,
      // 最小半徑
      maxRadius: 0.55,
      // 最大半徑
      minLength: 3,
      // 最小目標長度
      maxLength: 12,
      // 最大目標長度
      segmentDetail: 16,
      // 幾何體細分
      minScale: 0
      // 最小縮放值(原點狀態)
    });
    reactive({
      // 基本設定
      resolution: 200,
      // Marching Cubes 解析度
      growthSpeed: 5,
      // 線條生長速度
      growthEaseOutPower: 0.15,
      // 生長緩動指數
      numSegments: 50,
      // 每條線分段數量
      subtract: 20,
      // Metaball 減法參數
      // 流動效果設定
      flowGrowthSpeedFactor: 0.1,
      flowWaveAmplitudeFactorAtStart: 1,
      // 原點狀態的波浪振幅因子
      flowShrinkDurationFactor: 0.2,
      // 流動模式下的收縮持續時間因子
      baseShrinkDuration: 2.5,
      // 基本收縮持續時間 (秒)
      // 波浪效果設定
      flowWaveFrequency: 1,
      // 波浪頻率
      flowWaveAmplitudeFactor: 0.15,
      // 波浪振幅因子
      flowWavePhaseFactor: Math.PI * 4
      // 波浪相位因子
    });
    function startGrowingAnimation() {
      if (isPlaying.value == false) {
        isPlaying.value = true;
      }
    }
    function startShrinkingAnimation() {
      if (isPlaying.value == true) {
        isPlaying.value = false;
      }
    }
    __expose({
      startGrowingAnimation,
      startShrinkingAnimation
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "splash-container" }, _attrs))} data-v-02494331><div class="canvas-container" data-v-02494331></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Splash2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-02494331"]]);
export {
  __nuxt_component_0 as default
};
//# sourceMappingURL=Splash2.vue.mjs.map
