import {
  script as script2
} from "./chunk-JCFPAG2O.js";
import "./chunk-CBNUHWKK.js";
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
  Transition,
  createBlock,
  createCommentVNode,
  createElementBlock,
  mergeProps,
  normalizeClass,
  openBlock,
  renderSlot,
  resolveDynamicComponent,
  withCtx
} from "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/scrolltop/style/scrolltopstyle.esm.js
var classes = {
  root: function root(_ref) {
    var props = _ref.props;
    return ["p-scrolltop p-link p-component", {
      "p-scrolltop-sticky": props.target !== "window"
    }];
  },
  icon: "p-scrolltop-icon"
};
var ScrollTopStyle = BaseStyle.extend({
  name: "scrolltop",
  classes
});

// node_modules/primevue/scrolltop/scrolltop.esm.js
var script$1 = {
  name: "BaseScrollTop",
  "extends": script,
  props: {
    target: {
      type: String,
      "default": "window"
    },
    threshold: {
      type: Number,
      "default": 400
    },
    icon: {
      type: String,
      "default": void 0
    },
    behavior: {
      type: String,
      "default": "smooth"
    }
  },
  style: ScrollTopStyle,
  provide: function provide() {
    return {
      $parentInstance: this
    };
  }
};
var script3 = {
  name: "ScrollTop",
  "extends": script$1,
  inheritAttrs: false,
  scrollListener: null,
  container: null,
  data: function data() {
    return {
      visible: false
    };
  },
  mounted: function mounted() {
    if (this.target === "window")
      this.bindDocumentScrollListener();
    else if (this.target === "parent")
      this.bindParentScrollListener();
  },
  beforeUnmount: function beforeUnmount() {
    if (this.target === "window")
      this.unbindDocumentScrollListener();
    else if (this.target === "parent")
      this.unbindParentScrollListener();
    if (this.container) {
      ZIndexUtils.clear(this.container);
      this.overlay = null;
    }
  },
  methods: {
    onClick: function onClick() {
      var scrollElement = this.target === "window" ? window : this.$el.parentElement;
      scrollElement.scroll({
        top: 0,
        behavior: this.behavior
      });
    },
    checkVisibility: function checkVisibility(scrollY) {
      if (scrollY > this.threshold)
        this.visible = true;
      else
        this.visible = false;
    },
    bindParentScrollListener: function bindParentScrollListener() {
      var _this = this;
      this.scrollListener = function() {
        _this.checkVisibility(_this.$el.parentElement.scrollTop);
      };
      this.$el.parentElement.addEventListener("scroll", this.scrollListener);
    },
    bindDocumentScrollListener: function bindDocumentScrollListener() {
      var _this2 = this;
      this.scrollListener = function() {
        _this2.checkVisibility(DomHandler.getWindowScrollTop());
      };
      window.addEventListener("scroll", this.scrollListener);
    },
    unbindParentScrollListener: function unbindParentScrollListener() {
      if (this.scrollListener) {
        this.$el.parentElement.removeEventListener("scroll", this.scrollListener);
        this.scrollListener = null;
      }
    },
    unbindDocumentScrollListener: function unbindDocumentScrollListener() {
      if (this.scrollListener) {
        window.removeEventListener("scroll", this.scrollListener);
        this.scrollListener = null;
      }
    },
    onEnter: function onEnter(el) {
      ZIndexUtils.set("overlay", el, this.$primevue.config.zIndex.overlay);
    },
    onAfterLeave: function onAfterLeave(el) {
      ZIndexUtils.clear(el);
    },
    containerRef: function containerRef(el) {
      this.container = el;
    }
  },
  computed: {
    scrollTopAriaLabel: function scrollTopAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.scrollTop : void 0;
    }
  },
  components: {
    ChevronUpIcon: script2
  }
};
var _hoisted_1 = ["aria-label"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, mergeProps({
    name: "p-scrolltop",
    appear: "",
    onEnter: $options.onEnter,
    onAfterLeave: $options.onAfterLeave
  }, _ctx.ptm("transition")), {
    "default": withCtx(function() {
      return [$data.visible ? (openBlock(), createElementBlock("button", mergeProps({
        key: 0,
        ref: $options.containerRef,
        "class": _ctx.cx("root"),
        onClick: _cache[0] || (_cache[0] = function() {
          return $options.onClick && $options.onClick.apply($options, arguments);
        }),
        type: "button",
        "aria-label": $options.scrollTopAriaLabel
      }, _ctx.ptmi("root")), [renderSlot(_ctx.$slots, "icon", {
        "class": normalizeClass(_ctx.cx("icon"))
      }, function() {
        return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.icon ? "span" : "ChevronUpIcon"), mergeProps({
          "class": [_ctx.cx("icon"), _ctx.icon]
        }, _ctx.ptm("icon")), null, 16, ["class"]))];
      })], 16, _hoisted_1)) : createCommentVNode("", true)];
    }),
    _: 3
  }, 16, ["onEnter", "onAfterLeave"]);
}
script3.render = render;
export {
  script3 as default
};
//# sourceMappingURL=primevue_scrolltop.js.map
