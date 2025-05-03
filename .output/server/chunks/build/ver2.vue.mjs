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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "splash-container" }, _attrs))}><div class="canvas-container"></div><div id="thickToThinPanel" class="control-panel thick-to-thin-panel"><div class="panel-title">由粗到細 線條控制</div><div class="control-group"><label class="control-label">最粗粗度 (強度): <span class="value-display">${ssrInterpolate(unref(ttStartStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttStartStrength))} min="0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">最細粗度 (強度): <span class="value-display">${ssrInterpolate(unref(ttEndStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttEndStrength))} min="0.0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">最短長度: <span class="value-display">${ssrInterpolate(unref(ttMinWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttMinWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">最長長度: <span class="value-display">${ssrInterpolate(unref(ttMaxWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttMaxWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">收縮速率 (冪): <span class="value-display">${ssrInterpolate(unref(ttShrinkPower).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttShrinkPower))} min="0.1" max="5.0" step="0.05"></div><div class="control-group"><label class="control-label">線條數量: <span class="value-display">${ssrInterpolate(unref(ttNumLines))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttNumLines))} min="0" max="10" step="1"></div></div><div id="thinToThickPanel" class="control-panel thin-to-thick-panel"><div class="panel-title">由細到粗 線條控制</div><div class="control-group"><label class="control-label">最細粗度 (強度): <span class="value-display">${ssrInterpolate(unref(thStartStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(thStartStrength))} min="0.0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">最粗粗度 (強度): <span class="value-display">${ssrInterpolate(unref(thEndStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(thEndStrength))} min="0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">最短長度: <span class="value-display">${ssrInterpolate(unref(thMinWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(thMinWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">最長長度: <span class="value-display">${ssrInterpolate(unref(thMaxWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(thMaxWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">膨脹速率 (冪): <span class="value-display">${ssrInterpolate(unref(thShrinkPower).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(thShrinkPower))} min="0.1" max="5.0" step="0.05"></div><div class="control-group"><label class="control-label">線條數量: <span class="value-display">${ssrInterpolate(unref(thNumLines))}</span></label><input type="range"${ssrRenderAttr("value", unref(thNumLines))} min="0" max="10" step="1"></div></div><div id="commonPanel" class="control-panel common-panel"><div class="panel-title">通用控制</div><button>重新生成所有線條</button><button style="${ssrRenderStyle({ "margin-top": "5px" })}">匯出設定 (JSON)</button><button style="${ssrRenderStyle({ "margin-top": "5px" })}">匯入設定 (JSON)</button><input type="file" accept=".json" style="${ssrRenderStyle({ "display": "none" })}"><button style="${ssrRenderStyle({ "margin-top": "5px" })}">下載目前模型 (GLB)</button></div><div id="switchPanel" class="control-panel switch-panel"><div class="panel-title">快速切換</div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(currentMaterial) === "shader" ? "描邊材質" : "液體材質")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(currentMaterial) === "liquid") ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isFlowing) ? "流動中" : "靜止")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isFlowing)) ? " checked" : ""}><span class="slider round"></span></label></div><div class="switch-control-group"><label class="switch-label">${ssrInterpolate(unref(isPixelated) ? "像素化" : "正常")}</label><label class="switch"><input type="checkbox"${ssrIncludeBooleanAttr(unref(isPixelated)) ? " checked" : ""}><span class="slider round"></span></label></div></div></div>`);
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
//# sourceMappingURL=ver2.vue.mjs.map
