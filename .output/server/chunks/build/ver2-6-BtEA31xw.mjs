import { ref, unref, reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$1 = {
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Splash2.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-02494331"]]);
const _sfc_main = {
  __name: "ver2-6",
  __ssrInlineRender: true,
  setup(__props) {
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const currentState = ref("idle");
    const isAutoPlaying = ref(false);
    const growingFunction = () => {
      if (splashRef.value) {
        splashRef.value.startGrowingAnimation();
      }
    };
    const shrinkingFunction = () => {
      if (splashRef.value) {
        splashRef.value.startShrinkingAnimation();
      }
    };
    const handleResourcesLoaded = () => {
      loadComplete.value = true;
      console.log("\u8CC7\u6E90\u8F09\u5165\u5B8C\u6210\uFF0C\u958B\u59CB\u81EA\u52D5\u64AD\u653E");
      startAutoPlay();
    };
    const handleStateChange = (state) => {
      currentState.value = state;
    };
    const handleAnimationComplete = (animationType) => {
      if (!isAutoPlaying.value) return;
      if (animationType === "growing") {
        setTimeout(() => {
          shrinkingFunction();
        }, 1e3);
      } else if (animationType === "shrinking") {
        setTimeout(() => {
          growingFunction();
        }, 1e3);
      }
    };
    const startAutoPlay = () => {
      if (isAutoPlaying.value) return;
      isAutoPlaying.value = true;
      growingFunction();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Splash2 = __nuxt_component_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Splash2, {
        ref_key: "splashRef",
        ref: splashRef,
        onResourcesLoaded: handleResourcesLoaded,
        onStateChange: handleStateChange,
        onAnimationComplete: handleAnimationComplete
      }, null, _parent));
      _push(`<div class="button-group" data-v-81e9fa62><button data-v-81e9fa62>\u958B\u59CB\u751F\u9577</button><button data-v-81e9fa62>\u958B\u59CB\u6536\u5408</button><button data-v-81e9fa62>\u958B\u59CB\u81EA\u52D5\u64AD\u653E</button><button data-v-81e9fa62>\u505C\u6B62\u81EA\u52D5\u64AD\u653E</button><div class="status" data-v-81e9fa62>\u72C0\u614B: ${ssrInterpolate(unref(currentState))}</div><div class="status" data-v-81e9fa62>\u8CC7\u6E90\u72C0\u614B: ${ssrInterpolate(unref(loadComplete) ? "\u5DF2\u8F09\u5165" : "\u8F09\u5165\u4E2D")}</div><div class="status" data-v-81e9fa62>\u81EA\u52D5\u64AD\u653E: ${ssrInterpolate(unref(isAutoPlaying) ? "\u9032\u884C\u4E2D" : "\u505C\u6B62")}</div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ver2-6.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ver26 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-81e9fa62"]]);

export { ver26 as default };
//# sourceMappingURL=ver2-6-BtEA31xw.mjs.map
