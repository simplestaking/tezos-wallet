import { Observable } from "rxjs";
import { State, Mempool, PendingOperation, MempoolOperation } from "../common";
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
    applied: MempoolOperation[];
    refused: MempoolOperation[];
}>;
/**
 * Gets mempool operations
 *
 * @url /chains/main/mempool/pending_operations
 */
export declare const pendingOperationsAtomic: <T extends State>() => (source: Observable<T>) => Observable<T & StateMempool>;
