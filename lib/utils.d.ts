import { Wallet, Operation } from './types';
export declare const bs58checkEncode: (prefix: any, payload: any) => string;
export declare const bs58checkDecode: (prefix: any, enc: any) => string;
export declare const concatKeys: (privateKey: any, publicKey: any) => any;
export declare const signOperation: (state: Operation) => {
    signature: string;
    signedOperationContents: string;
    operationHash: string;
    operation: string;
    mnemonic?: string | undefined;
    secretKey: string;
    publicKey: string;
    publicKeyHash: string;
};
export declare const amount: (amount: number) => string | 0;
export declare const keys: (mnemonic?: any) => Wallet;
