import { TrezorOperation } from "./operations";
import { WalletType } from "../utils/enums";
import { State } from "./state";
export * from './operations';
export * from './state';
export interface WalletBase {
    mnemonic?: string;
    secretKey: string;
    publicKey: string;
    publicKeyHash: string;
}
export interface Config {
    secretKey: string;
    publicKey: string;
    publicKeyHash: string;
    node: TezosNode;
    type: WalletType;
    path?: string;
}
export interface TezosNode {
    display: string;
    name: string;
    url: string;
    tzscan: TZScanNode;
}
export interface TZScanNode {
    url: string;
    operations?: string;
    operations_number?: string;
    block_timestamp?: string;
}
export interface TrezorMessage {
    path: string;
    branch: any;
    operation: TrezorOperation;
}
export interface RpcParams {
    path: string;
    url: string;
    payload?: any;
}
export interface TrezorConnectResponse {
    payload: {
        signature: string;
        sig_op_contents: string;
        operation_hash: string;
        error?: any;
    };
}
export declare type RpcError = {
    response: {
        id: string;
    }[];
    state: State;
};
