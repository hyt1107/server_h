import {
  script
} from "./chunk-3D7XU76W.js";
import {
  BaseStyle
} from "./chunk-HPFN3SJC.js";
import {
  DomHandler,
  ZIndexUtils
} from "./chunk-32WPC2CU.js";
import {
  createElementBlock,
  mergeProps,
  openBlock,
  renderSlot
} from "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/blockui/style/blockuistyle.esm.js
var classes = {
  root: "p-blockui-container"
};
var BlockUIStyle = BaseStyle.extend({
  name: "blockui",
  classes
});

// node_modules/primevue/blockui/blockui.esm.js
var script$1 = {
  name: "BaseBlockUI",
  "extends": script,
  props: {
    blocked: {
      type: Boolean,
      "default": false
    },
    fullScreen: {
      type: Boolean,
      "default": false
    },
    baseZIndex: {
      type: Number,
      "default": 0
    },
    autoZIndex: {
      type: Boolean,
      "default": true
    }
  },
  style: BlockUIStyle,
  provide: function provide() {
    return {
      $parentInstance: this
    };
  }
};
var script2 = {
  name: "BlockUI",
  "extends": script$1,
  inheritAttrs: false,
  emits: ["block", "unblock"],
  mask: null,
  data: function data() {
    return {
      isBlocked: false
    };
  },
  watch: {
    blocked: function blocked(newValue) {
      if (newValue === true)
        this.block();
      else
        this.unblock();
    }
  },
  mounted: function mounted() {
    if (this.blocked) {
      this.block();
    }
  },
  methods: {
    block: function block() {
      var styleClass = "p-blockui p-component-overlay p-component-overlay-enter";
      if (this.fullScreen) {
        styleClass += " p-blockui-document";
        this.mask = DomHandler.createElement("div", {
          style: {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%"
          },
          "class": !this.isUnstyled && styleClass,
          "p-bind": this.ptm("mask")
        });
        document.body.appendChild(this.mask);
        DomHandler.blockBodyScroll();
        document.activeElement.blur();
      } else {
        this.mask = DomHandler.createElement("div", {
          style: {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%"
          },
          "class": !this.isUnstyled && styleClass,
          "p-bind": this.ptm("mask")
        });
        this.$refs.container.appendChild(this.mask);
      }
      if (this.autoZIndex) {
        ZIndexUtils.set("modal", this.mask, this.baseZIndex + this.$primevue.config.zIndex.modal);
      }
      this.isBlocked = true;
      this.$emit("block");
    },
    unblock: function unblock() {
      var _this = this;
      !this.isUnstyled && DomHandler.addClass(this.mask, "p-component-overlay-leave");
      if (DomHandler.hasCSSAnimation(this.mask) > 0) {
        this.mask.addEventListener("animationend", function() {
          _this.removeMask();
        });
      } else {
        this.removeMask();
      }
    },
    removeMask: function removeMask() {
      ZIndexUtils.clear(this.mask);
      if (this.fullScreen) {
        document.body.removeChild(this.mask);
        DomHandler.unblockBodyScroll();
      } else {
        this.$refs.container.removeChild(this.mask);
      }
      this.isBlocked = false;
      this.$emit("unblock");
    }
  }
};
var _hoisted_1 = ["aria-busy"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    ref: "container",
    "class": _ctx.cx("root"),
    "aria-busy": $data.isBlocked
  }, _ctx.ptmi("root")), [renderSlot(_ctx.$slots, "default")], 16, _hoisted_1);
}
script2.render = render;
export {
  script2 as default
};
//# sourceMappingURL=primevue_blockui.js.map
