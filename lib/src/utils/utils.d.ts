/// <reference types="node" />
import { WalletBase } from '../types';
/**
 * Prefix table
 */
export declare const prefix: {
    tz1: Uint8Array;
    tz2: Uint8Array;
    tz3: Uint8Array;
    KT1: Uint8Array;
    B: Uint8Array;
    edpk: Uint8Array;
    sppk: Uint8Array;
    p2pk: Uint8Array;
    edsk64: Uint8Array;
    edsk32: Uint8Array;
    edsig: Uint8Array;
    operation: Uint8Array;
};
/**
 * Encode byte array into base58check format using defined prefix
 * @param prefix
 * @param payload
 */
export declare function bs58checkEncode(this: void, prefix: Uint8Array, payload: Uint8Array): string;
/**
 * Decodes base58 encoded string into byte array and removes defined prefix
 * @param prefix
 * @param encoded
 */
export declare function base58CheckDecode(this: void, prefix: Uint8Array, encoded: string): Buffer;
/**
 * Concat together private and public key
 * @param privateKey
 * @param publicKey
 */
export declare function concatKeys(this: void, privateKey: Uint8Array, publicKey: Uint8Array): Uint8Array;
/**
 * Convert string amount notation into number in milions
 * @param amount text amount (3.50 tez)
 */
export declare function parseAmount(this: void, amount: string): number;
/**
 * Generates wallet new wallet or uses provided mnemonic and password
 * @param mnemonic mnemonics joined with spaces (['a','b'].join(' '))
 * @param passpharse
 */
export declare function keys(): WalletBase;
export declare function keys(mnemonic: string, password: string): WalletBase;
export declare const ready: () => Promise<void>;
