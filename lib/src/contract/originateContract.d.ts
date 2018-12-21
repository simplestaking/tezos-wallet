import { Observable } from "rxjs";
import { State, OriginatedContract } from "../common";
import { StateOperations } from "../operation";
import { StateCounter } from "./getContractCounter";
import { StateManagerKey } from './getContractManagerKey';
import { StateOperation, StateSignOperation, StatePreapplyOperation, StateInjectionOperation, StateHead } from '..';
export declare type StateOriginateContract = {
    originateContract: OriginatedContract;
};
/**
 * Originate smart contract from implicit wallet. Contract will be used for delegation.
 * Complete operations stack
 *
 * @param selector derives origination data from state
 *
 * @operation reveal for non revealed wallet
 * @operation origination
 *
 * @example
 * of({}).
 * initializeWallet(state => {...wallet details}).
 * originateContract(state => ({
 *  fee: "100"
 *  amount: "5"
 *  to: "some address"
 * }))
 *
 */
export declare const originateContract: <T extends State>(selector: (state: T) => OriginatedContract) => (source: Observable<T>) => Observable<T & StateOriginateContract & StateCounter & StateManagerKey & StateOperations & StateHead & StateOperation & State & StateSignOperation & StatePreapplyOperation & StateInjectionOperation>;
