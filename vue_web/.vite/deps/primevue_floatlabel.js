import {
  script
} from "./chunk-3D7XU76W.js";
import {
  BaseStyle
} from "./chunk-HPFN3SJC.js";
import "./chunk-32WPC2CU.js";
import {
  createElementBlock,
  mergeProps,
  openBlock,
  renderSlot
} from "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/floatlabel/style/floatlabelstyle.esm.js
var classes = {
  root: "p-float-label"
};
var FloatLabelStyle = BaseStyle.extend({
  name: "floatlabel",
  classes
});

// node_modules/primevue/floatlabel/floatlabel.esm.js
var script$1 = {
  name: "BaseFloatLabel",
  "extends": script,
  props: {},
  style: FloatLabelStyle,
  provide: function provide() {
    return {
      $parentInstance: this
    };
  }
};
var script2 = {
  name: "FloatLabel",
  "extends": script$1,
  inheritAttrs: false
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps({
    "class": _ctx.cx("root")
  }, _ctx.ptmi("root")), [renderSlot(_ctx.$slots, "default")], 16);
}
script2.render = render;
export {
  script2 as default
};
//# sourceMappingURL=primevue_floatlabel.js.map
