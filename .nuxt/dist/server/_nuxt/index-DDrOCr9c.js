import { _ as _sfc_main$1 } from "./Splash-DJc1Nhcl.js";
import { ref, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { publicAssetsURL } from "#internal/nuxt/paths";
import { useWindowSize } from "@vueuse/core";
const _imports_0 = publicAssetsURL("/works/works15.png");
const _imports_1 = publicAssetsURL("/works/works14.png");
const _imports_2 = publicAssetsURL("/works/works13.png");
const _imports_3 = publicAssetsURL("/works/works12.jpg");
const _imports_4 = publicAssetsURL("/works/works11.png");
const _imports_5 = publicAssetsURL("/works/works10.png");
const _imports_6 = publicAssetsURL("/works/works9.png");
const _imports_7 = publicAssetsURL("/works/works8.jpg");
const _imports_8 = publicAssetsURL("/works/works7.png");
const _imports_9 = publicAssetsURL("/works/works6.png");
const _imports_10 = publicAssetsURL("/works/works5.png");
const _imports_11 = publicAssetsURL("/works/works4.jpg");
const _imports_12 = publicAssetsURL("/works/works3.jpg");
const _imports_13 = publicAssetsURL("/works/works2.png");
const _imports_14 = publicAssetsURL("/works/works1.jpg");
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
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Splash, {
        ref_key: "splashRef",
        ref: splashRef,
        onResourcesLoaded: handleResourcesLoaded,
        onStateChange: handleStateChange,
        onAnimationComplete: handleAnimationComplete
      }, null, _parent));
      _push(`<div class="${ssrRenderClass([{ "active": unref(isStarted) }, "l-header"])}"><div class="desktop-group"><div class="${ssrRenderClass([{ "hidden": unref(isLandingPage) }, "header-link"])}"> Splash DigiLab </div><div class="${ssrRenderClass([{ "hidden": unref(isLandingPage) }, "header-saparator"])}"><div class="header-saparator-line"></div></div><div class="header-link"> About Us </div><div class="${ssrRenderClass([{ "hidden": !unref(isLandingPage) }, "header-saparator"])}"><div class="header-saparator-line"></div></div><div class="header-link"> Works </div><div class="${ssrRenderClass([{ "hidden": !unref(isLandingPage) }, "header-saparator"])}"><div class="header-saparator-line"></div></div><div class="header-link"> Services </div><div class="${ssrRenderClass([{ "hidden": !unref(isLandingPage) }, "header-saparator"])}"><div class="header-saparator-line"></div></div><div class="header-link"> Contact Us </div></div><div class="mobile-group"><div class="${ssrRenderClass([{ "hidden": unref(isLandingPage) }, "header-link"])}">Splash DigiLab</div><div class="header-saparator"><div class="header-saparator-line"></div></div><div class="hamburger-menu"><div class="${ssrRenderClass([{ "open": unref(isMenuOpen) }, "hamburger-icon"])}"><span></span><span></span><span></span></div></div></div><div class="${ssrRenderClass([{ "active": unref(isMenuOpen) }, "mobile-menu"])}"><div class="menu-item"> About Us </div><div class="menu-item"> Works </div><div class="menu-item"> Services </div><div class="menu-item"> Contact Us </div></div></div><div class="${ssrRenderClass([{ "active": unref(isStarted) && unref(isLandingPage) }, "l-footer"])}"><div class="desktop-group"><div class="footer-saparator"><div class="footer-saparator-line"></div></div><div class="footer-link"> Let&#39;s Make a Splash </div><div class="footer-saparator"><div class="footer-saparator-line"></div></div></div></div><div class="main-container"><div class="section main-section">`);
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
        _push(`<div class="section aboutUs-section"><div class="aboutUs-marquee"><div class="aboutUs-marquee-content-group"><span class="aboutUs-marquee-content-group-item">Splash DigiLab</span><span class="aboutUs-marquee-content-group-item">斯巴拉系數位互動</span><span class="aboutUs-marquee-content-group-item">素晴らしいデジタルインタラクション</span></div><div class="aboutUs-marquee-content-group2"><span class="aboutUs-marquee-content-group-item">Splash DigiLab</span><span class="aboutUs-marquee-content-group-item">斯巴拉系數位互動</span><span class="aboutUs-marquee-content-group-item">素晴らしいデジタルインタラクション</span></div></div><div class="aboutUs-content-container"><div class="aboutUs-content-group"><div class="aboutUs-section-content aboutUs-section-content-1"><span class="aboutUs-section-content-1-1">123</span><span class="aboutUs-section-content-1-2">456</span></div><div class="aboutUs-section-content aboutUs-section-content-2"><span class="aboutUs-section-content-2-1">789</span><span class="aboutUs-section-content-2-2">012</span></div><div class="aboutUs-section-content aboutUs-section-content-3"><span class="aboutUs-section-content-3-1">345</span><span class="aboutUs-section-content-3-2">678</span></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section works-section"><div class="works-content-container"><a href="#" class="works-content-item works-content-item-15"><img${ssrRenderAttr("src", _imports_0)} alt=""></a><a href="#" class="works-content-item works-content-item-14"><img${ssrRenderAttr("src", _imports_1)} alt=""></a><a href="#" class="works-content-item works-content-item-13"><img${ssrRenderAttr("src", _imports_2)} alt=""></a><a href="#" class="works-content-item works-content-item-12"><img${ssrRenderAttr("src", _imports_3)} alt=""></a><a href="#" class="works-content-item works-content-item-11"><img${ssrRenderAttr("src", _imports_4)} alt=""></a><a href="#" class="works-content-item works-content-item-10"><img${ssrRenderAttr("src", _imports_5)} alt=""></a><a href="#" class="works-content-item works-content-item-9"><img${ssrRenderAttr("src", _imports_6)} alt=""></a><a href="#" class="works-content-item works-content-item-8"><img${ssrRenderAttr("src", _imports_7)} alt=""></a><a href="#" class="works-content-item works-content-item-7"><img${ssrRenderAttr("src", _imports_8)} alt=""></a><a href="#" class="works-content-item works-content-item-6"><img${ssrRenderAttr("src", _imports_9)} alt=""></a><a href="#" class="works-content-item works-content-item-5"><img${ssrRenderAttr("src", _imports_10)} alt=""></a><a href="#" class="works-content-item works-content-item-4"><img${ssrRenderAttr("src", _imports_11)} alt=""></a><a href="#" class="works-content-item works-content-item-3"><img${ssrRenderAttr("src", _imports_12)} alt=""></a><a href="#" class="works-content-item works-content-item-2"><img${ssrRenderAttr("src", _imports_13)} alt=""></a><a href="#" class="works-content-item works-content-item-1"><img${ssrRenderAttr("src", _imports_14)} alt=""></a></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section services-section"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section contactUs-section"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
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
//# sourceMappingURL=index-DDrOCr9c.js.map
