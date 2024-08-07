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

// node_modules/primevue/iconfield/style/iconfieldstyle.esm.js
var classes = {
  root: function root(_ref) {
    var props = _ref.props;
    return ["p-icon-field", {
      "p-icon-field-right": props.iconPosition === "right",
      "p-icon-field-left": props.iconPosition === "left"
    }];
  }
};
var IconFieldStyle = BaseStyle.extend({
  name: "iconfield",
  classes
});

// node_modules/primevue/iconfield/iconfield.esm.js
var script$1 = {
  name: "BaseIconField",
  "extends": script,
  props: {
    iconPosition: {
      type: String,
      "default": "right"
    }
  },
  style: IconFieldStyle,
  provide: function provide() {
    return {
      $parentInstance: this
    };
  }
};
var script2 = {
  name: "IconField",
  "extends": script$1,
  inheritAttrs: false
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root")
  }, _ctx.ptmi("root")), [renderSlot(_ctx.$slots, "default")], 16);
}
script2.render = render;
export {
  script2 as default
};
//# sourceMappingURL=primevue_iconfield.js.map
