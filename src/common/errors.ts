import { State } from "./state";

export type RpcError<S = State> = {
    response: {
        id: string
        [k: string]: any
    }[]
    state: S
}

export type ValidationError<S = State> = {
    response: {
        id: string
        [k: string]: any
    }[]
    state: S
}

export type InjectionError<S = State> = {
    response: {
        id: string
        [k: string]: any
    }[]
    state: S
}