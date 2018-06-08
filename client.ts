import { Observable, of } from 'rxjs';
import { tap, map, flatMap, delay, withLatestFrom, catchError } from 'rxjs/operators';

import { Wallet, Contract, Transfer, Operation, PublicAddress } from './types'
import { rpc } from './rpc'

import sodium from 'libsodium-wrappers'
import * as utils from './utils'

/**
 * Originate new delegateble contract from wallet  
 */
export const origination = () => (source: Observable<any>) => source.pipe(

  // prepare config for operation
  map((state: any) => ({
    ...state,
    "operations": [{
      "kind": "reveal",
      "public_key": state.publicKey,
    }, {
      "kind": "origination",
      "balance": utils.amount(state.amount),
      "managerPubkey": state.publicKeyHash,
      "spendable": true,
      "delegatable": true,
      "delegate": state.delegate,
      // "script":{
      //    "code":"",
      //   "storage":"",
      // }
    }],
  })),

  tap((state: any) => console.log('[+] origination:  ', state)),
  // create operation 
  operation(),
  tap((state: any) => console.log('[+] origination: http://tzscan.io/' + state.contracts[0])),

)


/**
 *  Transfer token's from one wallet to another
 */
export const transfer = (fn: (state: any) => any) => (source: Observable<any>): Observable<any> => source.pipe(

  // 
  map(state => fn(state)),

  // display transaction info to console
  tap(state =>
    console.log('[+] transfer: ' + state.amount + ' ꜩ ' + 'from "' + state.publicKeyHash + '" to "' + state.to + '"')
  ),

  // prepare config for operation
  map(state => ({
    ...state,
    "operations": [{
      "kind": "reveal",
      "public_key": state.publicKey,
    }, {
      "kind": "transaction",
      "amount": utils.amount(state.amount),
      "destination": state.to,
    }]
  })),
  // create operation 
  operation(),

)

/**
 *  Set delegation rights to tezos address
 */
export const delegation = () => (source: Observable<any>) => source.pipe(

  // get wallet balance, only wallet with balance > 0 can create delegatable contract 
  // getWalletInfo(state => ({
  //   publicKeyHash: state.publicKeyHash,
  // })),

  // prepare config for operation
  map((state: any) => ({
    ...state,
    "operations": [{
      "kind": "reveal",
      "public_key": state.publicKey,
    }, {
      "kind": "delegation",
      "delegate": state.delegate,
    }]
  })),
  // create operation 
  operation(),

)

/**
 * Create operation in blocchain
 */
export const operation = () => <T>(source: Observable<Wallet>): Observable<T> => source.pipe(

  // get head and counter
  head(),

  // create operation
  flatMap((state: any) =>
    rpc('/blocks/head/proto/helpers/forge/operations', {
      "branch": state.head.hash,
      "kind": "manager",
      "source": state.publicKeyHash,
      "fee": 0,
      "counter": state.counter + 1,
      "operations": state.operations,
    }).pipe(
      // add operation to state 
      map((response: any) => ({ ...state, operation: response.operation })),
    )
  ),

  // add signature to state 
  // TODO: move and just keep signOperation and create logic inside utils  
  flatMap(state => state.walletType === 'TREZOR_T' ? utils.signOperationTrezor(state) : [utils.signOperation(state)]),

  // get new head and counter
  head(),

  // apply & inject operation
  applyAndInjectOperation(),

  // wait until operation is confirmed & moved from mempool to head
  confirmOperation(),

)

/**
 * Get head for operation
 */
export const head = () => (source: Observable<any>) => source.pipe(

  // get head
  flatMap(state =>
    rpc('/blocks/head', {}).pipe(
      // add head to state 
      map(response => ({ ...state, head: response })),
    )
  ),

  // get counter for contract
  flatMap((state: any) =>
    rpc('/blocks/head/proto/context/contracts/' + state.publicKeyHash + '/counter', {}).pipe(
      // add counter to state 
      map(response => ({ ...state, counter: response.counter })),
    )
  )
)

/**
 * Apply and inject operation into node
 */
export const applyAndInjectOperation = () => (source: Observable<any>) => source.pipe(

  // apply operation
  flatMap((state: any) =>
    rpc('/blocks/head/proto/helpers/apply_operation', {
      "pred_block": state.head.predecessor,
      "operation_hash": state.operationHash,
      "forged_operation": state.operation,
      "signature": state.signature
    }).pipe(
      catchError(error => { console.log('[-] [catchError]', error); return of('') }),
      tap((response: any) => console.log("[+] operation: apply ", response)),
      // add operation confirmation 
      map(response => ({ ...state, ...response })),
    )
  ),

  // inject operation
  flatMap((state: any) =>
    rpc('/inject_operation', {
      "signedOperationContents": state.signedOperationContents,
    }).pipe(
      tap((response: any) => console.log("[+] operation: inject ", response)),
      map(response => ({ ...state, ...response })),
      tap((state: any) => console.log("[+] operation: http://tzscan.io/" + state.injectedOperation))
    )
  ),

)

/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export const confirmOperation = () => (source: Observable<any>): any => source.pipe(

  tap((state: any) => console.log('[-] pending: operation "' + state.injectedOperation + '"')),

  // wait 5 sec for operation 
  delay(10000),

  // call node and look for operation in mempool
  flatMap((state: any) =>
    // send request to node 
    rpc('/mempool/pending_operations ', {}).pipe(

      // if we find operation in mempool call confirmOperation() again
      flatMap((response: any) =>
        response.applied
          .filter((operation: any) => state.injectedOperation === operation.hash)
          .length > 0 ? of(state).pipe(confirmOperation()) : source
      ),

    ),
  ),
)

/** 
 * Get wallet details
 */
// export const getWalletDetail = (fn?: (params: Wallet) => PublicAddress) => (source: Observable<Wallet>): Observable<Contract> =>
export const getWallet = (fn?: (params: any) => PublicAddress) => <T>(source: Observable<T>): Observable<T> =>
  source.pipe(

    // exec calback function only if is defined
    map(state => fn ? fn(state) : state),

    // get contract info balance 
    flatMap((state: any) =>
      rpc('/blocks/head/proto/context/contracts/' + state.publicKeyHash + '/', {}).pipe(
        // add contract info to state 
        map(response => ({ ...state, ...response })),
        // show account and balance 
        tap((state: any) => {
          console.log('[+] wallet: "' + state.publicKeyHash + '"')
          console.log('[+] balance: ', state.balance / 1000000 + ' ꜩ')
        })
      )

    )
  )

/**
 * Generate new menomonic, private, public key & tezos wallet address 
 */
export const newWallet = () => <T>(source: Observable<T>): Observable<Wallet> => source.pipe(

  // // wait for sodium to initialize
  // initialize(),

  // create keys
  map(state => utils.keys()),
  tap(state => {
    console.log('[+] mnemonic: "' + state.mnemonic + '"')
    console.log('[+] publicKey: "' + state.publicKey + '"')
    console.log('[+] publicKeyHash: "' + state.publicKeyHash + '"')
    console.log('[+] secretKey: "' + state.secretKey + '"')
  })

)

/**
 * Wait for sodium to initialize
 */
export const initialize = () => <T>(source: Observable<T>): Observable<T> => source.pipe(

  // wait for sodium to initialize
  flatMap(state => sodium.ready),
  // combine resolved promise with state observable
  withLatestFrom(source),
  // use only state
  map(([resolved, state]) => state),

)
