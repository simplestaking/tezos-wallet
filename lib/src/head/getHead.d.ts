import { Observable } from "rxjs";
import { State, Head } from "../common";
export declare type StateHead = {
    head: Head;
};
/**
 * Get head for operation
 */
export declare const head: <T extends State>() => (source: Observable<T>) => Observable<T & StateHead>;
