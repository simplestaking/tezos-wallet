import { of } from 'rxjs';
import { tap, map, flatMap, delay, withLatestFrom } from 'rxjs/operators';
import sodium from 'libsodium-wrappers';
import * as utils from './utils';
import { rpc } from './rpc';
/**
 *  Transfer token's from one wallet to another
 */
export const transfer = (fn) => (source) => source.pipe(map(state => fn(state)), 
// get contract counter
counter(), 
// get contract managerKey
managerKey(), 
// display transaction info to console
tap(state => {
    console.log('[+] transfer: ' + state.amount + ' ꜩ ' + 'from "' + state.publicKeyHash + '" to "' + state.to + '"');
}), 
// prepare config for operation
map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            "kind": "reveal",
            "public_key": state.publicKey,
            "source": state.publicKeyHash,
            "fee": "0",
            "gas_limit": "200",
            "storage_limit": "0",
            "counter": (++state.counter).toString(),
        });
    }
    operations.push({
        "kind": "transaction",
        "source": state.publicKeyHash,
        "destination": state.to,
        "amount": utils.amount(state.amount).toString(),
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
export const setDelegation = (fn) => (source) => source.pipe(map(state => fn(state)), 
// get contract counter
counter(), 
// get contract managerKey
managerKey(), 
// display transaction info to console
tap(state => {
    console.log('[+] setDelegate: from "' + state.publicKeyHash + '" to "' + state.to + '"');
}), 
// prepare config for operation
map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            "kind": "reveal",
            "public_key": state.publicKey,
            "source": state.publicKeyHash,
            "fee": "0",
            "gas_limit": "200",
            "storage_limit": "0",
            "counter": (++state.counter).toString(),
        });
    }
    operations.push({
        "kind": "delegation",
        "source": state.publicKeyHash,
        "fee": "0",
        "gas_limit": "200",
        "storage_limit": "0",
        "counter": (++state.counter).toString(),
        "delegate": state.to,
    });
    return Object.assign({}, state, { "operations": operations });
}), 
// create operation 
operation());
/**
 * Originate new delegateble contract from wallet
 */
export const originate = (fn) => (source) => source.pipe(map(state => fn(state)), 
// get contract counter
counter(), 
// get contract managerKey
managerKey(), 
// display transaction info to console
tap(state => {
    console.log('[+] originate: from "' + state.publicKeyHash + '" delegate to "' + state.delegate + '"');
}), 
// prepare config for operation
map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            "kind": "reveal",
            "public_key": state.publicKey,
            "source": state.publicKeyHash,
            "fee": "0",
            "gas_limit": "10000",
            "storage_limit": "100",
            "counter": (++state.counter).toString(),
        });
    }
    operations.push({
        "kind": "origination",
        "source": state.publicKeyHash,
        "managerPubkey": state.manager_key.manager,
        "fee": "0",
        "balance": utils.amount(state.amount).toString(),
        "gas_limit": "10000",
        "storage_limit": "100",
        "counter": (++state.counter).toString(),
        "spendable": true,
        "delegatable": true,
        "delegate": 'tz1boot3mLsohEn4pV9Te3hQihH6N8U3ks59',
    });
    return Object.assign({}, state, { "operations": operations });
}), 
// create operation 
operation());
/**
 * Create operation in blocchain
 */
export const operation = () => (source) => source.pipe(
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
// TODO: move and just keep signOperation and create logic inside utils 
// tap(state => console.log('[operation]', state.walletType, state)),
// flatMap(state => [utils.signOperation(state)]),
flatMap(state => state.walletType === 'TREZOR_T' ? utils.signOperationTrezor(state) : [utils.signOperation(state)]), 
//get counter
counter(), 
// apply & inject operation
applyAndInjectOperation(), 
// wait until operation is confirmed & moved from mempool to head
confirmOperation());
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
    'url': '/chains/main/blocks/head/context/contracts/' + state.publicKeyHash + '/counter',
    'path': 'counter',
})));
/**
* Get manager key for contract
*/
export const managerKey = () => (source) => source.pipe(
// get manager key for contract 
rpc((state) => ({
    'url': '/chains/main/blocks/head/context/contracts/' + state.publicKeyHash + '/manager_key',
    'path': 'manager_key'
})));
/**
 * Apply and inject operation into node
 */
export const applyAndInjectOperation = () => (source) => source.pipe(
// preapply operation
rpc((state) => ({
    'url': '/chains/main/blocks/head/helpers/preapply/operations',
    'path': 'preapply',
    'payload': [{
            "protocol": state.head.protocol,
            "branch": state.head.hash,
            "contents": state.operations,
            "signature": state.signature
        }]
})), 
// tap((state: any) => console.log("[+] operation: preapply ", state.preapply)),
// inject operation
rpc((state) => ({
    'url': '/injection/operation',
    'path': 'injectionOperation',
    'payload': '"' + state.signedOperationContents + '"',
})), tap((state) => console.log("[+] operation: http://zeronet.tzscan.io/" + state.injectionOperation)));
/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export const confirmOperation = () => (source) => source.pipe(tap((state) => console.log('[-] pending: operation "' + state.injectionOperation + '"')), 
// wait 5 sec for operation 
delay(5000), 
// call node and look for operation in mempool
rpc((state) => ({
    'url': '/chains/main/mempool',
    'path': 'mempool'
})), 
// if we find operation in mempool call confirmOperation() again
flatMap((state) => state.mempool.applied
    .filter((operation) => state.injectionOperation === operation.hash)
    .length > 0 ? of(state).pipe(confirmOperation()) : source));
/**
 * Get wallet details
 */
// export const getWalletDetail = (fn?: (params: Wallet) => PublicAddress) => (source: Observable<Wallet>): Observable<Contract> =>
export const getWallet = (fn) => (source) => source.pipe(
// exec calback function only if is defined
map(state => fn ? fn(state) : state), 
// get contract info balance 
rpc((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.publicKeyHash + '/',
    path: 'balance',
})), 
// show balance
tap(state => {
    console.log('[+] balance: ' + parseInt(state.balance.balance) / 1000000 + ' ꜩ');
}));
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
export const newWallet = () => (source) => source.pipe(
// // wait for sodium to initialize
// initialize(),
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
export const initialize = () => (source) => source.pipe(
// wait for sodium to initialize
flatMap(state => of(sodium.ready)), 
// combine resolved promise with state observable
withLatestFrom(source), 
// use only state
map(([resolved, state]) => state));
//# sourceMappingURL=client.js.map