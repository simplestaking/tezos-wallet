import { State, StateHead, StateOperation } from "../types";
/**
 * Sign operation in state. Software signing is used.
 * @param state transaction state
 */
export declare function signOperation<T extends State & StateHead & StateOperation>(state: T): import("../../../../../../../Users/jozef/workspace/simplestaking/tezos-wallet/node_modules/rxjs/internal/Observable").Observable<any>;
/**
 * Sign operation using hardware Trezor wallet
 * @param state transaction state
 * @throws Typerror
 */
export declare function signOperationTrezor<T extends State & StateHead & StateOperation>(state: T): import("../../../../../../../Users/jozef/workspace/simplestaking/tezos-wallet/node_modules/rxjs/internal/Observable").Observable<any>;
