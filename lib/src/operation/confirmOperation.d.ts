import { Observable } from "rxjs";
import { State, ConfirmOperation, InjectionOperation } from "../common";
export declare type StateConfirmOperation = {
    confirmOperation: {
        injectionOperation: InjectionOperation;
    };
};
/**
 * Wait until operation is confirmed & moved from mempool to head
 *
 * Polls mempool to check when operation is confirmed and moved to head
 * @param selector method returning operation hash to check in mempool
 */
export declare const confirmOperation: <T extends State>(selector: (state: T) => ConfirmOperation) => (source: Observable<T>) => Observable<T>;
