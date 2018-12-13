import { Observable } from "rxjs";
import { State, StateOperations, StatePackOperationParameters } from "../types";
/**
 * Pack operation parameters
 */
export declare const packOperationParameters: <T extends State & StateOperations>() => (source: Observable<T>) => Observable<T & StatePackOperationParameters>;
