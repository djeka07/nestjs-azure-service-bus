"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscribe = void 0;
const constants_1 = require("../constants");
function Subscribe(receiver) {
    const service = constants_1.EventSubscriberService;
    return function (target, propertyKey, descriptor) {
        const TargetCtor = target.constructor;
        const instance = new TargetCtor();
        const handler = descriptor.value.bind(instance);
        service.subscribe(receiver, handler);
        return instance;
    };
}
exports.Subscribe = Subscribe;
//# sourceMappingURL=subscribe.decorator.js.map