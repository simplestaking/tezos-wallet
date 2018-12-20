import { Observable } from "rxjs";
import { State } from "../common";
export declare type StateCounter = {
    counter: number;
};
/**
 * Get contract counter
 *
 * @url /chains/main/blocks/head/context/contracts/[publicKeyHash]/counter
 */
export declare const counter: <T extends State>() => (source: Observable<T>) => Observable<T & StateCounter>;
