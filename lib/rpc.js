"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var ajax_1 = require("rxjs/ajax");
exports.config = function () {
    return {
        api: 'https://zeronet.simplestaking.com:3000',
        //api: 'https://node2.simplestaking.com:3000',
        header: { 'Content-Type': 'application/json' }
    };
};
exports.rpc = function (url, payload) {
    return payload !== undefined ?
        ajax_1.ajax.post(exports.config().api + url, payload, exports.config().header).pipe(
        // if do not have response do not run it
        operators_1.filter(function (event) { return event.response; }), 
        // use only response
        operators_1.map(function (event) { return event.response; }))
        :
            ajax_1.ajax.get(exports.config().api + url, exports.config().header).pipe(
            // if do not have response do not run it
            operators_1.filter(function (event) { return event.response; }), 
            // use only response
            operators_1.map(function (event) { return event.response; }));
};
//# sourceMappingURL=rpc.js.map