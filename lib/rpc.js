"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ajax_1 = require("rxjs/ajax");
exports.rpc = (selector) => (source) => source.pipe(
//exec calback function
operators_1.map(state => (Object.assign({}, state, { rpc: selector(state) }))), 
// tap(state => console.log('[rpc] state ', state)),
// tap(state => console.log('[rpc][url] : ', state.rpc.url)),
// tap(state => console.log('[rpc][path] : ', state.rpc.path)),
// tap(state => console.log('[rpc][payload] : ', state.rpc.payload)),
operators_1.flatMap(state => {
    return state.rpc.payload !== undefined ?
        // post 
        ajax_1.ajax.post(state.wallet.node.url + state.rpc.url, state.rpc.payload, { 'Content-Type': 'application/json' }).pipe(
        // without response do not run it
        operators_1.filter(event => event.response), 
        // use only response
        operators_1.map(event => (Object.assign({}, state, { [state.rpc.path]: event.response }))), 
        // catchError
        operators_1.catchError(error => {
            console.warn('[-] [rpc][ajax.post][request] url: ', error.request.url);
            console.warn('[-] [rpc][ajax.post][request] body: ', error.request.body);
            console.warn('[-] [rpc][ajax.post][response] error: ', error.status, error.response);
            return rxjs_1.throwError(Object.assign({}, error, { state }));
        }))
        :
            // get 
            ajax_1.ajax.get(state.wallet.node.url + state.rpc.url, { 'Content-Type': 'application/json' }).pipe(
            // without response do not run it
            operators_1.filter(event => event.response), 
            // use only response
            operators_1.map(event => (Object.assign({}, state, { [state.rpc.path]: event.response }))), 
            // catchError
            operators_1.catchError(error => {
                console.warn('[-] [rpc][ajax.get][request] url: ', error.request.url);
                console.warn('[-] [rpc][ajax.get][response] error: ', error.status, error.response);
                return rxjs_1.throwError(Object.assign({}, error, { state }));
            }));
})
// tap(state => console.log('[rpc][response] : ', state))
);
