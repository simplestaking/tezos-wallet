import sodium from 'libsodium-wrappers'
import * as bs58check from 'bs58check'
import * as bip39 from 'bip39'

import { Buffer } from 'buffer'
import { Wallet, Operation, } from './types'


const prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    edsk64: new Uint8Array([43, 246, 78, 7]),
    edsk32: new Uint8Array([13, 15, 58, 7]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    operation: new Uint8Array([5, 116]),
}

export const bs58checkEncode = (prefix: any, payload: any) => {
    let n: any = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(new Buffer(n, 'hex'));
}

export const bs58checkDecode = (prefix: any, enc: any) => {
    return bs58check.decode(enc).slice(prefix.length);;
}

export const concatKeys = (privateKey: any, publicKey: any) => {
    let n: any = new Uint8Array(privateKey.length + publicKey.length);
    n.set(privateKey);
    n.set(publicKey, privateKey.length);
    return n;
}

// sign operation 
export const signOperation = (state: Operation) => {

    let operation = sodium.from_hex(state.operation);
    let secretKey = bs58checkDecode(prefix.edsk32, state.secretKey);
    let publicKey = bs58checkDecode(prefix.edpk, state.publicKey);

    // ed25516
    let sig = sodium.crypto_sign_detached(
        sodium.crypto_generichash(32, operation),
        concatKeys(secretKey, publicKey),
        'uint8array'
    );

    let signature = bs58checkEncode(prefix.edsig, sig);
    let signedOperationContents = state.operation + sodium.to_hex(sig);

    let operationHash = bs58checkEncode(
        prefix.operation,
        // blake2b
        sodium.crypto_generichash(32, sodium.from_hex(signedOperationContents)),
    );

    return {
        ...state,
        signature: signature,
        signedOperationContents: signedOperationContents,
        operationHash: operationHash,
    }
}

export const amount = (amount: number) => {
    return amount === 0 ? 0 : "" + (+amount * +1000000) + ""; // 1 000 000 = 1.00 tez
}

export const keys = (mnemonic?: any): Wallet => {

    mnemonic = mnemonic ? mnemonic : bip39.generateMnemonic(160)
    
    let seed = bip39.mnemonicToSeed(mnemonic, '').slice(0, 32)
    // ED25516 
    let keyPair = sodium.crypto_sign_seed_keypair(seed, 'uint8array')
    // remove publicKey
    let privateKey = keyPair.privateKey.slice(0, 32)
    return {
        mnemonic: mnemonic,
        secretKey: bs58checkEncode(prefix.edsk32, privateKey),
        publicKey: bs58checkEncode(prefix.edpk, keyPair.publicKey),
        publicKeyHash: bs58checkEncode(
            prefix.tz1,
            // blake2b algo
            sodium.crypto_generichash(20, keyPair.publicKey)
        ),
    }

}
