import { _ as _sfc_main$1 } from "./Splash-DJc1Nhcl.js";
import { ref, unref, useSSRContext } from "vue";
import { ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
const _sfc_main = {
  __name: "ver2-7",
  __ssrInlineRender: true,
  setup(__props) {
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const currentState = ref("idle");
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
    ref(null);
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
        }, 2e3);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Splash = _sfc_main$1;
      _push(`<!--[--><div class="main-container">`);
      if (unref(loadComplete) && !unref(isStarted)) {
        _push(`<div class="startButton"> Start </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h1 class="${ssrRenderClass([{ "start": unref(isStarted) }, "company-name"])}"><span class="front-name"> Splash </span><span class="back-name"> DigiLab </span></h1></div>`);
      _push(ssrRenderComponent(_component_Splash, {
        ref_key: "splashRef",
        ref: splashRef,
        isStarted: unref(isStarted),
        onResourcesLoaded: handleResourcesLoaded,
        onStateChange: handleStateChange,
        onAnimationComplete: handleAnimationComplete
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ver2-7.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=ver2-7-DVQMoLL3.js.map
