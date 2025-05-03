import __nuxt_component_0 from "../components/Splash1.vue.mjs";
import { ref, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
/* empty css             */
import _export_sfc from "../_virtual/_plugin-vue_export-helper.mjs";
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
//# sourceMappingURL=ver2-5.vue.mjs.map
