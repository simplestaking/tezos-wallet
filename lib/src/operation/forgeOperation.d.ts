import { Observable } from "rxjs";
import { State } from "../common";
import { StateHead } from "../head";
import { StateOperations } from "./operation";
import { StateManagerKey, StateSignOperation, StateCounter } from '..';
export declare type StateOperation = {
    operation: string;
};
/**
 * Forge operation in blocchain.
 * Converts operation into binary format and signs operation using script or Trezor
 *
 *
 */
export declare const forgeOperation: <T extends State & StateOperations>() => (source: Observable<T>) => Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & State & StateSignOperation>;
