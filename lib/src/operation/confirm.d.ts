import { Observable } from "rxjs";
import { State, ConfirmOperation } from "../types";
/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export declare const confirmOperation: <T extends State>(selector: (state: T) => ConfirmOperation) => (source: Observable<T>) => Observable<T>;
