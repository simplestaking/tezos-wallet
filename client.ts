import { Observable, of } from 'rxjs';
import { tap, map, flatMap, delay, withLatestFrom, catchError } from 'rxjs/operators';

import { Wallet, Contract, Transfer, Operation, PublicAddress } from './types'
import { rpc } from './rpc'

import sodium from 'libsodium-wrappers'
import * as utils from './utils'

/**
 *  Transfer token's from one wallet to another
 */
export const transfer = (fn: (state: any) => any) => (source: Observable<any>): Observable<any> => source.pipe(

  map(state => fn(state)),

  // display transaction info to console
  tap(state => {
    console.log('[debug][+] transfer: ',  state)
  }),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // display transaction info to console
  tap(state => {
    console.log('[+] transfer: ' + state.amount + ' ꜩ ' + 'from "' + state.publicKeyHash + '" to "' + state.to + '"')
  }),

  // prepare config for operation
  map(state => {
    const operations = []
    if (state.key === undefined) {
      operations.push({
        "kind": "reveal",
        "public_key": state.publicKey,
        "source": state.publicKeyHash,
        "fee": "0",
        "gas_limit": "200",
        "storage_limit": "0",
        "counter": (++state.counter).toString(),
      })
    }

    operations.push({
      "kind": "transaction",
      "source": state.publicKeyHash,
      "destination": state.to,
      "amount": "1", //utils.amount(state.amount),
      "fee": "0",
      "gas_limit": "200",
      "storage_limit": "0",
      "counter": (++state.counter).toString(),
    })

    return {
      ...state,
      "operations": operations
    }

  }),

  // create operation 
  operation(),

)

/**
 *  Set delegation rights to tezos address
 */
export const setDelegation = (fn: (state: any) => any) => (source: Observable<any>): Observable<any> => source.pipe(

  map(state => fn(state)),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // display transaction info to console
  tap(state => {
    console.log('[+] setDelegate: from "' + state.publicKeyHash + '" to "' + state.to + '"')
  }),

  // prepare config for operation
  map(state => {
    const operations = []
    if (state.key === undefined) {
      operations.push({
        "kind": "reveal",
        "public_key": state.publicKey,
        "source": state.publicKeyHash,
        "fee": "0",
        "gas_limit": "200",
        "storage_limit": "0",
        "counter": (++state.counter).toString(),
      })
    }

    operations.push({
      "kind": "delegation",
      "source": state.publicKeyHash,
      "fee": "0",
      "gas_limit": "200",
      "storage_limit": "0",
      "counter": (++state.counter).toString(),
      "delegate": state.to,
    })

    return {
      ...state,
      "operations": operations
    }

  }),

  // create operation 
  operation(),

)


/**
 * Originate new delegateble contract from wallet  
 */
export const originate = (fn: (state: any) => any) => (source: Observable<any>) => source.pipe(

  map(state => fn(state)),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // display transaction info to console
  tap(state => {
    console.log('[+] originate: from "' + state.publicKeyHash + '" delegate to "' + state.delegate + '"')
  }),

  // prepare config for operation
  map(state => {
    const operations = []
    if (state.key === undefined) {
      operations.push({
        "kind": "reveal",
        "public_key": state.publicKey,
        "source": state.publicKeyHash,
        "fee": "0",
        "gas_limit": "200",
        "storage_limit": "0",
        "counter": (++state.counter).toString(),
      })
    }

    operations.push({
      "kind": "origination",
      "source": state.publicKeyHash,
      "managerPubkey": state.publicKeyHash,
      "fee": "0",
      "balance": "1", // state.amount,
      "gas_limit": "200",
      "storage_limit": "0",
      "counter": (++state.counter).toString(),
      "spendable": true,
      "delegatable": true,
      // "delegate": state.delegate, 
    })

    return {
      ...state,
      "operations": operations
    }

  }),

  tap((state: any) => console.log('[+] origination:  ', state)),
  // create operation 
  operation(),

)


/**
 * Create operation in blocchain
 */
export const operation = () => <T>(source: Observable<Wallet>): Observable<T> => source.pipe(

  // get head and counter
  head(),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // create operation
  flatMap((state: any) =>
    rpc('/chains/' + state.head.chain_id + '/blocks/' + state.head.hash + '/helpers/forge/operations', {
      "branch": state.head.hash,
      "contents": state.operations,
    }).pipe(
      // add operation to state 
      map((response: any) => ({ ...state, operation: response })),
    )
  ),

  // add signature to state 
  // TODO: move and just keep signOperation and create logic inside utils  
  // flatMap(state => [utils.signOperation(state)]),
  flatMap(state => state.walletType === 'TREZOR_T' ? utils.signOperationTrezor(state) : [utils.signOperation(state)]),

  //get counter
  counter(),

  // apply & inject operation
  applyAndInjectOperation(),

  // wait until operation is confirmed & moved from mempool to head
  // confirmOperation(),

)

/**
 * Get head for operation
 */
export const head = () => (source: Observable<any>) => source.pipe(

  // get head
  flatMap(state =>
    rpc('/chains/main/blocks/head').pipe(
      // add head to state 
      map(response => ({ ...state, head: response })),
    )
  ),

)

/**
 * Get counter for contract  
 */
export const counter = () => (source: Observable<any>) => source.pipe(

  // get counter for contract
  flatMap((state: any) =>
    rpc('/chains/main/blocks/head/context/contracts/' + state.publicKeyHash + '/counter').pipe(
      // add counter to state 
      map(response => ({ ...state, counter: response })),
      //tap(state => console.log('[+][counter]', state.counter))
    )
  ),

)

/**
* Get manager key for contract 
*/
export const managerKey = () => (source: Observable<any>) => source.pipe(

  // get manager key for contract 
  flatMap((state: any) =>
    rpc('/chains/main/blocks/head/context/contracts/' + state.publicKeyHash + '/manager_key').pipe(
      // add counter to state 
      map(response => ({
        ...state,
        manger: response.manager ? response.manager : undefined,
        key: response.key ? response.manager : undefined,
      })),
      //tap(state => console.log('[+][managerKey]', state))
    )
  )

)


/**
 * Apply and inject operation into node
 */
export const applyAndInjectOperation = () => (source: Observable<any>) => source.pipe(

  // preapply operation
  flatMap((state: any) =>
    rpc('/chains/main/blocks/head/helpers/preapply/operations', [{
      "protocol": "PtCJ7pwoxe8JasnHY8YonnLYjcVHmhiARPJvqcC6VfHT5s8k8sY",
      "branch": state.head.hash,
      "contents": state.operations,
      "signature": state.signature
    }]).pipe(
      catchError(error => { console.log('[-] [catchError]', error); return of('') }),
      tap((response: any) => console.log("[+] operation: preapply ", response)),
      // add operation confirmation 
      map(response => ({ ...state, ...response })),
    )
  ),

  // inject operation
  flatMap((state: any) =>
    rpc('/injection/operation', '"' + state.signedOperationContents + '"',
    ).pipe(
      tap((response: any) => console.log("[+] operation: inject ", response)),
      map(response => ({ ...state, injectionOperation: response })),
      tap((state: any) => console.log("[+] operation: http://tzscan.io/" + state.injectionOperation))
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
      rpc('/chains/main/blocks/head/context/contracts/' + state.publicKeyHash + '/').pipe(
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
