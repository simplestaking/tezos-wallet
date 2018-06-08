"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var ajax_1 = require("rxjs/ajax");
var config = {
    api: 'https://node.simplestaking.com:3000',
    header: { 'Content-Type': 'application/json' }
};
exports.rpc = function (url, payload) {
    return ajax_1.ajax.post(config.api + url, payload, config.header).pipe(
    // if do not have response do not run it
    operators_1.filter(function (event) { return event.response; }), 
    // use only response
    operators_1.map(function (event) { return event.response; }));
};
//# sourceMappingURL=rpc.js.map