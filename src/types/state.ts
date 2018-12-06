import { Head, TrezorOperation, SignOperation, OperationMetadata } from ".";



export interface State {
    head?: Head
    operation?: string
    operations?: OperationMetadata[]
    signOperation?: SignOperation
    wallet: Wallet
};

export type Wallet = {
    secretKey: string
    publicKey: string
    path: string
}

export type StateHead = {
    head: Head
}

export type StateOperation = {
    operation: string
}

export type StateOperations = {
    operations: TrezorOperation[]
}