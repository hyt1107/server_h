import {
  script
} from "./chunk-3D7XU76W.js";
import {
  BaseStyle
} from "./chunk-HPFN3SJC.js";
import "./chunk-32WPC2CU.js";
import {
  createBaseVNode,
  createElementBlock,
  mergeProps,
  openBlock
} from "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/progressspinner/style/progressspinnerstyle.esm.js
var classes = {
  root: "p-progress-spinner",
  spinner: "p-progress-spinner-svg",
  circle: "p-progress-spinner-circle"
};
var ProgressSpinnerStyle = BaseStyle.extend({
  name: "progressspinner",
  classes
});

// node_modules/primevue/progressspinner/progressspinner.esm.js
var script$1 = {
  name: "BaseProgressSpinner",
  "extends": script,
  props: {
    strokeWidth: {
      type: String,
      "default": "2"
    },
    fill: {
      type: String,
      "default": "none"
    },
    animationDuration: {
      type: String,
      "default": "2s"
    }
  },
  style: ProgressSpinnerStyle,
  provide: function provide() {
    return {
      $parentInstance: this
    };
  }
};
var script2 = {
  name: "ProgressSpinner",
  "extends": script$1,
  inheritAttrs: false,
  computed: {
    svgStyle: function svgStyle() {
      return {
        "animation-duration": this.animationDuration
      };
    }
  }
};
var _hoisted_1 = ["fill", "stroke-width"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root"),
    role: "progressbar"
  }, _ctx.ptmi("root")), [(openBlock(), createElementBlock("svg", mergeProps({
    "class": _ctx.cx("spinner"),
    viewBox: "25 25 50 50",
    style: $options.svgStyle
  }, _ctx.ptm("spinner")), [createBaseVNode("circle", mergeProps({
    "class": _ctx.cx("circle"),
    cx: "50",
    cy: "50",
    r: "20",
    fill: _ctx.fill,
    "stroke-width": _ctx.strokeWidth,
    strokeMiterlimit: "10"
  }, _ctx.ptm("circle")), null, 16, _hoisted_1)], 16))], 16);
}
script2.render = render;
export {
  script2 as default
};
//# sourceMappingURL=primevue_progressspinner.js.map
