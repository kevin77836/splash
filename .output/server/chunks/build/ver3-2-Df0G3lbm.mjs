import { ref, unref, useSSRContext } from 'vue';
import { ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = {
  __name: "ver3-2",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    ref(true);
    ref(false);
    const isReady = ref(false);
    const isPlaying = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="splash-container"><div class="canvas-container"></div></div>`);
      if (!unref(isPlaying)) {
        _push(`<button class="control-button"${ssrIncludeBooleanAttr(!unref(isReady)) ? " disabled" : ""}> Play </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ver3-2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ver3-2-Df0G3lbm.mjs.map
