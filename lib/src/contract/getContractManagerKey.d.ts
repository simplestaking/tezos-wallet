import { Observable } from "rxjs";
import { State, ManagerKey } from "../common";
export declare type StateManagerKey = {
    manager_key: ManagerKey;
};
/**
* Get manager key for contract
*/
export declare const managerKey: <T extends State>() => (source: Observable<T>) => Observable<T & StateManagerKey>;
