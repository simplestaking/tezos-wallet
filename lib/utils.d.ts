import { Wallet } from './types';
export declare const bs58checkEncode: (prefix: any, payload: any) => string;
export declare const bs58checkDecode: (prefix: any, enc: any) => string;
export declare const concatKeys: (privateKey: any, publicKey: any) => any;
export declare const signOperation: (state: any) => any;
export declare const signOperationTrezor: (state: any) => import("rxjs/internal/Observable").Observable<any>;
export declare const amount: (amount: string) => number | "0";
export declare const keys: (mnemonic?: any, passpharse?: any) => Wallet;
export declare const ready: () => any;
