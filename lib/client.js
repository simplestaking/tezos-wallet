"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rpc_1 = require("./rpc");
var libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
var utils = __importStar(require("./utils"));
/**
 * Originate new delegateble contract from wallet
 */
exports.origination = function () { return function (source) { return source.pipe(
// prepare config for operation
operators_1.map(function (state) { return (__assign({}, state, { "operations": [{
            "kind": "reveal",
            "public_key": state.publicKey,
        }, {
            "kind": "origination",
            "balance": utils.amount(state.amount),
            "managerPubkey": state.publicKeyHash,
            "spendable": true,
            "delegatable": true,
            "delegate": state.delegate,
        }] })); }), operators_1.tap(function (state) { return console.log('[+] origination:  ', state); }), 
// create operation 
exports.operation(), operators_1.tap(function (state) { return console.log('[+] origination: http://tzscan.io/' + state.contracts[0]); })); }; };
/**
 *  Transfer token's from one wallet to another
 */
exports.transfer = function (fn) { return function (source) { return source.pipe(
// 
operators_1.map(function (state) { return fn(state); }), 
// display transaction info to console
operators_1.tap(function (state) {
    return console.log('[+] transfer: ' + state.amount + ' ꜩ ' + 'from "' + state.publicKeyHash + '" to "' + state.to + '"');
}), 
// prepare config for operation
operators_1.map(function (state) { return (__assign({}, state, { "operations": [{
            "kind": "reveal",
            "public_key": state.publicKey,
        }, {
            "kind": "transaction",
            "amount": utils.amount(state.amount),
            "destination": state.to,
        }] })); }), 
// create operation 
exports.operation()); }; };
/**
 *  Set delegation rights to tezos address
 */
exports.delegation = function () { return function (source) { return source.pipe(
// get wallet balance, only wallet with balance > 0 can create delegatable contract 
// getWalletInfo(state => ({
//   publicKeyHash: state.publicKeyHash,
// })),
// prepare config for operation
operators_1.map(function (state) { return (__assign({}, state, { "operations": [{
            "kind": "reveal",
            "public_key": state.publicKey,
        }, {
            "kind": "delegation",
            "delegate": state.delegate,
        }] })); }), 
// create operation 
exports.operation()); }; };
/**
 * Create operation in blocchain
 */
exports.operation = function () { return function (source) { return source.pipe(
// get head and counter
exports.head(), 
// create operation
operators_1.flatMap(function (state) {
    return rpc_1.rpc('/blocks/head/proto/helpers/forge/operations', {
        "branch": state.head.hash,
        "kind": "manager",
        "source": state.publicKeyHash,
        "fee": 0,
        "counter": state.counter + 1,
        "operations": state.operations,
    }).pipe(
    // add operation to state 
    operators_1.map(function (response) { return (__assign({}, state, { operation: response.operation })); }));
}), 
// add signature to state 
// TODO: move and just keep signOperation and create logic inside utils  
operators_1.flatMap(function (state) { return state.walletType === 'TREZOR_T' ? utils.signOperationTrezor(state) : [utils.signOperation(state)]; }), 
// get new head and counter
exports.head(), 
// apply & inject operation
exports.applyAndInjectOperation(), 
// wait until operation is confirmed & moved from mempool to head
exports.confirmOperation()); }; };
/**
 * Get head for operation
 */
exports.head = function () { return function (source) { return source.pipe(
// get head
operators_1.flatMap(function (state) {
    return rpc_1.rpc('/blocks/head', {}).pipe(
    // add head to state 
    operators_1.map(function (response) { return (__assign({}, state, { head: response })); }));
}), 
// get counter for contract
operators_1.flatMap(function (state) {
    return rpc_1.rpc('/blocks/head/proto/context/contracts/' + state.publicKeyHash + '/counter', {}).pipe(
    // add counter to state 
    operators_1.map(function (response) { return (__assign({}, state, { counter: response.counter })); }));
})); }; };
/**
 * Apply and inject operation into node
 */
exports.applyAndInjectOperation = function () { return function (source) { return source.pipe(
// apply operation
operators_1.flatMap(function (state) {
    return rpc_1.rpc('/blocks/head/proto/helpers/apply_operation', {
        "pred_block": state.head.predecessor,
        "operation_hash": state.operationHash,
        "forged_operation": state.operation,
        "signature": state.signature
    }).pipe(operators_1.catchError(function (error) { console.log('[-] [catchError]', error); return rxjs_1.of(''); }), operators_1.tap(function (response) { return console.log("[+] operation: apply ", response); }), 
    // add operation confirmation 
    operators_1.map(function (response) { return (__assign({}, state, response)); }));
}), 
// inject operation
operators_1.flatMap(function (state) {
    return rpc_1.rpc('/inject_operation', {
        "signedOperationContents": state.signedOperationContents,
    }).pipe(operators_1.tap(function (response) { return console.log("[+] operation: inject ", response); }), operators_1.map(function (response) { return (__assign({}, state, response)); }), operators_1.tap(function (state) { return console.log("[+] operation: http://tzscan.io/" + state.injectedOperation); }));
})); }; };
/**
 * Wait until operation is confirmed & moved from mempool to head
 */
exports.confirmOperation = function () { return function (source) { return source.pipe(operators_1.tap(function (state) { return console.log('[-] pending: operation "' + state.injectedOperation + '"'); }), 
// wait 5 sec for operation 
operators_1.delay(10000), 
// call node and look for operation in mempool
operators_1.flatMap(function (state) {
    // send request to node 
    return rpc_1.rpc('/mempool/pending_operations ', {}).pipe(
    // if we find operation in mempool call confirmOperation() again
    operators_1.flatMap(function (response) {
        return response.applied
            .filter(function (operation) { return state.injectedOperation === operation.hash; })
            .length > 0 ? rxjs_1.of(state).pipe(exports.confirmOperation()) : source;
    }));
})); }; };
/**
 * Get wallet details
 */
// export const getWalletDetail = (fn?: (params: Wallet) => PublicAddress) => (source: Observable<Wallet>): Observable<Contract> =>
exports.getWallet = function (fn) { return function (source) {
    return source.pipe(
    // exec calback function only if is defined
    operators_1.map(function (state) { return fn ? fn(state) : state; }), 
    // get contract info balance 
    operators_1.flatMap(function (state) {
        return rpc_1.rpc('/blocks/head/proto/context/contracts/' + state.publicKeyHash + '/', {}).pipe(
        // add contract info to state 
        operators_1.map(function (response) { return (__assign({}, state, response)); }), 
        // show account and balance 
        operators_1.tap(function (state) {
            console.log('[+] wallet: "' + state.publicKeyHash + '"');
            console.log('[+] balance: ', state.balance / 1000000 + ' ꜩ');
        }));
    }));
}; };
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
exports.newWallet = function () { return function (source) { return source.pipe(
// // wait for sodium to initialize
// initialize(),
// create keys
operators_1.map(function (state) { return utils.keys(); }), operators_1.tap(function (state) {
    console.log('[+] mnemonic: "' + state.mnemonic + '"');
    console.log('[+] publicKey: "' + state.publicKey + '"');
    console.log('[+] publicKeyHash: "' + state.publicKeyHash + '"');
    console.log('[+] secretKey: "' + state.secretKey + '"');
})); }; };
/**
 * Wait for sodium to initialize
 */
exports.initialize = function () { return function (source) { return source.pipe(
// wait for sodium to initialize
operators_1.flatMap(function (state) { return libsodium_wrappers_1.default.ready; }), 
// combine resolved promise with state observable
operators_1.withLatestFrom(source), 
// use only state
operators_1.map(function (_a) {
    var resolved = _a[0], state = _a[1];
    return state;
})); }; };
//# sourceMappingURL=client.js.map