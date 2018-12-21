import { Observable } from "rxjs";
import { State, Transaction } from "../common";
import { StateCounter, StateManagerKey } from "../contract";
import { StateOperations } from "../operation";
import { StateInjectionOperation, StatePreapplyOperation, StateSignOperation, StateOperation, StateHead } from '..';
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
export declare const transaction: <T extends State>(selector: (state: T) => Transaction) => (source: Observable<T>) => Observable<T & StateTransaction & StateCounter & StateManagerKey & StateOperations & StateHead & StateOperation & State & StateSignOperation & StatePreapplyOperation & StateInjectionOperation>;
