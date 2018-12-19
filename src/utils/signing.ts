import * as sodium from 'libsodium-wrappers';
import { of, throwError } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";

import {
    State, StateHead, StateOperation, TrezorMessage, TrezorRevealOperation, TrezorTransactionOperation, TrezorOriginationOperation,
    TrezorDelegationOperation, TrezorConnectResponse
} from "../types";

import { base58CheckDecode, concatKeys, bs58checkEncode, prefix } from "./utils";
import { validateRevealOperation, validateTransactionOperation, validateOriginationOperation } from './validators';


/**
 * Sign operation in state. Software signing is used.
 * @param state transaction state
 */
export function signOperation<T extends State & StateHead & StateOperation>(state: T) {

    // TODO: change secretKey name to privateKey
    // console.log('[signOperation]', state)

    if (typeof state.operation !== 'string') {
        throw new TypeError('[signOperation] Operation not available in state');
    }

    // convert preapplied operation from hex format to by array
    const operation = sodium.from_hex(state.operation);

    if (typeof state.wallet.publicKey === 'undefined') {
        console.warn('[signOperation] Public key not available in wallet. Using empty string.');
    }

    if (typeof state.wallet.secretKey === 'undefined') {
        console.warn('[signOperation] Secret key not available in wallet. Using empty string.');
    }

    // keys in byte format
    const publicKey = base58CheckDecode(prefix.edpk, state.wallet.publicKey || '');
    const privateKey = base58CheckDecode(prefix.edsk32, state.wallet.secretKey || '');

    //console.log('[secretKey]', secretKey)
    //console.log('[publicKey]', publicKey)
    //console.log('[operation]', operation)

    // @TODO: add all watermarks

    // ed25516
    const sig = sodium.crypto_sign_detached(
        sodium.crypto_generichash(32, concatKeys(new Uint8Array([3]), operation)),
        concatKeys(privateKey, publicKey),
        'uint8array'
    );

    //console.log('[sig]', sig)

    const signature = bs58checkEncode(prefix.edsig, sig);
    //console.log('[signature]', signature)

    // build signed operation
    const signedOperationContents = state.operation + sodium.to_hex(sig);

    const operationHash = bs58checkEncode(
        prefix.operation,
        // blake2b
        sodium.crypto_generichash(32, sodium.from_hex(signedOperationContents)),
    );

    // add signed operation to state
    return of(state).pipe(
        map(state => ({
            ...state as any,
            signOperation: {
                signature: signature,
                signedOperationContents: signedOperationContents,
                operationHash: operationHash
            }
        }))
    );
};

/**
 * Sign operation using hardware Trezor wallet
 * @param state transaction state
 * @throws Typerror 
 */
export function signOperationTrezor<T extends State & StateHead & StateOperation>(state: T) {

    if (!Array.isArray(state.operations)) {
        throw new TypeError('[signOperationTrezor] Operations not available in state');
    }

    // set basic config
    let message: TrezorMessage = {
        path: state.wallet.path || '',
        branch: state.head.hash,
        operation: {}
    }

    // add operations to message 
    state.operations.map((operation) => {

        console.log('[signOperationTrezor] operation', operation)

        switch (operation.kind) {

            case 'reveal': {
                validateRevealOperation(operation);

                // add reveal to operation 
                message.operation.reveal = {
                    source: operation.source,
                    public_key: operation.public_key,
                    fee: parseInt(operation.fee),
                    counter: parseInt(operation.counter),
                    gas_limit: parseInt(operation.gas_limit),
                    storage_limit: parseInt(operation.storage_limit),
                }
                break;
            }

            case 'transaction': {
                validateTransactionOperation(operation);

                // add transaction to operation
                message.operation.transaction = {
                    source: operation.source,
                    destination: operation.destination,
                    amount: parseInt(operation.amount),
                    fee: parseInt(operation.fee),
                    counter: parseInt(operation.counter),
                    gas_limit: parseInt(operation.gas_limit),
                    storage_limit: parseInt(operation.storage_limit),
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

                // add origination to operation
                message.operation.origination = {
                    source: operation.source,
                    manager_pubkey: operation.manager_pubkey ? operation.manager_pubkey : <string>operation.managerPubkey,
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

            case 'delegation': {
                // no validation as no special properties are required

                // add delegation to operation
                message.operation.delegation = {
                    source: operation.source,
                    delegate: !operation.delegate ? operation.source : operation.delegate,
                    fee: parseInt(operation.fee),
                    counter: parseInt(operation.counter),
                    gas_limit: parseInt(operation.gas_limit),
                    storage_limit: parseInt(operation.storage_limit),
                }
                break;
            }

            default: {
                throw new TypeError(`[signOperationTrezor] Unknown operation type "${operation.kind}". Cannot proceed.`);
            }
        }
    });


    return of(state).pipe(

        tap(() => console.warn('[TrezorConnect][signOperationTrezor] message', JSON.stringify(message))),

        // wait for resopnse from Trezor
        flatMap<T, TrezorConnectResponse>(() => (<any>window).TrezorConnect.tezosSignTransaction(message)),

        //  handle error from Trezor
        flatMap((response) => {

            // error on invalid response
            if (response.payload.error) {
                // throw error
                return throwError({ response: [{ TrezorConnect: 'tezosSignTransaction', ...response.payload }] });
            }
            return of(response)
        }),

        tap((response) => { console.warn('[TrezorConnect][tezosSignTransaction] reponse', response.payload) }),
        map(response => ({
            ...state as any,
            signOperation: {
                signature: response.payload.signature,
                signedOperationContents: response.payload.sig_op_contents,
                operationHash: response.payload.operation_hash,
            }
        }))
    )
}