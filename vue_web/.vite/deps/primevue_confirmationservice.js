import {
  ConfirmationEventBus
} from "./chunk-QZWYLW2O.js";
import "./chunk-32WPC2CU.js";
import "./chunk-XSWAMETM.js";
import "./chunk-E3EO7R6B.js";

// node_modules/primevue/useconfirm/useconfirm.esm.js
var PrimeVueConfirmSymbol = Symbol();

// node_modules/primevue/confirmationservice/confirmationservice.esm.js
var ConfirmationService = {
  install: function install(app) {
    var ConfirmationService2 = {
      require: function require2(options) {
        ConfirmationEventBus.emit("confirm", options);
      },
      close: function close() {
        ConfirmationEventBus.emit("close");
      }
    };
    app.config.globalProperties.$confirm = ConfirmationService2;
    app.provide(PrimeVueConfirmSymbol, ConfirmationService2);
  }
};
export {
  ConfirmationService as default
};
//# sourceMappingURL=primevue_confirmationservice.js.map
