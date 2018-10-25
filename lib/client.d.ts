import { Observable } from 'rxjs';
import { Wallet } from './types';
/**
 *  Transaction XTZ from one wallet to another
 */
export declare const transaction: (fn: (state: any) => any) => (source: Observable<any>) => Observable<any>;
/**
 *  Set delegation rights to tezos address
 */
export declare const setDelegation: (fn: (state: any) => any) => (source: Observable<any>) => Observable<any>;
/**
 * Originate new delegateble contract from wallet
 */
export declare const originateContract: (fn: (state: any) => any) => (source: Observable<any>) => Observable<{}>;
/**
 * Create operation in blocchain
 */
export declare const operation: () => <T>(source: Observable<Wallet>) => Observable<T>;
/**
 * Get head for operation
 */
export declare const head: () => (source: Observable<any>) => Observable<any>;
/**
 * Get counter for contract
 */
export declare const counter: () => (source: Observable<any>) => Observable<any>;
/**
* Get manager key for contract
*/
export declare const managerKey: () => (source: Observable<any>) => Observable<any>;
/**
 * Forge operation in blocchain
 */
export declare const forgeOperation: () => <T>(source: Observable<Wallet>) => Observable<T>;
/**
 * Apply and inject operation into node
 */
export declare const applyAndInjectOperation: () => (source: Observable<any>) => Observable<any>;
/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export declare const confirmOperation: (fn?: ((state: any) => any) | undefined) => (source: Observable<any>) => any;
/**
 * Get wallet details
 */
export declare const getWallet: () => (source: Observable<any>) => Observable<any>;
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
export declare const newWallet: () => <T>(source: Observable<T>) => Observable<Wallet>;
/**
 * Wait for sodium to initialize
 */
export declare const initializeWallet: (fn: (params: any) => any) => (source: Observable<any>) => Observable<any>;
