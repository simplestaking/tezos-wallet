import { of } from 'rxjs';
import { tap, map, flatMap, concatMap, delay, catchError } from 'rxjs/operators';
import sodium from 'libsodium-wrappers';
import * as utils from './utils';
import { rpc } from './rpc';
/**
 *  Transaction XTZ from one wallet to another
 */
export const transaction = (fn) => (source) => source.pipe(map(state => (Object.assign({}, state, { 'transaction': fn(state) }))), 
// get contract counter
counter(), 
// get contract managerKey
managerKey(), 
// display transaction info to console
tap(state => {
    console.log('[+] transaction: ' + state.transaction.amount + ' ꜩ ' + 'from "' + state.wallet.publicKeyHash + '" to "' + state.transaction.to + '"');
}), 
// prepare config for operation
map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            "kind": "reveal",
            "public_key": state.wallet.publicKey,
            "source": state.wallet.publicKeyHash,
            "fee": "0",
            "gas_limit": "200",
            "storage_limit": "0",
            "counter": (++state.counter).toString(),
        });
    }
    operations.push({
        "kind": "transaction",
        "source": state.wallet.publicKeyHash,
        "destination": state.transaction.to,
        "amount": utils.amount(state.transaction.amount).toString(),
        "fee": "0",
        "gas_limit": "200",
        "storage_limit": "0",
        "counter": (++state.counter).toString(),
    });
    return Object.assign({}, state, { "operations": operations });
}), 
// create operation 
operation());
/**
 *  Set delegation rights to tezos address
 */
export const setDelegation = (fn) => (source) => source.pipe(map(state => (Object.assign({}, state, { 'setDelegate': fn(state) }))), 
// get contract counter
counter(), 
// get contract managerKey
managerKey(), 
// display transaction info to console
tap(state => {
    console.log('[+] setDelegate: from "' + state.wallet.publicKeyHash + '" to "' + state.setDelegate.to + '"');
}), tap(state => {
    console.log('[+] wallet: from "' + state.wallet);
}), 
// prepare config for operation
map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            "kind": "reveal",
            "public_key": state.wallet.publicKey,
            "source": state.wallet.publicKeyHash,
            "fee": "0",
            "gas_limit": "200",
            "storage_limit": "0",
            "counter": (++state.counter).toString(),
        });
    }
    operations.push({
        "kind": "delegation",
        "source": state.wallet.publicKeyHash,
        "fee": "0",
        "gas_limit": "200",
        "storage_limit": "0",
        "counter": (++state.counter).toString(),
        "delegate": !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
    });
    return Object.assign({}, state, { "operations": operations });
}), 
// create operation 
operation());
/**
 * Originate new delegatable contract from wallet
 */
export const originateContract = (fn) => (source) => source.pipe(map(state => (Object.assign({}, state, { 'originateContract': fn(state) }))), 
// display transaction info to console
tap(state => {
    console.log('[+] originate : from "' + state.wallet.publicKeyHash);
}), 
// get contract counter
counter(), 
// get contract managerKey
managerKey(), 
// prepare config for operation
map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            "kind": "reveal",
            "public_key": state.wallet.publicKey,
            "source": state.wallet.publicKeyHash,
            "fee": "0",
            "gas_limit": "10000",
            "storage_limit": "100",
            "counter": (++state.counter).toString(),
        });
    }
    operations.push({
        "kind": "origination",
        "source": state.wallet.publicKeyHash,
        "manager_pubkey": state.manager_key.manager,
        "fee": "0",
        "balance": utils.amount(state.originateContract.amount).toString(),
        "gas_limit": "10001",
        "storage_limit": "100",
        "counter": (++state.counter).toString(),
        "spendable": true,
        "delegatable": true,
        "delegate": state.originateContract.to,
    });
    return Object.assign({}, state, { "operations": operations });
}), 
// create operation 
operation());
/**
 * Create operation in blocchain
 */
export const operation = () => (source) => source.pipe(
// create operation
forgeOperation(), 
// apply & inject operation
applyAndInjectOperation());
/**
 * Get head for operation
 */
export const head = () => (source) => source.pipe(
// get head
rpc(state => ({
    'url': '/chains/main/blocks/head',
    'path': 'head',
})));
/**
 * Get counter for contract
 */
export const counter = () => (source) => source.pipe(
// get counter for contract
rpc((state) => ({
    'url': '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/counter',
    'path': 'counter',
})));
/**
* Get manager key for contract
*/
export const managerKey = () => (source) => source.pipe(
// get manager key for contract 
rpc((state) => ({
    'url': '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/manager_key',
    'path': 'manager_key'
})));
/**
 * Forge operation in blocchain
 */
export const forgeOperation = () => (source) => source.pipe(
// get head and counter
head(), 
// get contract counter
counter(), 
// get contract managerKey
managerKey(), 
// create operation
rpc((state) => ({
    'url': '/chains/' + state.head.chain_id + '/blocks/' + state.head.hash + '/helpers/forge/operations',
    'path': 'operation',
    'payload': {
        "branch": state.head.hash,
        "contents": state.operations,
    }
})), 
// add signature to state 
// 
// : move and just keep signOperation and create logic inside utils 
// tap(state => console.log('[operation]', state.walletType, state)),
// flatMap(state => [utils.signOperation(state)]),
flatMap(state => state.wallet.type === 'TREZOR_T' ? utils.signOperationTrezor(state) : [utils.signOperation(state)]));
/**
 * Apply and inject operation into node
 */
export const applyAndInjectOperation = () => (source) => source.pipe(
//get counter
counter(), 
// preapply operation
rpc((state) => ({
    'url': '/chains/main/blocks/head/helpers/preapply/operations',
    'path': 'preapply',
    'payload': [{
            "protocol": state.head.protocol,
            "branch": state.head.hash,
            "contents": state.operations,
            "signature": state.signOperation.signature
        }]
})), tap((state) => console.log("[+] operation: preapply ", state.preapply)), 
// inject operation
rpc((state) => ({
    'url': '/injection/operation',
    'path': 'injectionOperation',
    'payload': '"' + state.signOperation.signedOperationContents + '"',
})), tap((state) => console.log("[+] operation: " + state.wallet.node.tzscan.url + state.injectionOperation)));
/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export const confirmOperation = (fn) => (source) => source.pipe(map(state => (Object.assign({}, state, { 'confirmOperation': (fn && typeof fn === 'function') ? fn(state) : state.confirmOperation }))), tap((state) => console.log('[-] pending: operation "' + state.confirmOperation.injectionOperation + '"')), 
// wait 5 sec for operation 
delay(5000), 
// call node and look for operation in mempool
rpc((state) => ({
    'url': '/chains/main/mempool' + (state.wallet.node.name === 'zero' ? '/pending_operations' : ''),
    'path': 'mempool'
})), 
// if we find operation in mempool call confirmOperation() again
flatMap((state) => state.mempool.applied
    .filter((operation) => state.confirmOperation.injectionOperation === operation.hash)
    .length > 0 ? of(state).pipe(confirmOperation()) : source));
/**
 * Get wallet details
 */
// export const getWalletDetail = (fn?: (params: Wallet) => PublicAddress) => (source: Observable<Wallet>): Observable<Contract> =>
export const getWallet = () => (source) => source.pipe(
// get contract info balance 
rpc((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/',
    path: 'getWallet',
})));
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
export const newWallet = () => (source) => source.pipe(
// create keys
map(state => utils.keys()), tap(state => {
    console.log('[+] mnemonic: "' + state.mnemonic + '"');
    console.log('[+] publicKey: "' + state.publicKey + '"');
    console.log('[+] publicKeyHash: "' + state.publicKeyHash + '"');
    console.log('[+] secretKey: "' + state.secretKey + '"');
}));
/**
 * Wait for sodium to initialize
 */
export const initializeWallet = (fn) => (source) => source.pipe(flatMap(state => of([]).pipe(
// wait for sodium to initialize
concatMap(() => Promise.resolve(sodium.ready)), 
// exec calback function and add result state
map(state => ({
    // ...state,
    'wallet': fn(state)
})), catchError(error => {
    console.warn('[initializeWallet][sodium] ready', error);
    return of([error]);
}))));
//# sourceMappingURL=client.js.map