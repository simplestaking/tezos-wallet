import sodium from 'libsodium-wrappers'
import * as bs58check from 'bs58check'
import * as bip39 from 'bip39'

import { Wallet, TrezorMessage, TrezorRevealOperation, TrezorTransactionOperation, TrezorOriginationOperation, TrezorDelegationOperation, WalletBase } from './src/types'
import { State, StateOperation, StateOperations, StateHead, StateSignOperation } from './src/types/state';
import { of, throwError, Observable } from 'rxjs';
import { tap, map, flatMap } from 'rxjs/operators';
import { isArray } from 'util';
import { validateRevealOperation, validateTransactionOperation, validateOriginationOperation } from './src/validators';


const prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    tz2: new Uint8Array([6, 161, 161]),
    tz3: new Uint8Array([6, 161, 164]),
    KT1: new Uint8Array([2, 90, 121]),
    B: new Uint8Array([1, 52]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    sppk: new Uint8Array([3, 254, 226, 86]),
    p2pk: new Uint8Array([3, 178, 139, 127]),
    edsk64: new Uint8Array([43, 246, 78, 7]),
    edsk32: new Uint8Array([13, 15, 58, 7]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    operation: new Uint8Array([5, 116]),
}

export const string2buffer = (payload: string) => {
    return Buffer.from(payload, 'hex');
}

export const bs58checkEncode = (prefix: Uint8Array, payload: Uint8Array) => {
    const n = new Uint8Array(prefix.length + payload.length);

    n.set(prefix);
    n.set(payload, prefix.length);

    return bs58check.encode(Buffer.from(n));
}

export const bs58checkDecode = (prefix: Uint8Array, enc: string) => {
    return bs58check.decode(enc).slice(prefix.length);
}

export const concatKeys = (privateKey: Uint8Array, publicKey: Uint8Array) => {
    const n = new Uint8Array(privateKey.length + publicKey.length);
    n.set(privateKey);
    n.set(publicKey, privateKey.length);
    return n;
}

// sign operation 
export const signOperation = <T extends State & StateHead & StateOperation>(state: T) => {

    // TODO: change secretKey name to privateKey
    // console.log('[signOperation]', state)

    if (typeof state.operation !== 'string') {
        throw new TypeError('[signOperation] Operation not available on state');
    }
    const operation = sodium.from_hex(state.operation);
    const publicKey = bs58checkDecode(prefix.edpk, state.wallet.publicKey);
    const privateKey = bs58checkDecode(prefix.edsk32, state.wallet.secretKey);

    //console.log('[secretKey]', secretKey)
    //console.log('[publicKey]', publicKey)
    //console.log('[operation]', operation)



    // TODO: add all watermarks
    // ed25516
    const sig = sodium.crypto_sign_detached(
        sodium.crypto_generichash(32, concatKeys(new Uint8Array([3]), operation)),
        concatKeys(privateKey, publicKey),
        'uint8array'
    );

    //console.log('[sig]', sig)

    const signature = bs58checkEncode(prefix.edsig, sig);
    //console.log('[signature]', signature)

    const signedOperationContents = state.operation + sodium.to_hex(sig);

    const operationHash = bs58checkEncode(
        prefix.operation,
        // blake2b
        sodium.crypto_generichash(32, sodium.from_hex(signedOperationContents)),
    );

    return of(state).pipe(
        map(state => ({
            ...state,
            signOperation: {
                signature: signature,
                signedOperationContents: signedOperationContents,
                operationHash: operationHash
            }
        }))
    );
};

// sign operation 
export const signOperationTrezor = <T extends State & StateHead & StateOperation>(state: T) => {

    if (!isArray(state.operations)) {
        throw new TypeError('[signOperationTrezor] Operations not available in state');
    }

    // set basic config
    let message: Partial<TrezorMessage> = {
        path: state.wallet.path,
        branch: state.head.hash
    }

    // add operations to message 
    state.operations.map((operation) => {

        console.log('[signOperationTrezor] operation', operation)

        switch (operation.kind) {

            case 'reveal': {
                validateRevealOperation(operation);

                (<TrezorRevealOperation>message.operation) = {
                    // add reveal to operation 
                    reveal: {
                        source: operation.source,
                        public_key: operation.public_key,
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    }
                }
                break;
            }

            case 'transaction': {
                validateTransactionOperation(operation);

                (<TrezorTransactionOperation>message.operation) = {
                    // add transaction to operation
                    transaction: {
                        source: operation.source,
                        destination: operation.destination,
                        amount: parseInt(operation.amount),
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    }
                }
                break;

                // TODO: refactor use pack data function, instead of preapply parsing
                // use FF bit to find if we have parameters
                // if (operation.parameters) {

                //     message = {
                //         ...message,
                //         operation: {
                //             ...message.operation,
                //             // add parameters to operation
                //             transaction: {
                //                 ...message.operation.transaction,
                //                 parameters: sodium.from_hex(
                //                     state.operation.slice(state.operation.indexOf('000000d'),state.operation.length)
                //                     )
                //             }
                //         }
                //     }    
                // }
            }

            case 'origination': {
                validateOriginationOperation(operation);

                (<TrezorOriginationOperation>message.operation) = {
                    // add origination to operation
                    origination: {
                        source: operation.source,
                        manager_pubkey: operation.manager_pubkey ? operation.manager_pubkey : operation.managerPubkey,
                        balance: parseInt(operation.balance),
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                        spendable: operation.spendable,
                        delegatable: operation.delegatable,
                        delegate: operation.delegate,
                        // find encodig format http://doc.tzalpha.net/api/p2p.html
                        //script: Buffer.from(JSON.stringify(operation.script), 'utf8' ),
                    }
                }
            }

            case 'delegation': {
                // no validation as no special properties are required

                (<TrezorDelegationOperation>message.operation) = {
                    // add delegation to operation
                    delegation: {
                        source: operation.source,
                        delegate: !operation.delegate ? operation.source : operation.delegate,
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    }
                }
                break;
            }

            default: {
                throw new TypeError('[signOperationTrezor] Unknown operation type. Cannot proceed.');
            }
        }
    });

    return of(state).pipe(

        tap(() => console.warn('[TrezorConnect][signOperationTrezor] message', JSON.stringify(message))),

        // wait for resopnse from Trezor
        flatMap(() => (<any>window).TrezorConnect.tezosSignTransaction(message)),

        //  handle error from Trezor
        flatMap((response: any) => {

            // error on invalid response
            if (response.payload.error) {
                // throw error
                return throwError({ response: [{ 'TrezorConnect': 'tezosSignTransaction', ...response.payload }] });
            }

            return of(response)
        }),

        tap((response: any) => { console.warn('[TrezorConnect][tezosSignTransaction] reponse', response.payload) }),
        map(response => ({
            ...state,
            signOperation: {
                signature: response.payload.signature as string,
                signedOperationContents: response.payload.sig_op_contents as string,
                operationHash: response.payload.operation_hash as string,
            }
        })
        )
    )
}

export const parseAmount = (amount: string) => {
    return amount === '0' ? 0 : Math.round(parseFloat(amount) * +1000000); // 1 000 000 = 1.00 tez
}

export const keys = (mnemonic?: string, passpharse?: string): WalletBase => {

    mnemonic = mnemonic ? mnemonic : bip39.generateMnemonic(160)
    passpharse = mnemonic ? passpharse : ''

    let seed = bip39.mnemonicToSeed(mnemonic, passpharse).slice(0, 32)
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
        )
    }
}

export const ready = () => sodium.ready;

