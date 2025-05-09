import { ref, reactive, mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "/Users/kevin/Documents/Github/splash/node_modules/hookable/dist/index.mjs";
import "/Users/kevin/Documents/Github/splash/node_modules/unctx/dist/index.mjs";
import "/Users/kevin/Documents/Github/splash/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/kevin/Documents/Github/splash/node_modules/radix3/dist/index.mjs";
import "/Users/kevin/Documents/Github/splash/node_modules/defu/dist/defu.mjs";
import "/Users/kevin/Documents/Github/splash/node_modules/ufo/dist/index.mjs";
const _sfc_main$1 = {
  __name: "Splash1",
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
      baseShrinkDuration: 3,
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "splash-container" }, _attrs))} data-v-774b0df8><div class="canvas-container" data-v-774b0df8></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Splash1.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-774b0df8"]]);
const _sfc_main = {
  __name: "ver2-5",
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
      console.log("資源載入完成，開始自動播放");
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
      const _component_Splash1 = __nuxt_component_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Splash1, {
        ref_key: "splashRef",
        ref: splashRef,
        onResourcesLoaded: handleResourcesLoaded,
        onStateChange: handleStateChange,
        onAnimationComplete: handleAnimationComplete
      }, null, _parent));
      _push(`<div class="button-group" data-v-22256174><button data-v-22256174>開始生長</button><button data-v-22256174>開始收合</button><button data-v-22256174>開始自動播放</button><button data-v-22256174>停止自動播放</button><div class="status" data-v-22256174>狀態: ${ssrInterpolate(unref(currentState))}</div><div class="status" data-v-22256174>資源狀態: ${ssrInterpolate(unref(loadComplete) ? "已載入" : "載入中")}</div><div class="status" data-v-22256174>自動播放: ${ssrInterpolate(unref(isAutoPlaying) ? "進行中" : "停止")}</div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ver2-5.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ver25 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-22256174"]]);
export {
  ver25 as default
};
//# sourceMappingURL=ver2-5-DW-ibh5f.js.map
