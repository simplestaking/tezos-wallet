"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../helpers");
const rpc_1 = require("../rpc");
const preapplyOperations = () => (source) => source.pipe(rpc_1.rpc((state) => ({
    url: '/chains/main/blocks/head/helpers/preapply/operations',
    path: 'preapply',
    payload: [{
            protocol: state.head.protocol,
            branch: state.head.hash,
            contents: state.operations,
            signature: state.signOperation.signature
        }]
})));
const injectOperations = () => (source) => source.pipe(rpc_1.rpc((state) => ({
    url: '/injection/operation',
    path: 'injectionOperation',
    payload: `"${state.signOperation.signedOperationContents}"`
})));
/**
 * Apply and inject operation into node
 */
exports.applyAndInjectOperation = () => (source) => source.pipe(
//get counter
helpers_1.counter(), 
// preapply operation
preapplyOperations(), operators_1.tap((state) => console.log("[+] operation: preapply ", state.preapply[0].contents[0].metadata.operation_result)), 
// check for errors
operators_1.flatMap(state => {
    const result = state.preapply[0].contents[0].metadata;
    // @@TODO: no such a field as operation_result
    return result.operation_result && result.operation_result.status === "failed" ?
        rxjs_1.throwError({ response: result.operation_result.errors }) :
        rxjs_1.of(state);
}), 
// inject operation
injectOperations(), operators_1.tap((state) => console.log("[+] operation: " + state.wallet.node.tzscan.url + state.injectionOperation)));
//# sourceMappingURL=applyInject.js.map