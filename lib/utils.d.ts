import { Buffer } from 'buffer';
import { Wallet, Operation } from './types';
export declare const string2buffer: (payload: any) => Buffer;
export declare const bs58checkEncode: (prefix: any, payload: any) => string;
export declare const bs58checkDecode: (prefix: any, enc: any) => string;
export declare const concatKeys: (privateKey: any, publicKey: any) => any;
export declare const publicKeyHash2buffer: (publicKeyHash: any) => {
    curve: number;
    hash: any;
};
export declare const publicKey2buffer: (publicKey: any) => {
    curve: number;
    hash: any;
};
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
export declare const signOperationTrezor: (state: any) => Promise<{}>;
export declare const amount: (amount: any) => any;
export declare const keys: (mnemonic?: any) => Wallet;
