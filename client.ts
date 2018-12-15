import { Observable, of, throwError } from 'rxjs';
import { tap, map, flatMap, concatMap, delay, catchError } from 'rxjs/operators';

import * as sodium from 'libsodium-wrappers'
import * as utils from './utils'
import { rpc } from './rpc'

import { Wallet, Contract, Operation, PublicAddress, Config } from './types'


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
    console.log('[+] transaction: ' + state.transaction.amount + ' ꜩ  fee:' + state.transaction.fee + ' ' + 'from "' + state.wallet.publicKeyHash + '" to "' + state.transaction.to + '"')
  }),

  // prepare config for operation
  map(state => {
    const operations = []
    if (state.manager_key.key === undefined) {
      operations.push({
        "kind": "reveal",
        "public_key": state.wallet.publicKey,
        "source": state.wallet.publicKeyHash,
        "fee": "10000",
        "gas_limit": "15000",
        "storage_limit": "277",
        "counter": (++state.counter).toString(),
      })
    }

    operations.push({
      "kind": "transaction",
      "source": state.wallet.publicKeyHash,
      "destination": state.transaction.to,
      "amount": utils.amount(state.transaction.amount).toString(),
      "fee": utils.amount(state.transaction.fee).toString(),
      "gas_limit": "11000", // "250000", 
      "storage_limit": "277",
      "counter": (++state.counter).toString(),
    })

    // add parameters to transaction
    if (state.transaction.parameters) {
      operations[operations.length - 1] = {
        ...operations[operations.length - 1],
        "parameters": state.transaction.parameters,
      }
    }

    return {
      ...state,
      "operations": operations
    }

  }),

  // tap((state: any) => console.log("[+] trasaction: operation " , state.operations)),

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
        "fee": utils.amount(state.setDelegate.fee).toString(),
        "gas_limit": "10100",
        "storage_limit": "277",
        "counter": (++state.counter).toString(),
      })
    }

    operations.push({
      "kind": "delegation",
      "source": state.wallet.publicKeyHash,
      "fee": utils.amount(state.setDelegate.fee).toString(),
      "gas_limit": "10100",
      "storage_limit": "277",
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
 * Originate new delegatable contract from wallet  
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
        "fee": utils.amount(state.originateContract.fee).toString(),
        "gas_limit": "10100",
        "storage_limit": "277",
        "counter": (++state.counter).toString(),
      })
    }

    operations.push({
      "kind": "origination",
      "source": state.wallet.publicKeyHash,
      "fee": utils.amount(state.originateContract.fee).toString(),
      "balance": utils.amount(state.originateContract.amount).toString(),
      "gas_limit": "10100",
      "storage_limit": "277",
      "counter": (++state.counter).toString(),
      "spendable": true,
      "delegatable": true,
      "delegate": state.originateContract.to,
    })

    // add manager_pubkey according to network
    if (state.wallet.node.name === "main") {
      operations[operations.length - 1] = {
        ...operations[operations.length - 1],
        "managerPubkey": state.manager_key.manager,
      }
    } else {
      operations[operations.length - 1] = {
        ...operations[operations.length - 1],
        "manager_pubkey": state.manager_key.manager,
      }
    }

    return {
      ...state,
      "operations": operations
    }

  }),

  // create operation 
  operation(),

)

/**
  * Activate wallet
  */
export const activateWallet = (fn: (state: any) => any) => (source: Observable<any>) => source.pipe(

  map(state => ({ ...state, 'activateWallet': fn(state) })),

  // prepare config for operation
  map(state => {
    const operations = []

    operations.push({
      "kind": "activate_account",
      "pkh": state.wallet.publicKeyHash,
      "secret": state.activateWallet.secret,
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
  // TODO: move and just keep signOperation and create logic inside utils 
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

  tap((state: any) => console.log("[+] operation: preapply ", state.preapply[0].contents[0].metadata.operation_result)),

  // check for errors
  flatMap(state =>
    state.preapply[0].contents[0].metadata.operation_result && state.preapply[0].contents[0].metadata.operation_result.status === "failed" ?
      throwError({ response: state.preapply[0].contents[0].metadata.operation_result.errors }) :
      of(state)
  ),


  // inject operation
  rpc((state: any) => ({
    'url': '/injection/operation',
    'path': 'injectionOperation',
    'payload': '"' + state.signOperation.signedOperationContents + '"',
  })),

  tap((state: any) => console.log("[+] operation: " + state.wallet.node.tzscan.url + state.injectionOperation))

)

/**
 * Get operation from mempool for address
 */
export const pendingOperation = (fn: (state: any) => any) => (source: Observable<any>): any => source.pipe(

  map(state => ({ ...state, 'pendingOperation': fn(state) })),

  // call node and look for operation in mempool
  rpc((state: any) => ({
    'url': '/chains/main/mempool/pending_operations',
    'path': 'mempool'
  })),

  // get operation for address in mempool
  map((state: any) => ({
    applied: [
      ...state.mempool.applied
        .filter((operation: any) => operation.contents[0].source === state.pendingOperation.publicKeyHash)
    ],
    refused: [
      ...state.mempool.refused
        .filter((operation: any) => operation.contents[0].source === state.pendingOperation.publicKeyHash)
    ]
  })),

  tap(state => console.warn('[pendingOperation]', state))

)

/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export const confirmOperation = (fn?: (state: any) => any) => (source: Observable<any>): any => source.pipe(

  map(state => ({
    ...state,
    'confirmOperation': (fn && typeof fn === 'function') ? fn(state) : state.confirmOperation
  })),

  tap((state: any) => console.log('[-] pending: operation "' + state.confirmOperation.injectionOperation + '"')),

  // wait 3 sec for operation 
  delay(3000),

  // call node and look for operation in mempool
  rpc((state: any) => ({
    'url': '/chains/main/mempool/pending_operations',
    'path': 'mempool'
  })),

  // if we find operation in mempool call confirmOperation() again
  flatMap((state: any) => {
    // check if operation is refused
    if (state.mempool.refused
      .filter((operation: any) => state.confirmOperation.injectionOperation === operation.hash)
      .length > 0) {

      console.error('[-] operation refused: ', state.mempool.refused, state.confirmOperation.injectionOperation)

      return throwError(state.mempool.refused);
    }

    return state.mempool.applied
      .filter((operation: any) => state.confirmOperation.injectionOperation === operation.hash)
      .length > 0 ? of(state).pipe(confirmOperation()) : source
  }),
)

/** 
 * Pack operation parameters
 */
export const packOperationParameters = () => (source: Observable<any>): Observable<any> =>
  source.pipe(

    tap(state => console.log('[+] packOperationParameters', state)),

    // get packed transaction parameters  
    rpc((state: any) => ({
      'url': '/chains/main/blocks/head/helpers/scripts/pack_data',
      'path': 'packOperationParameters',
      'payload': {
        'data': state.operations[state.operations.length - 1].parameters ?
          state.operations[state.operations.length - 1].parameters : {}, type: {}
      },
    })),

    tap(state => console.log('[+] packOperationParameters', state.packOperationParameters))

  )


/** 
 * Get wallet details
 */
// export const getWalletDetail = (fn?: (params: Wallet) => PublicAddress) => (source: Observable<Wallet>): Observable<Contract> =>
export const getWallet = () => (source: Observable<any>): Observable<any> =>
  source.pipe(

    // get contract info balance 
    rpc((state: any) => ({
      'url': '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/',
      'path': 'getWallet',
    })),

    // show balance
    // tap(state => {
    //   console.log('[+] balance: ' + parseInt(state.getWallet.balance) / 1000000 + ' ꜩ  for: ' + state.wallet.publicKeyHash)
    // })
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

  flatMap(state => of([]).pipe(

    // wait for sodium to initialize
    concatMap(() => Promise.resolve(sodium.ready)),

    // exec callback function and add result state
    map(() => ({
      'wallet': fn(state)
    })),

    catchError(error => {
      console.warn('[initializeWallet][sodium] ready', error)
      return of({ response: error })
    })

  )),


)
