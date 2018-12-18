import { TrezorOperation } from "./operations";
import { WalletType } from "../utils/enums";
import { State } from "./state";

export * from './operations';
export * from './state';

export interface WalletBase {
    mnemonic?: string
    secretKey: string
    publicKey: string
    publicKeyHash: string
}

// export interface Contract extends WalletBase {
//     manager: string
//     balance: any
//     spendable: boolean
//     delegate: {
//         setable: boolean
//     }
//     counter: number
// }

// export interface Transfer {
//     secretKey: string
//     publicKey: string
//     publicKeyHash: string
//     to: string;
//     amount: number
// }

// export interface Operation extends WalletBase {
//     operation: string;
// }

// export interface PublicAddress {
//     publicKeyHash: string
// }

export interface Config {
    secretKey: string,
    publicKey: string,
    publicKeyHash: string,
    node: TezosNode,
    type: 'web' | 'TREZOR_T' | 'TREZOR_P',
    path?: string,
}

export interface TezosNode {
    display: string,
    name: string,
    url: string,
    tzscan: TZScanNode,
}

export interface TZScanNode {
    url: string,
    operations?: string,
    operations_number?: string,
    block_timestamp?: string,
}

export interface TrezorMessage {
    path: string
    // curve: number,
    branch: any
    operation: TrezorOperation
}


export interface RpcParams {
    path: string
    url: string
    payload?: any
}

export interface TrezorConnectResponse {
    payload: {
        signature: string,
        sig_op_contents: string,
        operation_hash: string,
        error?: any
    }
}

export type RpcError = {
    response: {
        id: string
    }[]
    state: State
}