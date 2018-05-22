export interface PublicAddress {
    publicKeyHash: string
}

export interface Wallet {
    mnemonic?: string
    secretKey: string
    publicKey: string
    publicKeyHash: string
}

export interface Contract extends Wallet {
    manager: string
    balance: any
    spendable: boolean
    delegate: {
        setable: boolean
    }
    counter: number
}

export interface Transfer {
    secretKey: string
    publicKey: string
    publicKeyHash: string
    to: string;
    amount: number
}

export interface Operation extends Wallet {
    operation: string;
}