export interface Config {
    secretKey: string,
    publicKey: string,
    publicKeyHash: string,
    node: TezosNode,
    type: 'web' | 'TREZOR_T' | 'TREZOR_P',
    path?: string,
}

export interface TezosNode {
    display: string,
    name: string,
    url: string,
    tzstats: TZStatsNode,
}

export interface TZStatsNode {
    url: string,
}