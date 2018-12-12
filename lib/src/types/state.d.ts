import { OperationMetadata, RpcParams, TezosNode } from ".";
import { WalletType } from "../enums";
export interface State {
    activateWallet?: ActivateWallet;
    confirmOperation?: InjectionOperation;
    counter?: number;
    getWallet?: WalletDetail;
    head?: Head;
    injectionOperation?: ConfirmOperation;
    manager_key?: ManagerKey;
    mempool?: Mempool;
    operation?: string;
    operations?: OperationMetadata[];
    preapply?: PreapplyOperation[];
    rpc?: RpcParams;
    signOperation?: SignOperation;
    transaction?: Transaction;
    wallet: Wallet;
}
export declare type ActivateWallet = {
    secret: string;
};
export declare type ConfirmOperation = {
    injectionOperation: InjectionOperation;
};
export declare type WalletDetail = {
    balance: number;
};
export declare type Head = {
    chain_id: string;
    hash: string;
    header: {
        context: string;
        fitness: [string, string];
        level: number;
        operations_hash: string;
        predecessor: string;
        priority: number;
        proof_of_work_nonce: string;
        proto: number;
        signature: string;
        timestamp: string;
        validation_pass: number;
    };
    metadata: {
        baker: string;
        balance_updates: any[];
        consumed_gas: string;
        deactivated: any[];
        level: any;
        max_block_header_length: number;
        max_operation_data_length: number;
        max_operation_list_length: {
            max_size: number;
            max_op?: number;
        }[];
        max_operations_ttl: number;
        next_protocol: string;
        nonce_hash: string | null;
        protocol: string;
        test_chain_status: {
            status: 'running' | 'not_running';
        };
        voting_period_kind: 'proposal';
    };
    operations: {
        branch: string;
        chain_id: string;
        contents: {
            kind: string;
            level: number;
            metadata: any;
        }[];
        hash: string;
        protocol: string;
        signature: string;
    }[];
    protocol: string;
};
export declare type InjectionOperation = {};
export declare type MempoolOperation = {
    branch: string;
    contents: any;
    hash: string;
    signature: string;
};
export declare type Mempool = {
    applied: MempoolOperation[];
    branch_delayed: MempoolOperation[];
    branch_refused: MempoolOperation[];
    refused: MempoolOperation[];
    unprocessed: MempoolOperation[];
};
export declare type ManagerKey = {
    manager: string;
    key?: string;
};
export declare type PreapplyOperation = {
    contents: {
        metadata: {
            operation_result: any;
        };
    }[];
    signature: string;
};
export declare type SignOperation = {
    signature: string;
    signedOperationContents: string;
    operationHash: string;
};
export declare type Transaction = {
    amount: string;
    fee: string;
    to: string;
    parameters?: Record<string, any>;
};
export declare type Wallet = {
    mnemonic?: string;
    path?: string;
    node: TezosNode;
    publicKey: string;
    publicKeyHash: string;
    secret?: string;
    secretKey: string;
    type?: WalletType;
};
export declare type StateActivateWallet = {
    activateWallet: ActivateWallet;
};
export declare type StateConfirmOperation = {
    confirmOperation: {
        injectionOperation: InjectionOperation;
    };
};
export declare type StateWalletDetail = {
    getWallet: WalletDetail;
};
export declare type StateHead = {
    head: Head;
};
export declare type StateOperation = {
    operation: string;
};
export declare type StateOperations = {
    operations: OperationMetadata[];
};
export declare type StateCounter = {
    counter: number;
};
export declare type StateManagerKey = {
    manager_key: ManagerKey;
};
export declare type StateMempool = {
    mempool: Mempool;
};
export declare type StateWallet = {
    wallet: Wallet;
};
export declare type StateSignOperation = {
    signOperation: SignOperation;
};
export declare type StatePreapplyOperation = {
    preapply: PreapplyOperation;
};
export declare type StateInjectionOperation = {
    injectionOperation: InjectionOperation;
};
export declare type ProcessingError = State & {
    response: {
        id: string;
    }[];
};
