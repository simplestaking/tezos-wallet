interface BaseOperationMetadata {
    source: any
    fee: string
    counter: string
    gas_limit: string
    storage_limit: string
}

export interface RevealOperationMetadata extends BaseOperationMetadata {
    kind: 'reveal'
    public_key: string
}

export interface TransactionOperationMetadata extends BaseOperationMetadata {
    kind: 'transaction'
    amount: string
    destination: any
    parameters?: Record<string, any>
}

export interface OriginationOperationMetadata extends BaseOperationMetadata {
    kind: 'origination'
    manager_pubkey?: string
    managerPubkey?: string
    balance: string
    spendable: boolean
    delegatable: boolean
    delegate: any
}

export interface DelegationOperationMetadata extends BaseOperationMetadata {
    kind: 'delegation'
    delegate?: any
}

export interface ActivateWalletOperationMetadata {
    kind: 'activate_account'
    pkh: string
    secret: string
}

export type OperationMetadata = BaseOperationMetadata &
    (
        RevealOperationMetadata |
        TransactionOperationMetadata |
        OriginationOperationMetadata |
        DelegationOperationMetadata | 
        ActivateWalletOperationMetadata
    );

type TrezorOperationTarget = {
    tag: number
    hash: Uint8Array | null
}

export type TrezorRevealOperation = {
        source: TrezorOperationTarget
        public_key: string
        fee: number
        counter: number
        gas_limit: number
        storage_limit: number    
}

export type TrezorTransactionOperation = {
        source: TrezorOperationTarget
        destination: TrezorOperationTarget
        amount: number
        fee: number
        counter: number
        gas_limit: number
        storage_limit: number    
}

export type TrezorOriginationOperation = {
        source: TrezorOperationTarget
        manager_pubkey: string
        balance: number
        spendable: boolean
        delegatable: boolean
        delegate: Uint8Array | null
        fee: number
        counter: number
        gas_limit: number
        storage_limit: number    
}

export type TrezorDelegationOperation = {
        source: TrezorOperationTarget
        delegate: Uint8Array | null
        fee: number
        counter: number
        gas_limit: number
        storage_limit: number    
}
