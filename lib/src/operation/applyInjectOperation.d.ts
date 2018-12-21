import { Observable } from "rxjs";
import { State, PreapplyOperation, InjectionOperation } from "../common";
import { StateHead } from '../head';
import { StateOperations } from "./operation";
import { StateSignOperation } from "./signOperation";
import { StateCounter } from '..';
export declare type StatePreapplyOperation = {
    preapply: PreapplyOperation;
};
export declare type StateInjectionOperation = {
    injectionOperation: InjectionOperation;
};
/**
 * Validates and inject operation into tezos blockain
 * Can be applied to any prepared operation
 *
 * @throws error when operation validation fails on node
 */
export declare const applyAndInjectOperation: <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => Observable<T & StateCounter & StatePreapplyOperation & StateInjectionOperation>;
