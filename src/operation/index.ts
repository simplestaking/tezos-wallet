import { Observable } from "rxjs";

import { State, StateOperations } from "../types";
import { forgeOperation } from "./forge";
import { applyAndInjectOperation } from "./applyInject";

export * from './applyInject';
export * from './forge';
export * from './confirm';
export * from './pack';
export * from './pending';


/**
 * Create operation in blocchain
 */
export const operation = () => <T extends State>(source: Observable<T & StateOperations>) => source.pipe(

    // create operation
    forgeOperation(),

    // apply & inject operation
    applyAndInjectOperation()
);