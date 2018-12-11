import { OperationMetadata, RpcParams, TezosNode } from ".";
import { WalletType } from "../enums";



export interface State {
    activateWallet?: ActivateWallet
    confirmOperation?: InjectionOperation
    counter?: number
    getWallet?: WalletDetail
    head?: Head
    injectionOperation?: ConfirmOperation
    manager_key?: ManagerKey
    mempool?: Mempool
    operation?: string
    operations?: OperationMetadata[]
    preapply?: PreapplyOperation[]
    rpc?: RpcParams
    signOperation?: SignOperation
    transaction?: Transaction
    wallet: Wallet
};

export type ActivateWallet = {
    secret: string
}

export type ConfirmOperation = {
    injectionOperation: InjectionOperation
}

export type WalletDetail = {
    balance: number
}

export type Head = {
    hash: string
    chain_id: string
    protocol: string
}

export type InjectionOperation = {

}

export type MempoolOperation = {
    hash: string
}

export type Mempool = {
    applied: MempoolOperation[]
    refused: MempoolOperation[]
}

export type ManagerKey = {
    key?: any
}

export type PreapplyOperation = {
    contents: {
        metadata: {
            operation_result: any
        }
    }[]
}

export type SignOperation = {
    signature: string
    signedOperationContents: string
    operationHash: string
}

export type Transaction = {
    amount: string
    fee: string
    to: string
    parameters?: Record<string, any>
}
export type Wallet = {
    mnemonic?: string
    path?: string
    node: TezosNode,
    publicKey: string
    publicKeyHash: string
    secret?: string
    secretKey: string
    type?: WalletType
}

export type StateActivateWallet = {
    activateWallet: ActivateWallet
}

export type StateConfirmOperation = {
    confirmOperation: {
        injectionOperation: InjectionOperation
    }
}

export type StateWalletDetail = {
    getWallet: WalletDetail
}

export type StateHead = {
    head: Head
}

export type StateOperation = {
    operation: string
}

export type StateOperations = {
    operations: OperationMetadata[]
}

export type StateCounter = {
    counter: number
}

export type StateManagerKey = {
    manager_key: ManagerKey
}

export type StateMempool = {
    mempool: Mempool
}

export type StateWallet = {
    wallet: Wallet
}

export type StateSignOperation = {
    signOperation: SignOperation
}

export type StatePreapplyOperation = {
    preapply: PreapplyOperation
}

export type StateInjectionOperation = {
    injectionOperation: InjectionOperation
}

export type ProcessingError = State & {
    response: {
        id: string
    }[]
}