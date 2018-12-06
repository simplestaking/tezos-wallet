import sodium from 'libsodium-wrappers';
import * as bs58check from 'bs58check';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import { of, throwError } from 'rxjs';
import { tap, map, flatMap } from 'rxjs/operators';
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
};
export const bs58checkEncode = (prefix, payload) => {
    let n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(new Buffer(n, 'hex'));
};
export const bs58checkDecode = (prefix, enc) => {
    return bs58check.decode(enc).slice(prefix.length);
};
export const concatKeys = (privateKey, publicKey) => {
    let n = new Uint8Array(privateKey.length + publicKey.length);
    n.set(privateKey);
    n.set(publicKey, privateKey.length);
    return n;
};
// sign operation 
export const signOperation = (state) => {
    // TODO: change secretKey name to privateKey
    // console.log('[signOperation]', state)
    let operation = sodium.from_hex(state.operation);
    let secretKey = bs58checkDecode(prefix.edsk32, state.wallet.secretKey);
    let publicKey = bs58checkDecode(prefix.edpk, state.wallet.publicKey);
    //console.log('[secretKey]', secretKey)
    //console.log('[publicKey]', publicKey)
    //console.log('[operation]', operation)
    // remove publicKey
    if (secretKey.length > 32)
        secretKey = secretKey.slice(0, 32);
    // TODO: add all watermarks
    // ed25516
    let sig = sodium.crypto_sign_detached(sodium.crypto_generichash(32, concatKeys(new Uint8Array([3]), operation)), concatKeys(secretKey, publicKey), 'uint8array');
    //console.log('[sig]', sig)
    let signature = bs58checkEncode(prefix.edsig, sig);
    //console.log('[signature]', signature)
    let signedOperationContents = state.operation + sodium.to_hex(sig);
    let operationHash = bs58checkEncode(prefix.operation, 
    // blake2b
    sodium.crypto_generichash(32, sodium.from_hex(signedOperationContents)));
    return Object.assign({}, state, { signOperation: {
            signature: signature,
            signedOperationContents: signedOperationContents,
            operationHash: operationHash,
        } });
};
// sign operation 
export const signOperationTrezor = (state) => {
    // set basic config
    let message = {
        path: state.wallet.path,
        branch: state.head.hash
    };
    // add operations to message 
    state.operations.map((operation) => {
        console.log('[signOperationTrezor] operation', operation);
        if (operation.kind === 'reveal') {
            message = Object.assign({}, message, { operation: Object.assign({}, message.operation, { 
                    // add reveal to operation 
                    reveal: {
                        source: operation.source,
                        public_key: operation.public_key,
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    } }) });
        }
        if (operation.kind === 'transaction') {
            message = Object.assign({}, message, { operation: Object.assign({}, message.operation, { 
                    // add transaction to operation
                    transaction: {
                        source: operation.source,
                        destination: operation.destination,
                        amount: parseInt(operation.amount),
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    } }) });
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
        if (operation.kind === 'origination') {
            message = Object.assign({}, message, { operation: Object.assign({}, message.operation, { 
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
                    } }) });
        }
        if (operation.kind === 'delegation') {
            message = Object.assign({}, message, { operation: Object.assign({}, message.operation, { 
                    // add delegation to operation
                    delegation: {
                        source: operation.source,
                        delegate: !operation.delegate ? operation.source : operation.delegate,
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    } }) });
        }
    });
    return of([state]).pipe(tap(() => console.warn('[TrezorConnect][signOperationTrezor] message', JSON.stringify(message))), 
    // wait for resopnse from Trezor
    flatMap(() => window.TrezorConnect.tezosSignTransaction(message)), 
    // handle error from Trezor
    flatMap((response) => response.payload.error ?
        // throw error
        throwError({ response: [Object.assign({ 'TrezorConnect': 'tezosSignTransaction' }, response.payload)] }) :
        of(response)), tap((response) => { console.warn('[TrezorConnect][tezosSignTransaction] reponse', response.payload); }), map(response => (Object.assign({}, state, { signOperation: {
            signature: response.payload.signature,
            signedOperationContents: response.payload.sig_op_contents,
            operationHash: response.payload.operation_hash,
        } }))));
};
export const amount = (amount) => {
    return amount === '0' ? '0' : Math.round(parseFloat(amount) * +1000000); // 1 000 000 = 1.00 tez
};
export const keys = (mnemonic, passpharse) => {
    mnemonic = mnemonic ? mnemonic : bip39.generateMnemonic(160);
    passpharse = mnemonic ? passpharse : '';
    let seed = bip39.mnemonicToSeed(mnemonic, passpharse).slice(0, 32);
    // ED25516 
    let keyPair = sodium.crypto_sign_seed_keypair(seed, 'uint8array');
    // remove publicKey
    let privateKey = keyPair.privateKey.slice(0, 32);
    return {
        mnemonic: mnemonic,
        secretKey: bs58checkEncode(prefix.edsk32, privateKey),
        publicKey: bs58checkEncode(prefix.edpk, keyPair.publicKey),
        publicKeyHash: bs58checkEncode(prefix.tz1, 
        // blake2b algo
        sodium.crypto_generichash(20, keyPair.publicKey)),
    };
};
export const ready = () => {
    return sodium.ready;
};
//# sourceMappingURL=utils.js.map