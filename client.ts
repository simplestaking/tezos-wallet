import { Observable, of } from 'rxjs';
import { tap, map, flatMap, delay, withLatestFrom } from 'rxjs/operators';

import sodium from 'libsodium-wrappers'

import * as utils from './utils'
import { rpc } from './rpc'

import { Wallet, Contract, Operation, PublicAddress } from './types'


/**
 *  Transaction XTZ from one wallet to another
 */
export const transaction = (fn: (state: any) => any) => (source: Observable<any>): Observable<any> => source.pipe(

  map(state => ({ ...state, 'transaction': fn(state) })),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // display transaction info to console
  tap(state => {
    console.log('[+] transaction: ' + state.transaction.amount + ' ꜩ ' + 'from "' + state.wallet.publicKeyHash + '" to "' + state.transaction.to + '"')
  }),

  // prepare config for operation
  map(state => {
    const operations = []
    if (state.manager_key.key === undefined) {
      operations.push({
        "kind": "reveal",
        "public_key": state.wallet.publicKey,
        "source": state.wallet.publicKeyHash,
        "fee": "0",
        "gas_limit": "200",
        "storage_limit": "0",
        "counter": (++state.counter).toString(),
      })
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

  map(state => ({ ...state, 'setDelegate': fn(state) })),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // display transaction info to console
  tap(state => {
    console.log('[+] setDelegate: from "' + state.wallet.publicKeyHash + '" to "' + state.setDelegate.to + '"')
  }),

  tap(state => {
    console.log('[+] wallet: from "' + state.wallet)
  }),

  // prepare config for operation
  map(state => {
    const operations = []
    if (state.manager_key.key === undefined) {
      operations.push({
        "kind": "reveal",
        "public_key": state.wallet.publicKey,
        "source": state.wallet.publicKeyHash,
        "fee": "0",
        "gas_limit": "200",
        "storage_limit": "0",
        "counter": (++state.counter).toString(),
      })
    }

    operations.push({
      "kind": "delegation",
      "source": state.wallet.publicKeyHash,
      "fee": "0",
      "gas_limit": "200",
      "storage_limit": "0",
      "counter": (++state.counter).toString(),
      "delegate": !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
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
export const originateContract = (fn: (state: any) => any) => (source: Observable<any>) => source.pipe(

  map(state => ({ ...state, 'originateContract': fn(state) })),

  // display transaction info to console
  tap(state => {
    console.log('[+] originate : from "' + state.wallet.publicKeyHash)
  }),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // prepare config for operation
  map(state => {
    const operations = []
    if (state.manager_key.key === undefined) {
      operations.push({
        "kind": "reveal",
        "public_key": state.wallet.publicKey,
        "source": state.wallet.publicKeyHash,
        "fee": "0",
        "gas_limit": "10000",
        "storage_limit": "100",
        "counter": (++state.counter).toString(),
      })
    }

    operations.push({
      "kind": "origination",
      "source": state.wallet.publicKeyHash,
      "manager_pubkey": state.manager_key.manager,
      "fee": "0",
      "balance": utils.amount(state.originateContract.amount).toString(),
      "gas_limit": "10000",
      "storage_limit": "100",
      "counter": (++state.counter).toString(),
      "spendable": true,
      "delegatable": true,
      "delegate": 'tz1boot3mLsohEn4pV9Te3hQihH6N8U3ks59',
      // "script": {
      //   "code":
      //     [{ "prim": "parameter", "args": [{ "prim": "unit" }] },
      //     { "prim": "storage", "args": [{ "prim": "unit" }] },
      //     {
      //       "prim": "code",
      //       "args":
      //         [[{ "prim": "CDR" },
      //         {
      //           "prim": "NIL",
      //           "args": [{ "prim": "operation" }]
      //         },
      //         { "prim": "PAIR" }]]
      //     }],
      //   "storage": { "prim": "Unit" }
      // },
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
 * Create operation in blocchain
 */
export const operation = () => <T>(source: Observable<Wallet>): Observable<T> => source.pipe(

  // create operation
  forgeOperation(),

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
  rpc(state => ({
    'url': '/chains/main/blocks/head',
    'path': 'head',
  }))

)

/**
 * Get counter for contract  
 */
export const counter = () => (source: Observable<any>) => source.pipe(

  // get counter for contract
  rpc((state: any) => ({
    'url': '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/counter',
    'path': 'counter',
  })),

)

/**
* Get manager key for contract 
*/
export const managerKey = () => (source: Observable<any>) => source.pipe(

  // get manager key for contract 
  rpc((state: any) => ({
    'url': '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/manager_key',
    'path': 'manager_key'
  })),

)

/**
 * Forge operation in blocchain
 */
export const forgeOperation = () => <T>(source: Observable<Wallet>): Observable<T> => source.pipe(

  // get head and counter
  head(),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // create operation
  rpc((state: any) => ({
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
  flatMap(state => state.wallet.type === 'TREZOR_T' ? utils.signOperationTrezor(state) : [utils.signOperation(state)]),

)

/**
 * Apply and inject operation into node
 */
export const applyAndInjectOperation = () => (source: Observable<any>) => source.pipe(

  //get counter
  counter(),

  // preapply operation
  rpc((state: any) => ({
    'url': '/chains/main/blocks/head/helpers/preapply/operations',
    'path': 'preapply',
    'payload': [{
      "protocol": state.head.protocol,
      "branch": state.head.hash,
      "contents": state.operations,
      "signature": state.signOperation.signature
    }]
  })),
  // tap((state: any) => console.log("[+] operation: preapply ", state.preapply)),

  // inject operation
  rpc((state: any) => ({
    'url': '/injection/operation',
    'path': 'injectionOperation',
    'payload': '"' + state.signOperation.signedOperationContents + '"',
  })),

  tap((state: any) => console.log("[+] operation: http://zeronet.tzscan.io/" + state.injectionOperation))

)


/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export const confirmOperation = () => (source: Observable<any>): any => source.pipe(

  tap((state: any) => console.log('[-] pending: operation "' + state.injectionOperation + '"')),

  // wait 5 sec for operation 
  delay(5000),

  // call node and look for operation in mempool
  rpc((state: any) => ({
    'url': '/chains/main/mempool/pending_operations',
    'path': 'mempool'
  })),

  // if we find operation in mempool call confirmOperation() again
  flatMap((state: any) =>
    state.mempool.applied
      .filter((operation: any) => state.injectionOperation === operation.hash)
      .length > 0 ? of(state).pipe(confirmOperation()) : source
  ),
)

/** 
 * Get wallet details
 */
// export const getWalletDetail = (fn?: (params: Wallet) => PublicAddress) => (source: Observable<Wallet>): Observable<Contract> =>
export const getWallet = () => (source: Observable<any>): Observable<any> =>
  source.pipe(

    // get contract info balance 
    rpc((state: any) => ({
      url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/',
      path: 'getWallet',
    })),

    // show balance
    tap(state => {
      console.log('[+] balance: ' + parseInt(state.getWallet.balance) / 1000000 + ' ꜩ  for: ' + state.wallet.publicKeyHash)
    })
  )

/**
 * Generate new menomonic, private, public key & tezos wallet address 
 */
export const newWallet = () => <T>(source: Observable<T>): Observable<Wallet> => source.pipe(

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
export const initializeWallet = (fn: (params: any) => any) => (source: Observable<any>): Observable<any> => source.pipe(

  // wait for sodium to initialize
  flatMap(state => of(sodium.ready)),
  // combine resolved promise with state observable
  withLatestFrom(source),
  // use only state
  map(([resolved, state]) => state),

  //tap(state => console.log('[initilazization] before', state)),

  // exec calback function and add result state
  map(state => ({
    // ...state,
    'wallet': fn(state)
  })),

  //tap(state => console.log('[initilazization] after', state)),

)
