import { OperationMetadata, OperationValidationResult } from "./operations";

import { TezosNode } from './config';
import { RpcParams } from './rpc';


export interface State {
    activateWallet?: ActivatedWallet
    confirmOperation?: ConfirmOperation
    constants?: HeadConstants
    counter?: number
    getWallet?: WalletDetail
    head?: Head
    injectionOperation?: InjectionOperation
    manager_key?: string
    mempool?: Mempool
    originateContract?: OriginatedContract
    operation?: string
    operations?: OperationMetadata[]
    packOperationParameters?: PackOperationParameters
    pendingOperation?: PendingOperation
    preapply?: PreapplyOperation[]
    rpc?: RpcParams
    setDelegate?: SetDelegate
    signOperation?: SignOperation
    transaction?: Transaction
    validatedOperations?: ValidationResult
    wallet: Wallet
};

export type ActivatedWallet = {
    secret: string
}

export type ConfirmOperation = {
    injectionOperation: InjectionOperation
}

export type HeadConstants = {
    proof_of_work_nonce_size: number // 8
    nonce_length: number // 32
    max_revelations_per_block: number // 32
    max_operation_data_length: number // 16384
    max_proposals_per_delegate: number // 20
    preserved_cycles: number // 5
    blocks_per_cycle: number // 128
    blocks_per_commitment: number // 32
    blocks_per_roll_snapshot: number // 8 
    blocks_per_voting_period: number // 32768
    time_between_blocks: string[ ] // ["20"]
    endorsers_per_block: number // 32
    hard_gas_limit_per_operation: string // "4000000"
    hard_gas_limit_per_block: string // "40000000"
    proof_of_work_threshold: string // "70368744177663"
    tokens_per_roll: string // "10000000000"
    michelson_maximum_type_size: number // 1000
    seed_nonce_revelation_tip: string // "125000"
    origination_size: number // 257
    block_security_deposit: string // "512000000"
    endorsement_security_deposit: string // "64000000"
    block_reward: string // "16000000"
    endorsement_reward: string // "2000000"
    cost_per_byte: string // "1000"
    hard_storage_limit_per_operation: string // "600000"
}

export type Head = {
    chain_id: string
    hash: string
    header: {
        context: string
        fitness: [string, string]
        level: number
        operations_hash: string
        predecessor: string
        priority: number
        proof_of_work_nonce: string
        proto: number
        signature: string
        timestamp: string
        validation_pass: number
    }
    metadata: {
        baker: string
        balance_updates: any[] // operations
        consumed_gas: string // number
        deactivated: any[]
        level: any
        max_block_header_length: number
        max_operation_data_length: number
        max_operation_list_length: {
            max_size: number
            max_op?: number
        }[]
        max_operations_ttl: number
        next_protocol: string
        nonce_hash: string | null
        protocol: string // "ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK"
        test_chain_status: {
            status: 'running' | 'not_running'
        }
        voting_period_kind: 'proposal' // ??
    }
    operations: {
        branch: string
        chain_id: string
        contents: {
            kind: string //'endorsment'
            level: number
            metadata: any
        }[]
        hash: string
        protocol: string
        signature: string
    }[]
    protocol: string
}

export type InjectionOperation = {

}

export type MempoolOperation = {
    branch: string
    contents: any // operation
    hash: string
    signature: string
}

export type Mempool = {
    applied: MempoolOperation[]
    branch_delayed: MempoolOperation[]
    branch_refused: MempoolOperation[]
    refused: MempoolOperation[]
    unprocessed: MempoolOperation[]
}

export type OriginatedContract = {
    fee: string
    amount: string
    to: string
    testRun?: boolean
}

export type PackOperationParameters = {

}

export type PendingOperation = {
    publicKeyHash: string
}

export type PreapplyOperation = {
    contents: OperationValidationResult[]
    signature: string
}

export type SetDelegate = {
    fee: string
    to: string
    testRun?: boolean
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
    testRun?: boolean
}

export type ValidationResult = {
   contents: OperationValidationResult[]
}

export type Wallet = {
    mnemonic?: string
    path?: string
    node: TezosNode,
    publicKey?: string
    publicKeyHash: string
    secret?: string
    secretKey?: string
    type?: 'web' | 'TREZOR_T' | 'TREZOR_P'
}


export type WalletDetail = {
    balance: number
}
