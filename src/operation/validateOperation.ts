import { Observable, of, throwError } from 'rxjs';
import { State, rpc, ValidationResult, OperationValidationResult } from '../common';

import { StateHead } from '../head';
import { StateOperations } from './operation';
import { flatMap } from 'rxjs/operators';
import { signOperationTrezor, signOperation, StateSignOperation } from './signOperation';
import { forgeOperationInternal } from './forgeOperation';

export type StateValidatedOperations = {
  validatedOperations: ValidationResult
}


/**
 * Validates operation on node to ensure, that operation can be executed and prefills gas consumption and storage size data
 * 
 * @throws ValidationError when validation can't succeed with error details
 */
export const validateOperation = <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => source.pipe(

  forgeOperationInternal(),

  // add signature to state     
  flatMap(state => {

    if (state.wallet.type === 'TREZOR_T') {
      return signOperationTrezor(state);

    } else {
      return signOperation(state);
    }
  }),

  validateOperationAtomic(),

  flatMap(state => {

    // update detailes of successfull operations
    state.validatedOperations.contents.
      filter(op => op.metadata.operation_result.status === "applied").
      forEach(validated => {
        // we asume here no batching!
        const operation = state.operations.find(op => op.kind === validated.kind);

        // modify values with simulation results
        if (operation) {

          // use estimated gas from node
          operation.gas_limit = validated.metadata.operation_result.consumed_gas;
          // add storage size to the expected storage consumption (e.g. origination has implicit consumption of 257)  
          operation.storage_limit = (parseInt(operation.storage_limit) + parseInt(validated.metadata.operation_result.storage_size || "0")).toString();

          // fee is not estimated here as we do not know operation byte size yet!
          // operation must be forged to find this out

          console.log('[+] Operation gas consumption set', operation);

        } else {
          // this should never happen...
          console.error("Update operation data failed. Cannot find operation", validated);
        }
      })


    if (state.validatedOperations.contents.every(operationIsValid)) {
      console.log("[+] all operations are valid");

      return of(state);

    } else {
      const invalidOperations = state.validatedOperations.contents.filter(op => !operationIsValid(op));

      console.error("[+] some operation would not be accepted be node", invalidOperations);

      return throwError({
        state,
        // flat map validation errors
        response: invalidOperations.map(op => op.metadata.operation_result.errors[0])
      })
    }
  })

) as Observable<T & StateValidatedOperations>


/**
 * Serialize operation parameters on node
 * 
 * @url /chains/main/blocks/head/helpers/scripts/pack_data
 */
export const validateOperationAtomic = <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => source.pipe(

  rpc<T>((state) => {

    return {
      url: '/chains/main/blocks/head/helpers/scripts/run_operation',
      path: 'validatedOperations',
      payload: {
        branch: state.head.hash,
        contents: state.operations,
        signature: state.signOperation.signature
      }
    }
  })
) as Observable<T & StateValidatedOperations>

export function operationIsValid(operation: OperationValidationResult) {
  return operation.metadata.operation_result.status === "applied";
}
