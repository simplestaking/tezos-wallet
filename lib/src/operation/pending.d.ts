import { Observable } from "rxjs";
import { State, StateMempool, PendingOperation } from "../types";
export declare const pendingOperationsAtomic: <T extends State>() => (source: Observable<T>) => Observable<T & StateMempool>;
export declare const pendingOperation: <T extends State>(selector: (state: T) => PendingOperation) => (source: Observable<T>) => Observable<{
    applied: import("../src/types/state").MempoolOperation[];
    refused: import("../src/types/state").MempoolOperation[];
}>;
