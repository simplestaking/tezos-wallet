import { Observable } from "rxjs";
import { State, OriginateContract } from "../common";
import { StateOperations } from "../operation";
import { StateCounter } from "./getContractCounter";
import { StateManagerKey } from './getContractManagerKey';
export declare type StateOriginateContract = {
    originateContract: OriginateContract;
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
export declare const originateContract: <T extends State>(selector: (state: T) => OriginateContract) => (source: Observable<T>) => Observable<T & StateOriginateContract & StateCounter & StateManagerKey & StateOperations & import("../src/head/getHead").StateHead & import("../src/operation/forgeOperation").StateOperation & State & import("../src/operation/signOperation").StateSignOperation & import("../src/operation/applyInjectOperation").StatePreapplyOperation & import("../src/operation/applyInjectOperation").StateInjectionOperation>;
