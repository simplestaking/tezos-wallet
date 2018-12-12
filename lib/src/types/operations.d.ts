interface BaseOperationMetadata {
    source: any;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
}
export interface RevealOperationMetadata extends BaseOperationMetadata {
    kind: 'reveal';
    public_key: string;
}
export interface TransactionOperationMetadata extends BaseOperationMetadata {
    kind: 'transaction';
    amount: string;
    destination: any;
    parameters?: Record<string, any>;
}
export interface OriginationOperationMetadata extends BaseOperationMetadata {
    kind: 'origination';
    manager_pubkey?: any;
    managerPubkey?: any;
    balance: string;
    spendable: boolean;
    delegatable: boolean;
    delegate: any;
}
export interface DelegationOperationMetadata extends BaseOperationMetadata {
    kind: 'delegation';
    delegate?: any;
}
export interface ActivateWalletOperationMetadata {
    kind: 'activate_account';
    pkh: string;
    secret: string;
}
export declare type OperationMetadata = BaseOperationMetadata & (RevealOperationMetadata | TransactionOperationMetadata | OriginationOperationMetadata | DelegationOperationMetadata | ActivateWalletOperationMetadata);
declare type TrezorOperationTarget = {
    tag: number;
    hash: Uint8Array | null;
};
export declare type TrezorRevealOperation = {
    reveal: {
        source: TrezorOperationTarget;
        public_key: string;
        fee: number;
        counter: number;
        gas_limit: number;
        storage_limit: number;
    };
};
export declare type TrezorTransactionOperation = {
    transaction: {
        source: TrezorOperationTarget;
        destination: TrezorOperationTarget;
        amount: number;
        fee: number;
        counter: number;
        gas_limit: number;
        storage_limit: number;
    };
};
export declare type TrezorOriginationOperation = {
    origination: {
        source: TrezorOperationTarget;
        manager_pubkey: Uint8Array | null;
        balance: number;
        spendable: boolean;
        delegatable: boolean;
        delegate: Uint8Array | null;
        fee: number;
        counter: number;
        gas_limit: number;
        storage_limit: number;
    };
};
export declare type TrezorDelegationOperation = {
    delegation: {
        source: TrezorOperationTarget;
        delegate: Uint8Array | null;
        fee: number;
        counter: number;
        gas_limit: number;
        storage_limit: number;
    };
};
export declare type TrezorOperation = TrezorRevealOperation | TrezorTransactionOperation | TrezorOriginationOperation | TrezorDelegationOperation;
export {};
