import { State, TrezorRevealOperation, TrezorTransactionOperation, TrezorOriginationOperation, TrezorDelegationOperation, SignOperation } from "../common";
import { StateHead } from '../head';
import { StateOperation } from '../operation';
export interface TrezorMessage {
    path: string;
    branch: any;
    operation: {
        reveal?: TrezorRevealOperation;
        transaction?: TrezorTransactionOperation;
        origination?: TrezorOriginationOperation;
        delegation?: TrezorDelegationOperation;
    };
}
export interface TrezorConnectResponse {
    payload: {
        signature: string;
        sig_op_contents: string;
        operation_hash: string;
        error?: any;
    };
}
export declare type StateSignOperation = {
    signOperation: SignOperation;
};
/**
 * Sign operation in state. Software signing is used.
 * @param state transaction state
 * @throws TypeError when operation is not available in state
 */
export declare function signOperation<T extends State & StateHead & StateOperation>(state: T): import("../../../../../../../Users/jozef/workspace/simplestaking/tezos-wallet/node_modules/rxjs/internal/Observable").Observable<T & State & StateHead & StateOperation & StateSignOperation>;
/**
 * Sign operation using hardware Trezor wallet
 * @param state transaction state
 * @throws Typerror when operation is not available
 */
export declare function signOperationTrezor<T extends State & StateHead & StateOperation>(state: T): import("../../../../../../../Users/jozef/workspace/simplestaking/tezos-wallet/node_modules/rxjs/internal/Observable").Observable<T & State & StateHead & StateOperation & StateSignOperation>;
