import _sfc_main$1 from "../components/Splash.vue.mjs";
import { ref, unref, useSSRContext } from "vue";
import { ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    gsap.registerPlugin(ScrollTrigger);
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const currentState = ref("idle");
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
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
      _push(`<!--[--><div class="main-container"><div class="main-section">`);
      if (unref(loadComplete) && !unref(isStarted)) {
        _push(`<div class="startButton"> Start </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h1 class="${ssrRenderClass([{ "start": unref(isStarted) }, "company-name"])}"><span class="front-name"> Splash </span><span class="back-name"> DigiLab </span></h1></div>`);
      if (unref(isStarted)) {
        _push(`<div class="section section2"><h2>section2</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section3"><h2>section3</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section4"><h2>section4</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section5"><h2>section5</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section6"><h2>section6</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section7"><h2>section7</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section8"><h2>section8</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section9"><h2>section9</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section10"><h2>section10</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section11"><h2>section11</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section12"><h2>section12</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section13"><h2>section13</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section14"><h2>section14</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section15"><h2>section15</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section16"><h2>section16</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index.vue.mjs.map
