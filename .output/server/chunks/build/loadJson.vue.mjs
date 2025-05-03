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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "splash-container" }, _attrs))}><div class="canvas-container"></div><div id="switchPanel" class="control-panel switch-panel"><div class="panel-title">效果切換</div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(currentMaterial) === "shader" ? "描邊材質" : "液體材質")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(currentMaterial) === "liquid") ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isFlowing) ? "流動中" : "靜止")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isFlowing)) ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isPixelated) ? "像素化" : "正常")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isPixelated)) ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isAutoRotating) ? "自動旋轉中" : "靜止")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isAutoRotating)) ? " checked" : ""}><span class="slider round"></span></label></div></div></div>`);
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
//# sourceMappingURL=loadJson.vue.mjs.map
