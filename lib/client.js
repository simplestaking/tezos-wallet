"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const sodium = __importStar(require("libsodium-wrappers"));
const utils = __importStar(require("./utils"));
const rpc_1 = require("./rpc");
const enums_1 = require("./src/enums");
/**
 *  Transaction XTZ from one wallet to another
 */
exports.transaction = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { transaction: selector(state) }))), 
// get contract counter
exports.counter(), 
// get contract managerKey
exports.managerKey(), 
// display transaction info to console
operators_1.tap(state => {
    console.log('[+] transaction: ' + state.transaction.amount + ' ꜩ  fee:' + state.transaction.fee + ' ' + 'from "' + state.wallet.publicKeyHash + '" to "' + state.transaction.to + '"');
}), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            kind: "reveal",
            public_key: state.wallet.publicKey,
            source: state.wallet.publicKeyHash,
            fee: "10000",
            gas_limit: "15000",
            storage_limit: "277",
            counter: (++state.counter).toString()
        });
    }
    operations.push({
        kind: "transaction",
        source: state.wallet.publicKeyHash,
        destination: state.transaction.to,
        amount: utils.parseAmount(state.transaction.amount).toString(),
        fee: utils.parseAmount(state.transaction.fee).toString(),
        gas_limit: "11000",
        storage_limit: "277",
        parameters: state.transaction.parameters,
        counter: (++state.counter).toString()
    });
    return Object.assign({}, state, { operations: operations });
}), 
// tap((state: any) => console.log("[+] trasaction: operation " , state.operations)),
// create operation 
exports.operation());
/**
 *  Set delegation rights to tezos address
 */
exports.setDelegation = (fn) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { 'setDelegate': fn(state) }))), 
// get contract counter
exports.counter(), 
// get contract managerKey
exports.managerKey(), 
// display transaction info to console
operators_1.tap(state => {
    console.log('[+] setDelegate: from "' + state.wallet.publicKeyHash + '" to "' + state.setDelegate.to + '"');
}), operators_1.tap(state => {
    console.log('[+] wallet: from "' + state.wallet);
}), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            "kind": "reveal",
            "public_key": state.wallet.publicKey,
            "source": state.wallet.publicKeyHash,
            "fee": utils.parseAmount(state.setDelegate.fee).toString(),
            "gas_limit": "10100",
            "storage_limit": "277",
            "counter": (++state.counter).toString(),
        });
    }
    operations.push({
        "kind": "delegation",
        "source": state.wallet.publicKeyHash,
        "fee": utils.parseAmount(state.setDelegate.fee).toString(),
        "gas_limit": "10100",
        "storage_limit": "277",
        "counter": (++state.counter).toString(),
        "delegate": !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
    });
    return Object.assign({}, state, { "operations": operations });
}), 
// create operation 
exports.operation());
/**
 * Originate new delegatable contract from wallet
 */
exports.originateContract = (fn) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { 'originateContract': fn(state) }))), 
// display transaction info to console
operators_1.tap(state => {
    console.log('[+] originate : from "' + state.wallet.publicKeyHash);
}), 
// get contract counter
exports.counter(), 
// get contract managerKey
exports.managerKey(), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            "kind": "reveal",
            "public_key": state.wallet.publicKey,
            "source": state.wallet.publicKeyHash,
            "fee": utils.parseAmount(state.originateContract.fee).toString(),
            "gas_limit": "10100",
            "storage_limit": "277",
            "counter": (++state.counter).toString(),
        });
    }
    operations.push({
        "kind": "origination",
        "source": state.wallet.publicKeyHash,
        "fee": utils.parseAmount(state.originateContract.fee).toString(),
        "balance": utils.parseAmount(state.originateContract.amount).toString(),
        "gas_limit": "10100",
        "storage_limit": "277",
        "counter": (++state.counter).toString(),
        "spendable": true,
        "delegatable": true,
        "delegate": state.originateContract.to,
    });
    // add manager_pubkey according to network
    if (state.wallet.node.name === "main") {
        operations[operations.length - 1] = Object.assign({}, operations[operations.length - 1], { "managerPubkey": state.manager_key.manager });
    }
    else {
        operations[operations.length - 1] = Object.assign({}, operations[operations.length - 1], { "manager_pubkey": state.manager_key.manager });
    }
    return Object.assign({}, state, { "operations": operations });
}), 
// create operation 
exports.operation());
/**
  * Activate wallet
  */
exports.activateWallet = (fn) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { activateWallet: fn(state) }))), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    operations.push({
        kind: "activate_account",
        pkh: state.wallet.publicKeyHash,
        secret: state.activateWallet.secret
    });
    return Object.assign({}, state, { operations: operations });
}), 
// create operation 
exports.operation());
/**
 * Create operation in blocchain
 */
exports.operation = () => (source) => source.pipe(
// create operation
exports.forgeOperation(), 
// apply & inject operation
exports.applyAndInjectOperation());
/**
 * Get head for operation
 */
exports.head = () => (source) => source.pipe(
// get head
rpc_1.rpc((state) => ({
    url: '/chains/main/blocks/head',
    path: 'head',
})));
/**
 * Get counter for contract
 */
exports.counter = () => (source) => source.pipe(
// get counter for contract
rpc_1.rpc((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/counter',
    path: 'counter',
})));
/**
* Get manager key for contract
*/
exports.managerKey = () => (source) => source.pipe(
// get manager key for contract 
rpc_1.rpc((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/manager_key',
    path: 'manager_key' // @TODO: should not be 'manager' ??
})));
/**
 * Forge operation in blocchain
 */
exports.forgeOperation = () => (source) => source.pipe(
// get head and counter
exports.head(), 
// @TODO: do we need special counter here?
// get contract counter
exports.counter(), 
// get contract managerKey
exports.managerKey(), exports.forgeOperationAtomic(), 
// add signature to state 
// 
// TODO: move and just keep signOperation and create logic inside utils 
// tap(state => console.log('[operation]', state.walletType, state)),
operators_1.flatMap(state => {
    if (state.wallet.type === enums_1.WalletType.TREZOR_T) {
        return utils.signOperationTrezor(state);
    }
    else {
        return utils.signOperation(state);
    }
}));
exports.forgeOperationAtomic = () => (source) => source.pipe(
// create operation
rpc_1.rpc(state => ({
    url: '/chains/' + state.head.chain_id + '/blocks/' + state.head.hash + '/helpers/forge/operations',
    path: 'operation',
    payload: {
        branch: state.head.hash,
        contents: state.operations
    }
})));
exports.preapplyOperations = () => (source) => source.pipe(rpc_1.rpc((state) => ({
    url: '/chains/main/blocks/head/helpers/preapply/operations',
    path: 'preapply',
    payload: [{
            protocol: state.head.protocol,
            branch: state.head.hash,
            contents: state.operations,
            signature: state.signOperation.signature
        }]
})));
exports.injectOperations = () => (source) => source.pipe(rpc_1.rpc((state) => ({
    url: '/injection/operation',
    path: 'injectionOperation',
    payload: `"${state.signOperation.signedOperationContents}"`
})));
/**
 * Apply and inject operation into node
 */
exports.applyAndInjectOperation = () => (source) => source.pipe(
//get counter
exports.counter(), 
// preapply operation
exports.preapplyOperations(), operators_1.tap((state) => console.log("[+] operation: preapply ", state.preapply[0].contents[0].metadata.operation_result)), 
// check for errors
operators_1.flatMap(state => {
    const result = state.preapply[0].contents[0].metadata;
    // @@TODO: no such a field as operation_result
    return result.operation_result && result.operation_result.status === "failed" ?
        rxjs_1.throwError({ response: result.operation_result.errors }) :
        rxjs_1.of(state);
}), 
// inject operation
exports.injectOperations(), operators_1.tap((state) => console.log("[+] operation: " + state.wallet.node.tzscan.url + state.injectionOperation)));
exports.checkPendingOperations = () => (source) => source.pipe(rpc_1.rpc(() => ({
    url: '/chains/main/mempool/pending_operations',
    path: 'mempool'
})));
/**
 * Wait until operation is confirmed & moved from mempool to head
 */
exports.confirmOperation = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { 
    // why?? confirmOperation is never created other way
    //confirmOperation: (fn && typeof fn === 'function') ? fn(state) : state.confirmOperation
    confirmOperation: selector(state) }))), operators_1.tap((state) => console.log('[-] pending: operation "' + state.confirmOperation.injectionOperation + '"')), 
// wait 3 sec for operation 
operators_1.delay(3000), 
// call node and look for operation in mempool
exports.checkPendingOperations(), 
// if we find operation in mempool call confirmOperation() again
operators_1.flatMap((state) => {
    // check if operation is refused
    if (state.mempool.refused.filter(hasRefusedOperationInMempool, state).length > 0) {
        console.error('[-] operation refused: ', state.mempool.refused, state.confirmOperation.injectionOperation);
        return rxjs_1.throwError(state.mempool.refused);
    }
    else {
        return state.mempool.applied.filter(hasAppliedOperationInMempool, state).length > 0 ?
            rxjs_1.of(state).pipe(exports.confirmOperation(selector)) :
            source;
    }
}));
function hasRefusedOperationInMempool(operation) {
    return this.confirmOperation.injectionOperation === operation.hash;
}
exports.hasRefusedOperationInMempool = hasRefusedOperationInMempool;
;
function hasAppliedOperationInMempool(operation) {
    return this.confirmOperation.injectionOperation === operation.hash;
}
exports.hasAppliedOperationInMempool = hasAppliedOperationInMempool;
/**
 * Pack operation parameters
 */
exports.packOperationParameters = () => (source) => source.pipe(operators_1.tap(state => console.log('[+] packOperationParameters', state)), 
// get packed transaction parameters  
rpc_1.rpc((state) => ({
    'url': '/chains/main/blocks/head/helpers/scripts/pack_data',
    'path': 'packOperationParameters',
    'payload': {
        'data': state.operations[state.operations.length - 1].parameters ?
            state.operations[state.operations.length - 1].parameters : {}, type: {}
    },
})), operators_1.tap(state => console.log('[+] packOperationParameters', state.packOperationParameters)));
/**
 * Get wallet details
 */
// export const getWalletDetail = (fn?: (params: Wallet) => PublicAddress) => (source: Observable<Wallet>): Observable<Contract> =>
exports.getWallet = () => (source) => source.pipe(
// get contract info balance 
rpc_1.rpc(state => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/',
    path: 'getWallet'
})));
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
exports.newWallet = () => (source) => source.pipe(
// create keys
operators_1.map(state => utils.keys()), operators_1.tap(state => {
    console.log('[+] mnemonic: "' + state.mnemonic + '"');
    console.log('[+] publicKey: "' + state.publicKey + '"');
    console.log('[+] publicKeyHash: "' + state.publicKeyHash + '"');
    console.log('[+] secretKey: "' + state.secretKey + '"');
}));
/**
 * Wait for sodium to initialize
 */
exports.initializeWallet = (selector) => (source) => source.pipe(operators_1.flatMap(state => rxjs_1.of({}).pipe(
// wait for sodium to initialize
operators_1.concatMap(() => Promise.resolve(sodium.ready)), 
// exec callback function and add result state
operators_1.map(() => ({
    wallet: selector(state)
})), operators_1.catchError((error) => {
    console.warn('[initializeWallet][sodium] ready', error);
    // this might not work. Why we do not propagate error further?
    // incompatible
    return rxjs_1.of(Object.assign({}, state, { error }));
    //return throwError(error);
}))));
