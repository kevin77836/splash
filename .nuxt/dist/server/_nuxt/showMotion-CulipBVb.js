import { _ as _sfc_main$1 } from "./Splash-DJc1Nhcl.js";
import { ref, unref, useSSRContext } from "vue";
import { ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
import { useWindowSize } from "@vueuse/core";
const _sfc_main = {
  __name: "showMotion",
  __ssrInlineRender: true,
  setup(__props) {
    const { width, height } = useWindowSize();
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const currentState = ref("idle");
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
    const isHidden = ref(true);
    ref(false);
    ref(true);
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
        }, 0);
      } else if (animationType === "shrinking") {
        setTimeout(() => {
          growingFunction();
        }, 1e3);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Splash = _sfc_main$1;
      _push(`<!--[--><div class="main-container"><div class="main-section">`);
      if (unref(loadComplete) && !unref(isStarted)) {
        _push(`<div class="startButton"> Start </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h1 class="${ssrRenderClass([{ "hidden": unref(isHidden) }, "company-name"])}"><span class="front-name"> Splash </span><span class="back-name"> DigiLab </span></h1></div></div>`);
      _push(ssrRenderComponent(_component_Splash, {
        ref_key: "splashRef",
        ref: splashRef,
        onResourcesLoaded: handleResourcesLoaded,
        onStateChange: handleStateChange,
        onAnimationComplete: handleAnimationComplete
      }, null, _parent));
      _push(`<div class="${ssrRenderClass([{ "active": unref(isStarted) }, "l-header"])}"><div class="desktop-group"><div class="header-link"> AR/VR </div><div class="header-saparator"><div class="header-saparator-line"></div></div><div class="header-link"> Animation </div><div class="header-saparator"><div class="header-saparator-line"></div></div><div class="header-link"> UI/UX </div></div></div><div class="${ssrRenderClass([{ "active": unref(isStarted) }, "l-footer"])}"><div class="desktop-group"><div class="footer-link"> Web Development </div><div class="footer-saparator"><div class="footer-saparator-line"></div></div><div class="footer-link"> CIS </div><div class="footer-saparator"><div class="footer-saparator-line"></div></div><div class="footer-link"> Graphic Design </div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/showMotion.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=showMotion-CulipBVb.js.map
