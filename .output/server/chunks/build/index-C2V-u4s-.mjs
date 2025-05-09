import { _ as _sfc_main$1 } from './Splash-DJc1Nhcl.mjs';
import { ref, unref, useSSRContext } from 'vue';
import { ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { useWindowSize } from '@vueuse/core';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { width, height } = useWindowSize();
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const currentState = ref("idle");
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
    const isMenuOpen = ref(false);
    const isLandingPage = ref(true);
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
      _push(`<h1 class="${ssrRenderClass([{ "hidden": !unref(isLandingPage) || unref(isLandingPage) && !unref(isStarted) }, "company-name"])}"></h1></div>`);
      if (unref(isStarted)) {
        _push(`<div class="section gap-section"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section aboutUs-section"><div class="aboutUs-marquee"><div class="aboutUs-marquee-content-group"><span class="aboutUs-marquee-content-group-item">Splash DigiLab</span><span class="aboutUs-marquee-content-group-item">\u65AF\u5DF4\u62C9\u7CFB\u6578\u4F4D\u4E92\u52D5</span><span class="aboutUs-marquee-content-group-item">\u7D20\u6674\u3089\u3057\u3044\u30C7\u30B8\u30BF\u30EB\u30A4\u30F3\u30BF\u30E9\u30AF\u30B7\u30E7\u30F3</span></div><div class="aboutUs-marquee-content-group2"><span class="aboutUs-marquee-content-group-item">Splash DigiLab</span><span class="aboutUs-marquee-content-group-item">\u65AF\u5DF4\u62C9\u7CFB\u6578\u4F4D\u4E92\u52D5</span><span class="aboutUs-marquee-content-group-item">\u7D20\u6674\u3089\u3057\u3044\u30C7\u30B8\u30BF\u30EB\u30A4\u30F3\u30BF\u30E9\u30AF\u30B7\u30E7\u30F3</span></div></div><div class="aboutUs-content-group"><div class="aboutUs-section-content aboutUs-section-content-1"><span class="aboutUs-section-content-1-1">123</span><span class="aboutUs-section-content-1-2">456</span></div><div class="aboutUs-section-content aboutUs-section-content-2"><span class="aboutUs-section-content-2-1">789</span><span class="aboutUs-section-content-2-2">012</span></div><div class="aboutUs-section-content aboutUs-section-content-3"><span class="aboutUs-section-content-3-1">345</span><span class="aboutUs-section-content-3-2">678</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section ourWorks-section"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section4"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section5"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section6"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section7"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section8"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section9"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section ourWorks-section"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section10"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section11"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section12"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section13"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section14"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section15"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section16"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section contactUsSection"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Splash, {
        ref_key: "splashRef",
        ref: splashRef,
        onResourcesLoaded: handleResourcesLoaded,
        onStateChange: handleStateChange,
        onAnimationComplete: handleAnimationComplete
      }, null, _parent));
      _push(`<div class="${ssrRenderClass([{ "active": unref(isStarted) && unref(isLandingPage) }, "l-footer"])}"><div class="desktop-group"><div class="footer-saparator"><div class="footer-saparator-line"></div></div><div class="footer-link"> Let&#39;s Make a Splash </div><div class="footer-saparator"><div class="footer-saparator-line"></div></div></div></div><div class="${ssrRenderClass([{ "active": unref(isStarted) }, "l-header"])}"><div class="desktop-group"><div class="${ssrRenderClass([{ "hidden": unref(isLandingPage) }, "header-link"])}"> Splash DigiLab </div><div class="${ssrRenderClass([{ "hidden": unref(isLandingPage) }, "header-saparator"])}"><div class="header-saparator-line"></div></div><div class="header-link"> About Us </div><div class="${ssrRenderClass([{ "hidden": !unref(isLandingPage) }, "header-saparator"])}"><div class="header-saparator-line"></div></div><div class="header-link"> Our Works </div><div class="${ssrRenderClass([{ "hidden": !unref(isLandingPage) }, "header-saparator"])}"><div class="header-saparator-line"></div></div><div class="header-link"> Contact Us </div></div><div class="mobile-group"><div class="${ssrRenderClass([{ "hidden": unref(isLandingPage) }, "header-link"])}">Splash DigiLab</div><div class="header-saparator"><div class="header-saparator-line"></div></div><div class="hamburger-menu"><div class="${ssrRenderClass([{ "open": unref(isMenuOpen) }, "hamburger-icon"])}"><span></span><span></span><span></span></div></div></div><div class="${ssrRenderClass([{ "active": unref(isMenuOpen) }, "mobile-menu"])}"><div class="menu-item"> About Us </div><div class="menu-item"> Our Works </div><div class="menu-item"> Contact Us </div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C2V-u4s-.mjs.map
