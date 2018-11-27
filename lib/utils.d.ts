/// <reference types="node" />
import { Wallet } from './types';
import { Observable } from 'rxjs';
export declare const string2buffer: (payload: any) => Buffer;
export declare const bs58checkEncode: (prefix: any, payload: any) => string;
export declare const bs58checkDecode: (prefix: any, enc: any) => string;
export declare const concatKeys: (privateKey: any, publicKey: any) => any;
export declare const publicKeyHash2buffer: (publicKeyHash: any) => {
    curve: number;
    originated: number;
    hash: any;
};
export declare const publicKey2buffer: (publicKey: any) => {
    curve: number;
    hash: any;
};
export declare const signOperation: (state: any) => any;
export declare const signOperationTrezor: (state: any) => Observable<any>;
export declare const amount: (amount: string) => number | "0";
export declare const keys: (mnemonic?: any, passpharse?: any) => Wallet;
export declare const ready: () => any;
