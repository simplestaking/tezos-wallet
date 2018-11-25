export interface Wallet {
    mnemonic?: string;
    secretKey: string;
    publicKey: string;
    publicKeyHash: string;
}
export interface Contract extends Wallet {
    manager: string;
    balance: any;
    spendable: boolean;
    delegate: {
        setable: boolean;
    };
    counter: number;
}
export interface Transfer {
    secretKey: string;
    publicKey: string;
    publicKeyHash: string;
    to: string;
    amount: number;
}
export interface Operation extends Wallet {
    operation: string;
}
export interface PublicAddress {
    publicKeyHash: string;
}
export interface Config {
    secretKey?: string;
    publicKey: string;
    publicKeyHash: string;
    node: TezosNode;
    type: WalletType;
    path?: string;
}
export interface TezosNode {
    display: string;
    name: string;
    url: string;
    tzscan: TZScanNode;
}
export interface TZScanNode {
    url: string;
    operations?: string;
    operations_number?: string;
    block_timestamp?: string;
}
export declare type WalletType = "web" | "TREZOR_ONE" | "TREZOR_T";
