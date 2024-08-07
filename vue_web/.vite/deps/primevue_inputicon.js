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

// node_modules/primevue/inputicon/style/inputiconstyle.esm.js
var classes = {
  root: "p-input-icon"
};
var InputIconStyle = BaseStyle.extend({
  name: "inputicon",
  classes
});

// node_modules/primevue/inputicon/inputicon.esm.js
var script$1 = {
  name: "BaseInputIcon",
  "extends": script,
  style: InputIconStyle,
  props: {
    "class": null
  },
  provide: function provide() {
    return {
      $parentInstance: this
    };
  }
};
var script2 = {
  name: "InputIcon",
  "extends": script$1,
  inheritAttrs: false,
  computed: {
    containerClass: function containerClass() {
      return [this.cx("root"), this["class"]];
    }
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps({
    "class": $options.containerClass
  }, _ctx.ptmi("root")), [renderSlot(_ctx.$slots, "default")], 16);
}
script2.render = render;
export {
  script2 as default
};
//# sourceMappingURL=primevue_inputicon.js.map
