import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = {
  __name: "loadJson",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const currentMaterial = ref("shader");
    const isPixelated = ref(false);
    const isAutoRotating = ref(false);
    const isFlowing = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "splash-container" }, _attrs))}><div class="canvas-container"></div><div id="switchPanel" class="control-panel switch-panel"><div class="panel-title">\u6548\u679C\u5207\u63DB</div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(currentMaterial) === "shader" ? "\u63CF\u908A\u6750\u8CEA" : "\u6DB2\u9AD4\u6750\u8CEA")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(currentMaterial) === "liquid") ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isFlowing) ? "\u6D41\u52D5\u4E2D" : "\u975C\u6B62")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isFlowing)) ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isPixelated) ? "\u50CF\u7D20\u5316" : "\u6B63\u5E38")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isPixelated)) ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isAutoRotating) ? "\u81EA\u52D5\u65CB\u8F49\u4E2D" : "\u975C\u6B62")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isAutoRotating)) ? " checked" : ""}><span class="slider round"></span></label></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/loadJson.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=loadJson-D7YzH7QK.mjs.map
