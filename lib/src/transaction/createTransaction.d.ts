import { Observable } from "rxjs";
import { State, Transaction } from "../common";
import { StateCounter, StateManagerKey } from "../contract";
import { StateOperations } from "../operation";
export declare type StateTransaction = {
    transaction: Transaction;
};
/**
 * Send amount to another wallet
 *
 * Fully covers send useace and get transaction to blockchain
 * @param selector method returning transaction obejct
 *
 * @operation reveal operation when wallet is not activated yet
 * @operation transaction operation
 *
 * @example
 * of({}).
 * initializeWallet(state => { ...wallet }).
 * transaction(state => ({
 *  amount: "20"
 *  to: "wallet address"
 *  fee: "0.01"
 * })).
 * confirmOperation(state => ({
 *  injectionOperation: state.injectionOperation,
 * })).
 * then(state => console.log('amount transfered'))
 *
 */
export declare const transaction: <T extends State>(selector: (state: T) => Transaction) => (source: Observable<T>) => Observable<T & StateTransaction & StateCounter & StateManagerKey & StateOperations & import("../src/head/getHead").StateHead & import("../src/operation/forgeOperation").StateOperation & State & import("../src/operation/signOperation").StateSignOperation & import("../src/operation/applyInjectOperation").StatePreapplyOperation & import("../src/operation/applyInjectOperation").StateInjectionOperation>;
