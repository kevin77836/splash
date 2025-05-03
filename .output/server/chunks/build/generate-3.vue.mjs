import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = {
  __name: "generate-3",
  __ssrInlineRender: true,
  setup(__props) {
    const isLoading = ref(true);
    const buttonText = ref("Play");
    ref("stopped");
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "splash-container" }, _attrs))}><div class="splash-canvas"></div><button class="control-button"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""}>${ssrInterpolate(unref(buttonText))}</button></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/generate-3.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=generate-3.vue.mjs.map
