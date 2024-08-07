import {
  script
} from "./chunk-3D7XU76W.js";
import {
  BaseStyle
} from "./chunk-HPFN3SJC.js";
import {
  primebus
} from "./chunk-32WPC2CU.js";
import {
  Fragment,
  createBaseVNode,
  createCommentVNode,
  createElementBlock,
  mergeProps,
  normalizeProps,
  openBlock,
  renderList,
  toDisplayString,
  vModelText,
  withDirectives
} from "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/terminalservice/terminalservice.esm.js
var TerminalService = primebus();

// node_modules/primevue/terminal/style/terminalstyle.esm.js
var classes = {
  root: "p-terminal p-component",
  content: "p-terminal-content",
  prompt: "p-terminal-prompt",
  command: "p-terminal-command",
  response: "p-terminal-response",
  container: "p-terminal-prompt-container",
  commandText: "p-terminal-input"
};
var TerminalStyle = BaseStyle.extend({
  name: "terminal",
  classes
});

// node_modules/primevue/terminal/terminal.esm.js
var script$1 = {
  name: "BaseTerminal",
  "extends": script,
  props: {
    welcomeMessage: {
      type: String,
      "default": null
    },
    prompt: {
      type: String,
      "default": null
    }
  },
  style: TerminalStyle,
  provide: function provide() {
    return {
      $parentInstance: this
    };
  }
};
var script2 = {
  name: "Terminal",
  "extends": script$1,
  inheritAttrs: false,
  data: function data() {
    return {
      commandText: null,
      commands: []
    };
  },
  mounted: function mounted() {
    TerminalService.on("response", this.responseListener);
    this.$refs.input.focus();
  },
  updated: function updated() {
    this.$el.scrollTop = this.$el.scrollHeight;
  },
  beforeUnmount: function beforeUnmount() {
    TerminalService.off("response", this.responseListener);
  },
  methods: {
    onClick: function onClick() {
      this.$refs.input.focus();
    },
    onKeydown: function onKeydown(event) {
      if ((event.code === "Enter" || event.code === "NumpadEnter") && this.commandText) {
        this.commands.push({
          text: this.commandText
        });
        TerminalService.emit("command", this.commandText);
        this.commandText = "";
      }
    },
    responseListener: function responseListener(response) {
      this.commands[this.commands.length - 1].response = response;
    }
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root"),
    onClick: _cache[2] || (_cache[2] = function() {
      return $options.onClick && $options.onClick.apply($options, arguments);
    })
  }, _ctx.ptmi("root")), [_ctx.welcomeMessage ? (openBlock(), createElementBlock("div", normalizeProps(mergeProps({
    key: 0
  }, _ctx.ptm("welcomeMessage"))), toDisplayString(_ctx.welcomeMessage), 17)) : createCommentVNode("", true), createBaseVNode("div", mergeProps({
    "class": _ctx.cx("content")
  }, _ctx.ptm("content")), [(openBlock(true), createElementBlock(Fragment, null, renderList($data.commands, function(command, i) {
    return openBlock(), createElementBlock("div", mergeProps({
      key: command.text + i.toString()
    }, _ctx.ptm("commands")), [createBaseVNode("span", mergeProps({
      "class": _ctx.cx("prompt")
    }, _ctx.ptm("prompt")), toDisplayString(_ctx.prompt), 17), createBaseVNode("span", mergeProps({
      "class": _ctx.cx("command")
    }, _ctx.ptm("command")), toDisplayString(command.text), 17), createBaseVNode("div", mergeProps({
      "class": _ctx.cx("response"),
      "aria-live": "polite"
    }, _ctx.ptm("response")), toDisplayString(command.response), 17)], 16);
  }), 128))], 16), createBaseVNode("div", mergeProps({
    "class": _ctx.cx("container")
  }, _ctx.ptm("container")), [createBaseVNode("span", mergeProps({
    "class": _ctx.cx("prompt")
  }, _ctx.ptm("prompt")), toDisplayString(_ctx.prompt), 17), withDirectives(createBaseVNode("input", mergeProps({
    ref: "input",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function($event) {
      return $data.commandText = $event;
    }),
    type: "text",
    "class": _ctx.cx("commandText"),
    autocomplete: "off",
    onKeydown: _cache[1] || (_cache[1] = function() {
      return $options.onKeydown && $options.onKeydown.apply($options, arguments);
    })
  }, _ctx.ptm("commandText")), null, 16), [[vModelText, $data.commandText]])], 16)], 16);
}
script2.render = render;
export {
  script2 as default
};
//# sourceMappingURL=primevue_terminal.js.map
