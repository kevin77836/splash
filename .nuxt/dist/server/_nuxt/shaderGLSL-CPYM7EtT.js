import { ref, reactive, mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
import { useWindowSize } from "@vueuse/core";
const _sfc_main$1 = {
  __name: "SplashGLSL",
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
    const canvasContainer = ref(null);
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
      minRadius: 0.35,
      // 最小半徑
      maxRadius: 0.5,
      // 最大半徑
      minLength: 3,
      // 最小目標長度
      maxLength: 10,
      // 最大目標長度
      segmentDetail: 16,
      // 幾何體細分
      minScale: 0
      // 最小縮放值(原點狀態)
    });
    reactive({
      // 基本設定
      mobileResolution: 100,
      resolution: 100,
      // Marching Cubes 解析度
      numSegments: 50,
      // 每條線分段數量
      subtract: 20,
      // Metaball 減法參數
      // 統一動畫控制參數
      growSpeed: 0.1,
      // 生長速度 (值越大生長越快)
      growthEaseOutPower: 0.15,
      // 生長緩動指數 (值越小結尾越平滑)
      shrinkSpeed: 1,
      // 收縮速度 (值越大收縮越快)
      shrinkEaseInPower: 2.5,
      // 收縮緩動指數 (值越大開頭越快)
      // 波浪效果設定
      flowWaveFrequency: 1,
      // 波浪頻率
      flowWaveAmplitudeFactor: 0.3,
      // 波浪振幅因子
      flowWaveAmplitudeFactorAtStart: 1.5,
      // 原點狀態下的波浪振幅因子
      flowWavePhaseFactor: Math.PI * 4
      // 波浪相位因子
    });
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test((void 0).userAgent);
    }
    function startGrowingAnimation() {
    }
    function startShrinkingAnimation() {
    }
    function addMouseControlEvents() {
      const container = canvasContainer.value;
      if (!container) return;
      if (!isMobileDevice()) {
        console.log("啟用桌面滑鼠控制");
        (void 0).addEventListener("mousemove", onMouseMove);
      } else {
        console.log("行動裝置，不啟用滑鼠控制");
      }
    }
    function onMouseMove(event) {
      if (isMobileDevice()) return;
      const centerX = (void 0).innerWidth / 2;
      const centerY = (void 0).innerHeight / 2;
      (event.clientX - centerX) * 1e-3;
      (event.clientY - centerY) * 1e-3;
      (event.clientX / (void 0).innerWidth - 0.5) * Math.PI * 2;
      (event.clientY / (void 0).innerHeight - 0.5) * Math.PI * 2;
      event.clientX;
      event.clientY;
    }
    __expose({
      startGrowingAnimation,
      startShrinkingAnimation,
      addMouseControlEvents,
      updatePosition
    });
    function updatePosition(xOffset, yOffset, zOffset) {
      return;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-splash-component" }, _attrs))}><div class="canvas-container"></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SplashGLSL.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "shaderGLSL",
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
      const _component_SplashGLSL = _sfc_main$1;
      _push(`<!--[--><div class="main-container"><div class="main-section">`);
      if (unref(loadComplete) && !unref(isStarted)) {
        _push(`<div class="startButton"> Start </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h1 class="${ssrRenderClass([{ "hidden": !unref(isLandingPage) || unref(isLandingPage) && !unref(isStarted) }, "company-name"])}"><span class="front-name"> Splash </span><span class="back-name"> DigiLab </span></h1></div>`);
      if (unref(isStarted)) {
        _push(`<div class="section section2"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isStarted)) {
        _push(`<div class="section section3"></div>`);
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
        _push(`<div class="section aboutUsSection"></div>`);
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
        _push(`<div class="section ourWorksSection"></div>`);
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
      _push(ssrRenderComponent(_component_SplashGLSL, {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shaderGLSL.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=shaderGLSL-CPYM7EtT.js.map
