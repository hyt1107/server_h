import {
  script as script3
} from "./chunk-L3ZHCCJB.js";
import {
  script as script2
} from "./chunk-QRW3WE6P.js";
import "./chunk-CBNUHWKK.js";
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
  createVNode,
  mergeProps,
  normalizeClass,
  openBlock,
  renderSlot,
  resolveComponent,
  toDisplayString
} from "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/tristatecheckbox/style/tristatecheckboxstyle.esm.js
var classes = {
  root: function root(_ref) {
    var instance = _ref.instance, props = _ref.props;
    return ["p-tristatecheckbox p-checkbox p-component", {
      "p-highlight": instance.active,
      "p-disabled": props.disabled,
      "p-invalid": props.invalid,
      "p-variant-filled": props.variant === "filled" || instance.$primevue.config.inputStyle === "filled"
    }];
  },
  box: "p-checkbox-box",
  input: "p-checkbox-input",
  checkIcon: "p-checkbox-icon",
  uncheckIcon: "p-checkbox-icon",
  nullableIcon: "p-checkbox-icon"
};
var TriStateCheckboxStyle = BaseStyle.extend({
  name: "tristatecheckbox",
  classes
});

// node_modules/primevue/tristatecheckbox/tristatecheckbox.esm.js
var script$1 = {
  name: "BaseTriStateCheckbox",
  "extends": script,
  props: {
    modelValue: null,
    variant: {
      type: String,
      "default": null
    },
    invalid: {
      type: Boolean,
      "default": false
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    readonly: {
      type: Boolean,
      "default": false
    },
    tabindex: {
      type: Number,
      "default": null
    },
    inputId: {
      type: String,
      "default": null
    },
    inputClass: {
      type: [String, Object],
      "default": null
    },
    inputStyle: {
      type: Object,
      "default": null
    },
    ariaLabelledby: {
      type: String,
      "default": null
    },
    ariaLabel: {
      type: String,
      "default": null
    }
  },
  style: TriStateCheckboxStyle,
  provide: function provide() {
    return {
      $parentInstance: this
    };
  }
};
var script4 = {
  name: "TriStateCheckbox",
  "extends": script$1,
  inheritAttrs: false,
  emits: ["update:modelValue", "change", "focus", "blur"],
  methods: {
    getPTOptions: function getPTOptions(key) {
      var _ptm = key === "root" ? this.ptmi : this.ptm;
      return _ptm(key, {
        context: {
          active: this.active,
          disabled: this.disabled
        }
      });
    },
    updateModel: function updateModel() {
      var newValue;
      switch (this.modelValue) {
        case true:
          newValue = false;
          break;
        case false:
          newValue = null;
          break;
        default:
          newValue = true;
          break;
      }
      this.$emit("update:modelValue", newValue);
    },
    onChange: function onChange(event) {
      if (!this.disabled && !this.readonly) {
        this.updateModel();
        this.$emit("change", event);
      }
    },
    onFocus: function onFocus(event) {
      this.$emit("focus", event);
    },
    onBlur: function onBlur(event) {
      this.$emit("blur", event);
    }
  },
  computed: {
    active: function active() {
      return this.modelValue != null;
    },
    checked: function checked() {
      return this.modelValue === true;
    },
    ariaValueLabel: function ariaValueLabel() {
      return this.modelValue ? this.$primevue.config.locale.aria.trueLabel : this.modelValue === false ? this.$primevue.config.locale.aria.falseLabel : this.$primevue.config.locale.aria.nullLabel;
    }
  },
  components: {
    CheckIcon: script2,
    TimesIcon: script3
  }
};
var _hoisted_1 = ["data-p-highlight", "data-p-disabled"];
var _hoisted_2 = ["id", "value", "checked", "tabindex", "disabled", "readonly", "aria-labelledby", "aria-label", "aria-invalid"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CheckIcon = resolveComponent("CheckIcon");
  var _component_TimesIcon = resolveComponent("TimesIcon");
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root")
  }, $options.getPTOptions("root"), {
    "data-p-highlight": $options.active,
    "data-p-disabled": _ctx.disabled
  }), [createBaseVNode("input", mergeProps({
    id: _ctx.inputId,
    type: "checkbox",
    "class": [_ctx.cx("input"), _ctx.inputClass],
    style: _ctx.inputStyle,
    value: _ctx.modelValue,
    checked: $options.checked,
    tabindex: _ctx.tabindex,
    disabled: _ctx.disabled,
    readonly: _ctx.readonly,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    "aria-invalid": _ctx.invalid || void 0,
    onFocus: _cache[0] || (_cache[0] = function() {
      return $options.onFocus && $options.onFocus.apply($options, arguments);
    }),
    onBlur: _cache[1] || (_cache[1] = function() {
      return $options.onBlur && $options.onBlur.apply($options, arguments);
    }),
    onChange: _cache[2] || (_cache[2] = function() {
      return $options.onChange && $options.onChange.apply($options, arguments);
    })
  }, $options.getPTOptions("input")), null, 16, _hoisted_2), createBaseVNode("span", mergeProps({
    role: "status",
    "class": "p-hidden-accessible",
    "aria-live": "polite"
  }, $options.getPTOptions("hiddenValueLabel"), {
    "data-p-hidden-accessible": true
  }), toDisplayString($options.ariaValueLabel), 17), createBaseVNode("div", mergeProps({
    "class": _ctx.cx("box")
  }, $options.getPTOptions("box")), [_ctx.modelValue === true ? renderSlot(_ctx.$slots, "checkicon", {
    key: 0,
    "class": normalizeClass(_ctx.cx("checkIcon"))
  }, function() {
    return [createVNode(_component_CheckIcon, mergeProps({
      "class": _ctx.cx("checkIcon")
    }, $options.getPTOptions("checkIcon")), null, 16, ["class"])];
  }) : _ctx.modelValue === false ? renderSlot(_ctx.$slots, "uncheckicon", {
    key: 1,
    "class": normalizeClass(_ctx.cx("uncheckIcon"))
  }, function() {
    return [createVNode(_component_TimesIcon, mergeProps({
      "class": _ctx.cx("uncheckIcon")
    }, $options.getPTOptions("uncheckIcon")), null, 16, ["class"])];
  }) : renderSlot(_ctx.$slots, "nullableicon", {
    key: 2,
    "class": normalizeClass(_ctx.cx("nullableIcon"))
  })], 16)], 16, _hoisted_1);
}
script4.render = render;
export {
  script4 as default
};
//# sourceMappingURL=primevue_tristatecheckbox.js.map
