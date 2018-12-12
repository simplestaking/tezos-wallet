/// <reference types="node" />
import { WalletBase } from './src/types';
import { State, StateOperation, StateHead } from './src/types/state';
import { Observable } from 'rxjs';
export declare const string2buffer: (payload: string) => Buffer;
export declare const bs58checkEncode: (prefix: Uint8Array, payload: Uint8Array) => string;
export declare const bs58checkDecode: (prefix: Uint8Array, enc: string) => Buffer;
export declare const concatKeys: (privateKey: Uint8Array, publicKey: Uint8Array) => Uint8Array;
export declare const signOperation: <T extends State & StateHead & StateOperation>(state: T) => Observable<T & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
}>;
export declare const signOperationTrezor: <T extends State & StateHead & StateOperation>(state: T) => Observable<T & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
}>;
export declare const parseAmount: (amount: string) => number;
export declare const keys: (mnemonic?: string | undefined, passpharse?: string | undefined) => WalletBase;
export declare const ready: () => Promise<void>;
