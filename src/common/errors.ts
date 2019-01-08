import { State } from "./state";
import { OperationMetadata } from "./operations";

export type ErrorKind = "temporary" | "permanent";

export type RpcError<S = State> = {
    response: {
        id: string
        kind: ErrorKind
        [k: string]: any
    }[]
    state: S
}

export type ValidationError<S = State> = {
    response: {
        id: string
        kind: ErrorKind
        [k: string]: any
    }[]
    state: S
}

export type InjectionError<S = State> = {
    response: {
        id: string
        kind: ErrorKind
        [k: string]: any
    }[]
    state: S
}

export type LowFeeError<S = State> = {
    response: {
      id: "tezos-wallet.fee.insuficient",
      kind: "temporary",
      operation: OperationMetadata
    }[]
    state: S
}