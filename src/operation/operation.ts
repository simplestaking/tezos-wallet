import { Observable } from "rxjs";

import { OperationMetadata, State } from "../common";
import { forgeOperation } from "./forgeOperation";
import { applyAndInjectOperation } from "./applyInjectOperation";

// import {StateHead, StateInjectionOperation, StatePreapplyOperation, StateCounter, StateManagerKey, StateOperation, StateSignOperation} from '..';

export type StateOperations = {
    operations: OperationMetadata[]
  };

/**
 * Create operation in blockchain.
 * Fully forge operation, validates it and inject into blockchain
 */
export const operation = () => <T extends State & StateOperations>(source: Observable<T>) => source.pipe(

    // create operation
    forgeOperation(),

    // apply & inject operation
    applyAndInjectOperation()
)
