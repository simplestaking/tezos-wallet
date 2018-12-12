import { Observable, of, throwError } from 'rxjs';
import { tap, map, flatMap, concatMap, delay, catchError } from 'rxjs/operators';

import * as sodium from 'libsodium-wrappers'
import * as utils from './utils'
import { rpc } from './rpc'

import { Wallet, State, Transaction, OperationMetadata, StateHead, StateCounter, StateManagerKey, StateWallet, WalletBase, StateOperation, StateOperations, Config, StateSignOperation, StatePreapplyOperation, StateInjectionOperation, StateWalletDetail, ProcessingError, ConfirmOperation, ActivateWallet, StateMempool, StateConfirmOperation, MempoolOperation } from './src/types'
import { WalletType } from './src/enums';


/**
 *  Transaction XTZ from one wallet to another
 */
export const transaction = <T extends State>(selector: (state: T) => Transaction) => (source: Observable<T>) => source.pipe(

  map(state => ({
    ...state,
    transaction: selector(state)
  })),

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
    const operations: OperationMetadata[] = [];

    if (state.manager_key.key === undefined) {
      operations.push({
        kind: "reveal",
        public_key: state.wallet.publicKey,
        source: state.wallet.publicKeyHash,
        fee: "10000",
        gas_limit: "15000",
        storage_limit: "277",
        counter: (++state.counter).toString()
      })
    }

    operations.push({
      kind: "transaction",
      source: state.wallet.publicKeyHash,
      destination: state.transaction.to,
      amount: utils.parseAmount(state.transaction.amount).toString(),
      fee: utils.parseAmount(state.transaction.fee).toString(),
      gas_limit: "11000", // "250000", 
      storage_limit: "277",
      parameters: state.transaction.parameters,
      counter: (++state.counter).toString()
    });

    return {
      ...state,
      operations: operations
    }
  }),
  // tap((state: any) => console.log("[+] trasaction: operation " , state.operations)),

  // create operation 
  operation()
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
        "fee": utils.parseAmount(state.setDelegate.fee).toString(),
        "gas_limit": "10100",
        "storage_limit": "277",
        "counter": (++state.counter).toString(),
      })
    }

    operations.push({
      "kind": "delegation",
      "source": state.wallet.publicKeyHash,
      "fee": utils.parseAmount(state.setDelegate.fee).toString(),
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
        "fee": utils.parseAmount(state.originateContract.fee).toString(),
        "gas_limit": "10100",
        "storage_limit": "277",
        "counter": (++state.counter).toString(),
      })
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
export const activateWallet = <T extends State>(fn: (state: T) => ActivateWallet) => (source: Observable<T>) => source.pipe(

  map(state => ({
    ...state,
    activateWallet: fn(state)
  })),

  // prepare config for operation
  map(state => {
    const operations = []

    operations.push({
      kind: "activate_account",
      pkh: state.wallet.publicKeyHash,
      secret: state.activateWallet.secret
    })

    return {
      ...state,
      operations: operations
    }

  }),

  // create operation 
  operation()
)

/**
 * Create operation in blocchain
 */
export const operation = () => <T extends State>(source: Observable<T & StateOperations>) => source.pipe(

  // create operation
  forgeOperation(),

  // apply & inject operation
  applyAndInjectOperation()
)

/**
 * Get head for operation
 */
export const head = <T extends State>() => (source: Observable<T>) => source.pipe(

  // get head
  rpc<T>((state: T) => ({
    url: '/chains/main/blocks/head',
    path: 'head',
  }))
) as Observable<T & StateHead>

/**
 * Get counter for contract  
 */
export const counter = <T extends StateWallet>() => (source: Observable<T>) => source.pipe(

  // get counter for contract
  rpc<T>((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/counter',
    path: 'counter',
  }))
) as Observable<T & StateCounter>

/**
* Get manager key for contract 
*/
export const managerKey = <T extends StateWallet>() => (source: Observable<T>) => source.pipe(

  // get manager key for contract 
  rpc<T>((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/manager_key',
    path: 'manager_key' // @TODO: should not be 'manager' ??
  }))
) as Observable<T & StateManagerKey>


/**
 * Forge operation in blocchain
 */
export const forgeOperation = <T extends State & StateOperations>() => (source: Observable<T>) => source.pipe(

  // get head and counter
  head(),

  // @TODO: do we need special counter here?
  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  forgeOperationAtomic(),

  // add signature to state 
  // 
  // TODO: move and just keep signOperation and create logic inside utils 
  // tap(state => console.log('[operation]', state.walletType, state)),
  flatMap(state => {

    if (state.wallet.type === WalletType.TREZOR_T) {
      return utils.signOperationTrezor(state);

    } else {
      return utils.signOperation(state);
    }
  })
)

export const forgeOperationAtomic = <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => source.pipe(

  // create operation
  rpc<T>(state => ({
    url: '/chains/' + state.head.chain_id + '/blocks/' + state.head.hash + '/helpers/forge/operations',
    path: 'operation',
    payload: {
      branch: state.head.hash,
      contents: state.operations
    }
  }))
) as Observable<T & StateOperation>


export const preapplyOperations = <T extends State & StateHead & StateSignOperation>() => (source: Observable<T>) => source.pipe(

  rpc<T>((state) => ({
    url: '/chains/main/blocks/head/helpers/preapply/operations',
    path: 'preapply',
    payload: [{
      protocol: state.head.protocol,
      branch: state.head.hash,
      contents: state.operations,
      signature: state.signOperation.signature
    }]
  }))
) as Observable<T & StatePreapplyOperation>

export const injectOperations = <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => source.pipe(
  rpc<T>((state) => ({
    url: '/injection/operation',
    path: 'injectionOperation',
    payload: `"${state.signOperation.signedOperationContents}"`
  }))
) as Observable<T & StateInjectionOperation>


/**
 * Apply and inject operation into node
 */
export const applyAndInjectOperation = <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => source.pipe(

  //get counter
  counter(),

  // preapply operation
  preapplyOperations(),

  tap((state) => console.log("[+] operation: preapply ", state.preapply[0].contents[0].metadata.operation_result)),

  // check for errors
  flatMap(state => {
    const result = state.preapply[0].contents[0].metadata;
    
    // @@TODO: no such a field as operation_result
    return result.operation_result && result.operation_result.status === "failed" ?
      throwError({ response: result.operation_result.errors }) :
      of(state)
  }),

  // inject operation
  injectOperations(),

  tap((state) => console.log("[+] operation: " + state.wallet.node.tzscan.url + state.injectionOperation))
);


export const checkPendingOperations = <T extends State>() => (source: Observable<T>) => source.pipe(

  rpc<T>(() => ({
    url: '/chains/main/mempool/pending_operations',
    path: 'mempool'
  }))
) as Observable<T & StateMempool>


/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export const confirmOperation = <T extends State>(selector: (state: T) => ConfirmOperation) => (source: Observable<T>): Observable<T> => source.pipe(

  map(state => ({
    ...state,
    // why?? confirmOperation is never created other way
    //confirmOperation: (fn && typeof fn === 'function') ? fn(state) : state.confirmOperation
    confirmOperation: selector(state)
  })),

  tap((state) => console.log('[-] pending: operation "' + state.confirmOperation.injectionOperation + '"')),

  // wait 3 sec for operation 
  delay(3000),

  // call node and look for operation in mempool
  checkPendingOperations(),

  // if we find operation in mempool call confirmOperation() again
  flatMap((state) => {
    // check if operation is refused
    if (state.mempool.refused.filter(hasRefusedOperationInMempool, state).length > 0) {
      console.error('[-] operation refused: ', state.mempool.refused, state.confirmOperation.injectionOperation)

      return throwError(state.mempool.refused);
    } else {

      return state.mempool.applied.filter(hasAppliedOperationInMempool, state).length > 0 ?
        of(state).pipe(
          confirmOperation(selector)
        ) :
        source
    }
  })
)

export function hasRefusedOperationInMempool(this: StateConfirmOperation, operation: MempoolOperation) {
  return this.confirmOperation.injectionOperation === operation.hash;
};

export function hasAppliedOperationInMempool(this: StateConfirmOperation, operation: MempoolOperation) {
  return this.confirmOperation.injectionOperation === operation.hash;
}

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
export const getWallet = <T extends State>() => (source: Observable<T>) =>
  source.pipe(

    // get contract info balance 
    rpc<T>(state => ({
      url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/',
      path: 'getWallet'
    })),

    // show balance
    // tap(state => {
    //   console.log('[+] balance: ' + parseInt(state.getWallet.balance) / 1000000 + ' ꜩ  for: ' + state.wallet.publicKeyHash)
    // })
  ) as Observable<T & StateWalletDetail>


/**
 * Generate new menomonic, private, public key & tezos wallet address 
 */
export const newWallet = () => <T>(source: Observable<T>): Observable<WalletBase> => source.pipe(

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
export const initializeWallet = (selector: (params: StateWallet) => Wallet) => (source: Observable<any>): Observable<State> => source.pipe(
  flatMap(state => of({}).pipe(

    // wait for sodium to initialize
    concatMap(() => Promise.resolve(sodium.ready)),

    // exec callback function and add result state
    map(() => ({
      wallet: selector(state)
    })),

    catchError((error: any) => {
      console.warn('[initializeWallet][sodium] ready', error)

      // this might not work. Why we do not propagate error further?
      return of({
        ...state,
        response: error
      })
      //return throwError(error);
    })
  ))
)
