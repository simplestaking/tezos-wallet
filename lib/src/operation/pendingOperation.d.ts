import { Observable } from "rxjs";
import { State, Mempool, PendingOperation } from "../common";
export declare type StateMempool = {
    mempool: Mempool;
};
export declare type StatePendingOperation = {
    pendingOperation: PendingOperation;
};
/**
 * Gets list of applied and refused operations in mempool for specific wallet
 * @param selector method returning operation object with public key used as filter
 */
export declare const pendingOperation: <T extends State>(selector: (state: T) => PendingOperation) => (source: Observable<T>) => Observable<{
    applied: import("../src/common/state").MempoolOperation[];
    refused: import("../src/common/state").MempoolOperation[];
}>;
/**
 * Gets mempool operations
 *
 * @url /chains/main/mempool/pending_operations
 */
export declare const pendingOperationsAtomic: <T extends State>() => (source: Observable<T>) => Observable<T & StateMempool>;
