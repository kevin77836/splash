import { ref, useSSRContext } from 'vue';

const _sfc_main = {
  __name: "ver4",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    ref("liquid");
    ref(false);
    ref(true);
    ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="main-container"><h1 class="company-name"><div class="front-name"> Splash </div><div class="back-name"> DigiLab </div></h1></div><div class="splash-container"><div class="canvas-container"></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ver4.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ver4.vue.mjs.map
