import { TrezorOperation, SignOperation, OperationMetadata, RpcParams } from ".";
import { WalletType } from "../enums";



export interface State {
    counter?: number
    head?: Head
    manager_key?: ManagerKey
    operation?: string
    operations?: OperationMetadata[]
    rpc?: RpcParams
    signOperation?: SignOperation
    transaction?: Transaction
    wallet: Wallet
};


export type Head = {
    hash: string
    chain_id: string
}

export type ManagerKey = {
    key?: any
}

export type Wallet = {
    mnemonic?: string
    path?: string
    node: {
        url: string
    }
    publicKey: string
    publicKeyHash: string
    secret?: string
    secretKey: string
    type?: WalletType
}

export type Transaction = {
    amount: string
    fee: string
    to: string
    parameters?: Record<string, any>
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

export type StateWallet = {
    wallet: Wallet    
}

export interface StateWallet2 {
    wallet: Wallet
}