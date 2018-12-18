"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const rpc_1 = require("../rpc");
/**
 * Pack operation parameters
 */
exports.packOperationParameters = () => (source) => source.pipe(operators_1.tap(state => console.log('[+] packOperationParameters', state)), 
// get packed transaction parameters  
packOperationParametersAtomic(), operators_1.tap(state => console.log('[+] packOperationParameters', state.packOperationParameters)));
const packOperationParametersAtomic = () => (source) => source.pipe(rpc_1.rpc((state) => {
    const lastOperation = state.operations[state.operations.length - 1];
    return {
        url: '/chains/main/blocks/head/helpers/scripts/pack_data',
        path: 'packOperationParameters',
        payload: {
            data: lastOperation.parameters || {},
            type: {}
        }
    };
}));
