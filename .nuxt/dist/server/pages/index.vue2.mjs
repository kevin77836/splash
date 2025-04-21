import { defineComponent, ref, computed, watch, mergeProps, unref } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
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
    const isolation = ref(300);
    const currentMaterial = ref("shader");
    const isFlowing = ref(false);
    const toggleMaterialButtonText = computed(() => {
      return currentMaterial.value === "shader" ? "切換為液體材質" : "切換為描邊材質";
    });
    const toggleFlowButtonText = computed(() => {
      return isFlowing.value ? "停止流動動畫" : "開始流動動畫";
    });
    function updateMarchingCubesParams() {
    }
    watch(resolution, updateMarchingCubesParams);
    watch(isolation, updateMarchingCubesParams);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "splash-container" }, _attrs))}><div class="canvas-container"></div><div id="thickToThinPanel" class="control-panel thick-to-thin-panel"><div class="panel-title">由粗到細 線條控制</div><div class="control-group"><label class="control-label">最粗粗度 (強度): <span class="value-display">${ssrInterpolate(unref(ttStartStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttStartStrength))} min="0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">最細粗度 (強度): <span class="value-display">${ssrInterpolate(unref(ttEndStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttEndStrength))} min="0.0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">最短長度: <span class="value-display">${ssrInterpolate(unref(ttMinWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttMinWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">最長長度: <span class="value-display">${ssrInterpolate(unref(ttMaxWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttMaxWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">收縮速率 (冪): <span class="value-display">${ssrInterpolate(unref(ttShrinkPower).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttShrinkPower))} min="0.1" max="5.0" step="0.05"></div><div class="control-group"><label class="control-label">線條數量: <span class="value-display">${ssrInterpolate(unref(ttNumLines))}</span></label><input type="range"${ssrRenderAttr("value", unref(ttNumLines))} min="0" max="10" step="1"></div></div><div id="thinToThickPanel" class="control-panel thin-to-thick-panel"><div class="panel-title">由細到粗 線條控制</div><div class="control-group"><label class="control-label">最細粗度 (強度): <span class="value-display">${ssrInterpolate(unref(thStartStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(thStartStrength))} min="0.0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">最粗粗度 (強度): <span class="value-display">${ssrInterpolate(unref(thEndStrength).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(thEndStrength))} min="0" max="0.1" step="0.01"></div><div class="control-group"><label class="control-label">最短長度: <span class="value-display">${ssrInterpolate(unref(thMinWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(thMinWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">最長長度: <span class="value-display">${ssrInterpolate(unref(thMaxWorldLength).toFixed(1))}</span></label><input type="range"${ssrRenderAttr("value", unref(thMaxWorldLength))} min="0.5" max="5.0" step="0.1"></div><div class="control-group"><label class="control-label">膨脹速率 (冪): <span class="value-display">${ssrInterpolate(unref(thShrinkPower).toFixed(2))}</span></label><input type="range"${ssrRenderAttr("value", unref(thShrinkPower))} min="0.1" max="5.0" step="0.05"></div><div class="control-group"><label class="control-label">線條數量: <span class="value-display">${ssrInterpolate(unref(thNumLines))}</span></label><input type="range"${ssrRenderAttr("value", unref(thNumLines))} min="0" max="10" step="1"></div></div><div id="commonPanel" class="control-panel common-panel"><div class="panel-title">通用控制</div><div class="control-group"><label class="control-label">MarchingCubes 解析度: <span class="value-display">${ssrInterpolate(unref(resolution))}</span></label><input type="range"${ssrRenderAttr("value", unref(resolution))} min="10" max="500" step="1"></div><div class="control-group"><label class="control-label">MarchingCubes Isolation: <span class="value-display">${ssrInterpolate(unref(isolation))}</span></label><input type="range"${ssrRenderAttr("value", unref(isolation))} min="10" max="300" step="10"></div><button>重新生成所有線條</button><button style="${ssrRenderStyle({ "margin-top": "5px" })}">匯出設定 (JSON)</button><button style="${ssrRenderStyle({ "margin-top": "5px" })}">匯入設定 (JSON)</button><input type="file" accept=".json" style="${ssrRenderStyle({ "display": "none" })}"><button style="${ssrRenderStyle({ "margin-top": "5px" })}">下載目前模型 (GLB)</button><button style="${ssrRenderStyle({ "margin-top": "5px" })}">${ssrInterpolate(unref(toggleMaterialButtonText))}</button><button style="${ssrRenderStyle({ "margin-top": "5px" })}">${ssrInterpolate(unref(toggleFlowButtonText))}</button></div></div>`);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=index.vue2.mjs.map
