import {
  script
} from "./chunk-3D7XU76W.js";
import "./chunk-HPFN3SJC.js";
import "./chunk-32WPC2CU.js";
import {
  createCommentVNode,
  createElementBlock,
  mergeProps,
  openBlock,
  renderSlot
} from "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/deferredcontent/style/deferredcontentstyle.esm.js
var DeferredContentStyle = {};

// node_modules/primevue/deferredcontent/deferredcontent.esm.js
var script2 = {
  name: "DeferredContent",
  "extends": script,
  inheritAttrs: false,
  emits: ["load"],
  style: DeferredContentStyle,
  data: function data() {
    return {
      loaded: false
    };
  },
  mounted: function mounted() {
    if (!this.loaded) {
      if (this.shouldLoad())
        this.load();
      else
        this.bindScrollListener();
    }
  },
  beforeUnmount: function beforeUnmount() {
    this.unbindScrollListener();
  },
  methods: {
    bindScrollListener: function bindScrollListener() {
      var _this = this;
      this.documentScrollListener = function() {
        if (_this.shouldLoad()) {
          _this.load();
          _this.unbindScrollListener();
        }
      };
      window.addEventListener("scroll", this.documentScrollListener);
    },
    unbindScrollListener: function unbindScrollListener() {
      if (this.documentScrollListener) {
        window.removeEventListener("scroll", this.documentScrollListener);
        this.documentScrollListener = null;
      }
    },
    shouldLoad: function shouldLoad() {
      if (this.loaded) {
        return false;
      } else {
        var rect = this.$refs.container.getBoundingClientRect();
        var docElement = document.documentElement;
        var winHeight = docElement.clientHeight;
        return winHeight >= rect.top;
      }
    },
    load: function load(event) {
      this.loaded = true;
      this.$emit("load", event);
    }
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    ref: "container"
  }, _ctx.ptmi("root")), [$data.loaded ? renderSlot(_ctx.$slots, "default", {
    key: 0
  }) : createCommentVNode("", true)], 16);
}
script2.render = render;
export {
  script2 as default
};
//# sourceMappingURL=primevue_deferredcontent.js.map
