interface BaseOperationMetadata {
    source: string
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
    destination: string
    parameters?: Record<string, any>
    parameters_manager?: ParametersManager

}

export interface OriginationOperationMetadata extends BaseOperationMetadata {
    kind: 'origination'
    manager_pubkey: string
    balance: string
    delegate?: string
    script: Record<string, any>
}

export interface DelegationOperationMetadata extends BaseOperationMetadata {
    kind: 'delegation'
    delegate?: string
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

export type ContractBalanceUpdate = {
    kind: "contract",
    contract: string,
    change: string // stringified number
};

export type FeeBalanceUpdate = {
    kind: "freezer",
    category: "fees",
    delegate: string,
    level: number,
    change: string // stringified number
};

export type ParametersManager = {
    set_delegate?: string;
    cancel_delegate?: boolean;
    transfer?: ParametersManagerTransfer
};

export type ParametersManagerTransfer = {
    destination: string;
    amount: number;
};

export type BalanceUpdate = ContractBalanceUpdate | FeeBalanceUpdate;

export type OperationValidationResult = OperationMetadata & {
    metadata: {
        balance_updates: never[]
        operation_result: {
            status: "applied" | "failed" | "backtracked"
            balance_updates: ContractBalanceUpdate[]
            errors: any
            consumed_gas: string // stringified number
            storage_size?: string // stringified number
            originated_contracts?: string
        }
    }
};

export type OperationApplicationResult = OperationValidationResult & {
    balance_updates: BalanceUpdate[]
}

// ?
type TrezorOperationTarget = {
    tag: number
    hash: Uint8Array | null
}

export type TrezorRevealOperation = {
    source: string
    public_key: string
    fee: number
    counter: number
    gas_limit: number
    storage_limit: number
}

export type TrezorTransactionOperation = {
    source: string
    destination: string
    amount: number
    fee: number
    counter: number
    gas_limit: number
    storage_limit: number
    parameters_manager?: ParametersManager
}

export type TrezorOriginationOperation = {
    source: string
    manager_pubkey: string
    balance: number
    // script: string
    fee: number
    counter: number
    gas_limit: number
    storage_limit: number
}

export type TrezorDelegationOperation = {
    source: string
    delegate: string
    fee: number
    counter: number
    gas_limit: number
    storage_limit: number
}
