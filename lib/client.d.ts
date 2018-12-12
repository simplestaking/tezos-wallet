import { Observable } from 'rxjs';
import { Wallet, State, Transaction, OperationMetadata, StateHead, StateCounter, StateManagerKey, StateWallet, WalletBase, StateOperation, StateOperations, StateSignOperation, StatePreapplyOperation, StateInjectionOperation, StateWalletDetail, ConfirmOperation, ActivateWallet, StateMempool, StateConfirmOperation, MempoolOperation } from './src/types';
/**
 *  Transaction XTZ from one wallet to another
 */
export declare const transaction: <T extends State>(selector: (state: T) => Transaction) => (source: Observable<T>) => Observable<T & {
    transaction: Transaction;
} & StateCounter & {
    operations: OperationMetadata[];
    manager_key: import("./src/types").ManagerKey;
} & StateOperations & StateHead & StateManagerKey & StateOperation & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
} & StatePreapplyOperation & StateInjectionOperation>;
/**
 *  Set delegation rights to tezos address
 */
export declare const setDelegation: (fn: (state: any) => any) => (source: Observable<any>) => Observable<any>;
/**
 * Originate new delegatable contract from wallet
 */
export declare const originateContract: (fn: (state: any) => any) => (source: Observable<any>) => Observable<any>;
/**
  * Activate wallet
  */
export declare const activateWallet: <T extends State>(fn: (state: T) => ActivateWallet) => (source: Observable<T>) => Observable<T & {
    operations: {
        kind: string;
        pkh: string;
        secret: string;
    }[];
    activateWallet: ActivateWallet;
} & StateOperations & StateHead & StateCounter & StateManagerKey & StateOperation & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
} & StatePreapplyOperation & StateInjectionOperation>;
/**
 * Create operation in blocchain
 */
export declare const operation: () => <T extends State>(source: Observable<T & StateOperations>) => Observable<T & StateOperations & StateHead & StateCounter & StateManagerKey & StateOperation & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
} & StatePreapplyOperation & StateInjectionOperation>;
/**
 * Get head for operation
 */
export declare const head: <T extends State>() => (source: Observable<T>) => Observable<T & StateHead>;
/**
 * Get counter for contract
 */
export declare const counter: <T extends StateWallet>() => (source: Observable<T>) => Observable<T & StateCounter>;
/**
* Get manager key for contract
*/
export declare const managerKey: <T extends StateWallet>() => (source: Observable<T>) => Observable<T & StateManagerKey>;
/**
 * Forge operation in blocchain
 */
export declare const forgeOperation: <T extends State & StateOperations>() => (source: Observable<T>) => Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
}>;
export declare const forgeOperationAtomic: <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => Observable<T & StateOperation>;
export declare const preapplyOperations: <T extends State & StateHead & StateSignOperation>() => (source: Observable<T>) => Observable<T & StatePreapplyOperation>;
export declare const injectOperations: <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => Observable<T & StateInjectionOperation>;
/**
 * Apply and inject operation into node
 */
export declare const applyAndInjectOperation: <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => Observable<T & StateCounter & StatePreapplyOperation & StateInjectionOperation>;
export declare const checkPendingOperations: <T extends State>() => (source: Observable<T>) => Observable<T & StateMempool>;
/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export declare const confirmOperation: <T extends State>(selector: (state: T) => ConfirmOperation) => (source: Observable<T>) => Observable<T>;
export declare function hasRefusedOperationInMempool(this: StateConfirmOperation, operation: MempoolOperation): boolean;
export declare function hasAppliedOperationInMempool(this: StateConfirmOperation, operation: MempoolOperation): boolean;
/**
 * Pack operation parameters
 */
export declare const packOperationParameters: () => (source: Observable<any>) => Observable<any>;
/**
 * Get wallet details
 */
export declare const getWallet: <T extends State>() => (source: Observable<T>) => Observable<T & StateWalletDetail>;
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
export declare const newWallet: () => <T>(source: Observable<T>) => Observable<WalletBase>;
/**
 * Wait for sodium to initialize
 */
export declare const initializeWallet: (selector: (params: StateWallet) => Wallet) => (source: Observable<any>) => Observable<State>;
