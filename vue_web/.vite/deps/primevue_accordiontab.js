import {
  script
} from "./chunk-3D7XU76W.js";
import "./chunk-HPFN3SJC.js";
import "./chunk-32WPC2CU.js";
import {
  renderSlot
} from "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/accordiontab/style/accordiontabstyle.esm.js
var AccordionTabStyle = {};

// node_modules/primevue/accordiontab/accordiontab.esm.js
var script$1 = {
  name: "BaseAccordionTab",
  "extends": script,
  props: {
    header: null,
    headerStyle: null,
    headerClass: null,
    headerProps: null,
    headerActionProps: null,
    contentStyle: null,
    contentClass: null,
    contentProps: null,
    disabled: Boolean
  },
  style: AccordionTabStyle,
  provide: function provide() {
    return {
      $parentInstance: this
    };
  }
};
var script2 = {
  name: "AccordionTab",
  "extends": script$1,
  inheritAttrs: false
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default");
}
script2.render = render;
export {
  script2 as default
};
//# sourceMappingURL=primevue_accordiontab.js.map
