import { of } from 'rxjs'
import sodium from 'libsodium-wrappers'
import * as bs58check from 'bs58check'
import * as bip39 from 'bip39'

import { Buffer } from 'buffer'
import { Wallet, Operation, } from './types'

// declare external library
declare var TrezorConnect: any;

const prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    tz2: new Uint8Array([6, 161, 161]),
    tz3: new Uint8Array([6, 161, 164]),
    KT: new Uint8Array([2, 90, 121]),
    B: new Uint8Array([1, 52]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    sppk: new Uint8Array([3, 254, 226, 86]),
    p2pk: new Uint8Array([3, 178, 139, 127]),
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

// convert publicKeyHash to buffer and elliptic curve
export const publicKeyHash2buffer = (publicKeyHash: any) => {

    switch (publicKeyHash.substr(0, 3)) {
        case 'tz1':
            return {
                curve: 0,
                hash: concatKeys(new Uint8Array([0]), bs58checkDecode(prefix.tz1, publicKeyHash))
            }
        case 'tz2':
            return {
                curve: 1,
                hash: concatKeys(new Uint8Array([1]), bs58checkDecode(prefix.tz2, publicKeyHash))
            }
        case 'tz3':
            return {
                curve: 2,
                hash: concatKeys(new Uint8Array([2]), bs58checkDecode(prefix.tz3, publicKeyHash))
            }
        default:
            return {
                curve: -1,
                hash: null,
            }
    }

}

// convert publicKeyHash to buffer and elliptic curve
export const publicKey2buffer = (publicKey: any) => {

    switch (publicKey.substr(0, 4)) {
        case 'edpk':
            return {
                curve: 0,
                hash: concatKeys(new Uint8Array([0]), bs58checkDecode(prefix.edpk, publicKey))
            }
        case 'sppk':
            return {
                curve: 1,
                hash: concatKeys(new Uint8Array([1]), bs58checkDecode(prefix.sppk, publicKey))
            }
        case 'p2pk':
            return {
                curve: 2,
                hash: concatKeys(new Uint8Array([2]), bs58checkDecode(prefix.p2pk, publicKey))
            }
        default:
            return {
                curve: -1,
                hash: null,
            }
    }

}

// sign operation 
export const signOperation = (state: Operation) => {
    // TODO: change secretKey name to privateKey

    let operation = sodium.from_hex(state.operation);
    let secretKey = bs58checkDecode(prefix.edsk32, state.secretKey);
    let publicKey = bs58checkDecode(prefix.edpk, state.publicKey);

    //console.log('[secretKey]', secretKey)
    //console.log('[publicKey]', publicKey)
    //console.log('[operation]', operation)

    // remove publicKey
    if (secretKey.length > 32) secretKey = secretKey.slice(0, 32)
    //debugger;

    // TODO: add all watermarks
    // ed25516
    let sig = sodium.crypto_sign_detached(
        sodium.crypto_generichash(32, concatKeys(new Uint8Array([3]), operation)),
        concatKeys(secretKey, publicKey),
        'uint8array'
    );

    //console.log('[sig]', sig)

    let signature = bs58checkEncode(prefix.edsig, sig);
    //console.log('[signature]', signature)

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

// sign operation 
export const signOperationTrezor = (state: any) => {

    let trezorPopup = new Promise(function (resolve: any, reject: any) {
        type message = {
            path: string,
            curve: number,
            branch: any,
            reveal?: any,
            transaction?: any,
            origination?: any,
            delegation?: any,
        }

        // set basic config
        let message: message = {
            path: "m/44'/1729'/0'/0'/0'",
            curve: publicKeyHash2buffer(state.manager).curve,
            branch: bs58checkDecode(prefix.B, state.head.hash)
        }

        // add operations to message 
        state.operations.map((operation: any) => {

            console.log('[signOperationTrezor] operation', operation)

            if (operation.kind === 'reveal') {
                message = {
                    ...message,
                    // add reveal to operation 
                    reveal: {
                        source: {
                            tag: 0,
                            hash: publicKeyHash2buffer(operation.source).hash,
                        },
                        public_key: publicKey2buffer(operation.public_key).hash,
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    },
                }
            }

            if (operation.kind === 'transaction') {
                message = {
                    ...message,
                    // add transactoin to operation
                    transaction: {
                        source: {
                            tag: 0,
                            hash: publicKeyHash2buffer(operation.source).hash,
                        },
                        destination: {
                            tag: 0,
                            hash: publicKeyHash2buffer(operation.destination).hash,
                        },
                        amount: parseInt(operation.amount),
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.gas_limit),
                    },
                }
            }

            if (operation.kind === 'origination') {
                message = {
                    ...message,
                    // add origination to operation
                    origination: {
                        source: {
                            tag: 0,
                            hash: publicKeyHash2buffer(operation.source).hash,
                        },
                        manager_pubkey: publicKeyHash2buffer(operation.managerPubkey).hash,
                        balance: parseInt(operation.balance),
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.gas_limit),
                        spendable: operation.spendable,
                        delegatable: operation.delegatable,
                        delegate:  operation.delegate,
                        script: operation.script,
                    },
                }
            }


        })

        console.log('[TREZOR][signOperationTrezor]', state, message)

        // number's must be ints otherwise it fails
        TrezorConnect.tezosSignTx(message)
            .then((response: any) => {
                console.warn('[signXTZ]', response.payload)

                resolve({
                    ...state,
                    signature: response.payload.signature,
                    signedOperationContents: response.payload.sig_op_contents,
                    operationHash: response.payload.operation_hash,
                })

            })

    })

    // wait until promise is resolved 
    return trezorPopup
}

export const amount = (amount: any) => {
    return parseInt(amount === 0 ? 0 : (parseFloat(amount) * +1000000)); // 1 000 000 = 1.00 tez
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
