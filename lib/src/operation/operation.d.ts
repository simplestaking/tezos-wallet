import { Observable } from "rxjs";
import { OperationMetadata, State } from "../common";
export declare type StateOperations = {
    operations: OperationMetadata[];
};
/**
 * Create operation in blockchain.
 * Fully forge operation, validates it and inject into blockchain
 */
export declare const operation: () => <T extends State & StateOperations>(source: Observable<T>) => Observable<T & import("../src/head/getHead").StateHead & import("../src/contract/getContractCounter").StateCounter & import("../src/contract/getContractManagerKey").StateManagerKey & import("../src/operation/forgeOperation").StateOperation & State & import("../src/operation/signOperation").StateSignOperation & import("../src/operation/applyInjectOperation").StatePreapplyOperation & import("../src/operation/applyInjectOperation").StateInjectionOperation>;
