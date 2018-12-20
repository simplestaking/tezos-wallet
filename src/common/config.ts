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
    tzscan: TZScanNode,
}

export interface TZScanNode {
    url: string,
    operations?: string,
    operations_number?: string,
    block_timestamp?: string,
}