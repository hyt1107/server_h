import {
  script
} from "./chunk-3D7XU76W.js";
import "./chunk-HPFN3SJC.js";
import "./chunk-32WPC2CU.js";
import {
  renderSlot
} from "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/tabpanel/style/tabpanelstyle.esm.js
var TabPanelStyle = {};

// node_modules/primevue/tabpanel/tabpanel.esm.js
var script$1 = {
  name: "BaseTabPanel",
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
  style: TabPanelStyle
};
var script2 = {
  name: "TabPanel",
  "extends": script$1
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default");
}
script2.render = render;
export {
  script2 as default
};
//# sourceMappingURL=primevue_tabpanel.js.map
