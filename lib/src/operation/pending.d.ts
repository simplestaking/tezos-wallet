import { Observable } from "rxjs";
import { State, StateMempool } from "../types";
export declare const checkPendingOperations: <T extends State>() => (source: Observable<T>) => Observable<T & StateMempool>;
