import { of } from 'rxjs';
import { tap, map, flatMap, delay, withLatestFrom, catchError } from 'rxjs/operators';
import { rpc } from './rpc';
import sodium from 'libsodium-wrappers';
import * as utils from './utils';
/**
 * Originate new delegateble contract from wallet
 */
export const origination = () => (source) => source.pipe(
// prepare config for operation
map((state) => (Object.assign({}, state, { "operations": [{
            "kind": "reveal",
            "public_key": state.publicKey,
        }, {
            "kind": "origination",
            "balance": utils.amount(state.amount),
            "managerPubkey": state.publicKeyHash,
            "spendable": true,
            "delegatable": true,
            "delegate": state.delegate,
        }] }))), tap((state) => console.log('[+] origination:  ', state)), 
// create operation 
operation(), tap((state) => console.log('[+] origination: http://tzscan.io/' + state.contracts[0])));
/**
 *  Transfer token's from one wallet to another
 */
export const transfer = (fn) => (source) => source.pipe(
// 
map(state => fn(state)), 
// display transaction info to console
tap(state => console.log('[+] transfer: ' + state.amount + ' ꜩ ' + 'from "' + state.publicKeyHash + '" to "' + state.to + '"')), 
// prepare config for operation
map(state => (Object.assign({}, state, { "operations": [{
            "kind": "reveal",
            "public_key": state.publicKey,
        }, {
            "kind": "transaction",
            "amount": utils.amount(state.amount),
            "destination": state.to,
        }] }))), 
// create operation 
operation());
/**
 *  Set delegation rights to tezos address
 */
export const delegation = () => (source) => source.pipe(
// get wallet balance, only wallet with balance > 0 can create delegatable contract 
// getWalletInfo(state => ({
//   publicKeyHash: state.publicKeyHash,
// })),
// prepare config for operation
map((state) => (Object.assign({}, state, { "operations": [{
            "kind": "reveal",
            "public_key": state.publicKey,
        }, {
            "kind": "delegation",
            "delegate": state.delegate,
        }] }))), 
// create operation 
operation());
/**
 * Create operation in blocchain
 */
export const operation = () => (source) => source.pipe(
// get head and counter
head(), 
// create operation
flatMap((state) => rpc('/blocks/head/proto/helpers/forge/operations', {
    "branch": state.head.hash,
    "kind": "manager",
    "source": state.publicKeyHash,
    "fee": 0,
    "counter": state.counter + 1,
    "operations": state.operations,
}).pipe(
// add operation to state 
map((response) => (Object.assign({}, state, { operation: response.operation }))))), 
// add signature to state 
// TODO: move and just keep signOperation and create logic inside utils  
flatMap(state => state.walletType === 'TREZOR_T' ? utils.signOperationTrezor(state) : [utils.signOperation(state)]), 
// get new head and counter
head(), 
// apply & inject operation
applyAndInjectOperation(), 
// wait until operation is confirmed & moved from mempool to head
confirmOperation());
/**
 * Get head for operation
 */
export const head = () => (source) => source.pipe(
// get head
flatMap(state => rpc('/blocks/head', {}).pipe(
// add head to state 
map(response => (Object.assign({}, state, { head: response }))))), 
// get counter for contract
flatMap((state) => rpc('/blocks/head/proto/context/contracts/' + state.publicKeyHash + '/counter', {}).pipe(
// add counter to state 
map(response => (Object.assign({}, state, { counter: response.counter }))))));
/**
 * Apply and inject operation into node
 */
export const applyAndInjectOperation = () => (source) => source.pipe(
// apply operation
flatMap((state) => rpc('/blocks/head/proto/helpers/apply_operation', {
    "pred_block": state.head.predecessor,
    "operation_hash": state.operationHash,
    "forged_operation": state.operation,
    "signature": state.signature
}).pipe(catchError(error => { console.log('[-] [catchError]', error); return of(''); }), tap((response) => console.log("[+] operation: apply ", response)), 
// add operation confirmation 
map(response => (Object.assign({}, state, response))))), 
// inject operation
flatMap((state) => rpc('/inject_operation', {
    "signedOperationContents": state.signedOperationContents,
}).pipe(tap((response) => console.log("[+] operation: inject ", response)), map(response => (Object.assign({}, state, response))), tap((state) => console.log("[+] operation: http://tzscan.io/" + state.injectedOperation)))));
/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export const confirmOperation = () => (source) => source.pipe(tap((state) => console.log('[-] pending: operation "' + state.injectedOperation + '"')), 
// wait 5 sec for operation 
delay(10000), 
// call node and look for operation in mempool
flatMap((state) => 
// send request to node 
rpc('/mempool/pending_operations ', {}).pipe(
// if we find operation in mempool call confirmOperation() again
flatMap((response) => response.applied
    .filter((operation) => state.injectedOperation === operation.hash)
    .length > 0 ? of(state).pipe(confirmOperation()) : source))));
/**
 * Get wallet details
 */
// export const getWalletDetail = (fn?: (params: Wallet) => PublicAddress) => (source: Observable<Wallet>): Observable<Contract> =>
export const getWallet = (fn) => (source) => source.pipe(
// exec calback function only if is defined
map(state => fn ? fn(state) : state), 
// get contract info balance 
flatMap((state) => rpc('/chains/main/blocks/head/context/contracts/' + state.publicKeyHash + '/').pipe(
// add contract info to state 
map(response => (Object.assign({}, state, response))), 
// show account and balance 
tap((state) => {
    console.log('[+] wallet: "' + state.publicKeyHash + '"');
    console.log('[+] balance: ', state.balance / 1000000 + ' ꜩ');
}))));
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
flatMap(state => sodium.ready), 
// combine resolved promise with state observable
withLatestFrom(source), 
// use only state
map(([resolved, state]) => state));
//# sourceMappingURL=client.js.map