import { Observable } from "rxjs";
import { State, PackOperationParameters } from "../common";
import { StateOperations } from "./operation";
export declare type StatePackOperationParameters = {
    packOperationParameters: PackOperationParameters;
};
/**
 * Serialize operation parameters into binary format
 */
export declare const packOperationParameters: <T extends State & StateOperations>() => (source: Observable<T>) => Observable<T & StatePackOperationParameters>;
