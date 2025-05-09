import { ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = {
  __name: "ver2",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    ref(null);
    const ttStartStrength = ref(0.1);
    const ttEndStrength = ref(0.01);
    const ttMinWorldLength = ref(2.5);
    const ttMaxWorldLength = ref(3.5);
    const ttShrinkPower = ref(0.25);
    const ttNumLines = ref(4);
    const thStartStrength = ref(0.01);
    const thEndStrength = ref(0.1);
    const thMinWorldLength = ref(2);
    const thMaxWorldLength = ref(3);
    const thShrinkPower = ref(1.25);
    const thNumLines = ref(3);
    const resolution = ref(200);
    const currentMaterial = ref("shader");
    const isFlowing = ref(false);
    const isPixelated = ref(false);
    function updateMarchingCubesParams() {
    }
    watch(resolution, updateMarchingCubesParams);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "splash-container" }, _attrs))}><div class="canvas-container"></div><div id="thickToThinPanel" class="control-panel thick-to-thin-panel"><div class="panel-title">\u7531\u7C97\u5230\u7D30 \u7DDA\u689D\u63A7\u5236</div><div class="control-group"><label class="control-label">\u6700\u7C97\u7C97\u5EA6 (\u5F37\u5EA6): <span class="value-display">${ssrInterpolate(unref(ttStartStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttStartStrength))} min="0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">\u6700\u7D30\u7C97\u5EA6 (\u5F37\u5EA6): <span class="value-display">${ssrInterpolate(unref(ttEndStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttEndStrength))} min="0.0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">\u6700\u77ED\u9577\u5EA6: <span class="value-display">${ssrInterpolate(unref(ttMinWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttMinWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">\u6700\u9577\u9577\u5EA6: <span class="value-display">${ssrInterpolate(unref(ttMaxWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttMaxWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">\u6536\u7E2E\u901F\u7387 (\u51AA): <span class="value-display">${ssrInterpolate(unref(ttShrinkPower).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttShrinkPower))} min="0.1" max="5.0" step="0.05"></div><div class="control-group"><label class="control-label">\u7DDA\u689D\u6578\u91CF: <span class="value-display">${ssrInterpolate(unref(ttNumLines))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttNumLines))} min="0" max="10" step="1"></div></div><div id="thinToThickPanel" class="control-panel thin-to-thick-panel"><div class="panel-title">\u7531\u7D30\u5230\u7C97 \u7DDA\u689D\u63A7\u5236</div><div class="control-group"><label class="control-label">\u6700\u7D30\u7C97\u5EA6 (\u5F37\u5EA6): <span class="value-display">${ssrInterpolate(unref(thStartStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(thStartStrength))} min="0.0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">\u6700\u7C97\u7C97\u5EA6 (\u5F37\u5EA6): <span class="value-display">${ssrInterpolate(unref(thEndStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(thEndStrength))} min="0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">\u6700\u77ED\u9577\u5EA6: <span class="value-display">${ssrInterpolate(unref(thMinWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(thMinWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">\u6700\u9577\u9577\u5EA6: <span class="value-display">${ssrInterpolate(unref(thMaxWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(thMaxWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">\u81A8\u8139\u901F\u7387 (\u51AA): <span class="value-display">${ssrInterpolate(unref(thShrinkPower).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(thShrinkPower))} min="0.1" max="5.0" step="0.05"></div><div class="control-group"><label class="control-label">\u7DDA\u689D\u6578\u91CF: <span class="value-display">${ssrInterpolate(unref(thNumLines))}</span></label><input type="range"${ssrRenderAttr("value", unref(thNumLines))} min="0" max="10" step="1"></div></div><div id="commonPanel" class="control-panel common-panel"><div class="panel-title">\u901A\u7528\u63A7\u5236</div><button>\u91CD\u65B0\u751F\u6210\u6240\u6709\u7DDA\u689D</button><button style="${ssrRenderStyle({ "margin-top": "5px" })}">\u532F\u51FA\u8A2D\u5B9A (JSON)</button><button style="${ssrRenderStyle({ "margin-top": "5px" })}">\u532F\u5165\u8A2D\u5B9A (JSON)</button><input type="file" accept=".json" style="${ssrRenderStyle({ "display": "none" })}"><button style="${ssrRenderStyle({ "margin-top": "5px" })}">\u4E0B\u8F09\u76EE\u524D\u6A21\u578B (GLB)</button></div><div id="switchPanel" class="control-panel switch-panel"><div class="panel-title">\u5FEB\u901F\u5207\u63DB</div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(currentMaterial) === "shader" ? "\u63CF\u908A\u6750\u8CEA" : "\u6DB2\u9AD4\u6750\u8CEA")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(currentMaterial) === "liquid") ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isFlowing) ? "\u6D41\u52D5\u4E2D" : "\u975C\u6B62")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isFlowing)) ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isPixelated) ? "\u50CF\u7D20\u5316" : "\u6B63\u5E38")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isPixelated)) ? " checked" : ""}><span class="slider round"></span></label></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ver2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ver2-5ZYBTRCf.mjs.map
