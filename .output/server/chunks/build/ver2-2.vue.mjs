import { ref, reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = {
  __name: "ver2-2",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
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
      // 流動模式下的生長速度因子
      flowShrinkDurationFactor: 0.2,
      // 流動模式下的收縮持續時間因子
      baseShrinkDuration: 3,
      // 基本收縮持續時間 (秒)
      // 波浪效果設定
      flowWaveFrequency: 1,
      // 波浪頻率
      flowWaveAmplitudeFactor: 0.15,
      // 波浪振幅因子
      flowWavePhaseFactor: Math.PI * 4,
      // 波浪相位因子
      // 球體設定
      maxCenterBallStrength: 1,
      // 中心球體最大強度
      minCenterBallStrength: 0
      // 中心球體最小強度
    });
    ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "splash-container" }, _attrs))}><div class="canvas-container"></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ver2-2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ver2-2.vue.mjs.map
