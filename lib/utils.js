import sodium from 'libsodium-wrappers';
import * as bs58check from 'bs58check';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import { of } from 'rxjs';
import { tap, map, flatMap, catchError } from 'rxjs/operators';
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
export const string2buffer = (payload) => {
    debugger;
    let n = new Uint8Array(payload.length);
    n.set(payload);
    return new Buffer(n, 'hex');
};
export const bs58checkEncode = (prefix, payload) => {
    let n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(new Buffer(n, 'hex'));
};
export const bs58checkDecode = (prefix, enc) => {
    return bs58check.decode(enc).slice(prefix.length);
    ;
};
export const concatKeys = (privateKey, publicKey) => {
    let n = new Uint8Array(privateKey.length + publicKey.length);
    n.set(privateKey);
    n.set(publicKey, privateKey.length);
    return n;
};
// convert publicKeyHash to buffer and elliptic curve
export const publicKeyHash2buffer = (publicKeyHash) => {
    switch (publicKeyHash.substr(0, 3)) {
        case 'tz1':
            return {
                curve: 0,
                originated: 0,
                hash: concatKeys(new Uint8Array([0]), bs58checkDecode(prefix.tz1, publicKeyHash))
            };
        case 'tz2':
            return {
                curve: 1,
                originated: 0,
                hash: concatKeys(new Uint8Array([1]), bs58checkDecode(prefix.tz2, publicKeyHash))
            };
        case 'tz3':
            return {
                curve: 2,
                originated: 0,
                hash: concatKeys(new Uint8Array([2]), bs58checkDecode(prefix.tz3, publicKeyHash))
            };
        case 'KT1':
            // debugger
            return {
                curve: -1,
                originated: 1,
                hash: concatKeys(bs58checkDecode(prefix.KT1, publicKeyHash), new Uint8Array([0]))
            };
        default:
            return {
                curve: -1,
                originated: -1,
                hash: null,
            };
    }
};
// convert publicKeyHash to buffer and elliptic curve
export const publicKey2buffer = (publicKey) => {
    switch (publicKey.substr(0, 4)) {
        case 'edpk':
            return {
                curve: 0,
                hash: concatKeys(new Uint8Array([0]), bs58checkDecode(prefix.edpk, publicKey))
            };
        case 'sppk':
            return {
                curve: 1,
                hash: concatKeys(new Uint8Array([1]), bs58checkDecode(prefix.sppk, publicKey))
            };
        case 'p2pk':
            return {
                curve: 2,
                hash: concatKeys(new Uint8Array([2]), bs58checkDecode(prefix.p2pk, publicKey))
            };
        default:
            return {
                curve: -1,
                hash: null,
            };
    }
};
// sign operation 
export const signOperation = (state) => {
    // TODO: change secretKey name to privateKey
    console.log('[signOperation]', state);
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
        path: "m/44'/1729'/0'/0'/2'",
        curve: publicKeyHash2buffer(state.manager_key.manager).curve,
        branch: bs58checkDecode(prefix.B, state.head.hash)
    };
    // add operations to message 
    state.operations.map((operation) => {
        console.log('[signOperationTrezor] operation', operation);
        if (operation.kind === 'reveal') {
            message = Object.assign({}, message, { operation: Object.assign({}, message.operation, { 
                    // add reveal to operation 
                    reveal: {
                        source: {
                            tag: publicKeyHash2buffer(operation.source).originated,
                            hash: publicKeyHash2buffer(operation.source).hash,
                        },
                        public_key: publicKey2buffer(operation.public_key).hash,
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    } }) });
        }
        if (operation.kind === 'transaction') {
            message = Object.assign({}, message, { operation: Object.assign({}, message.operation, { 
                    // add transactoin to operation
                    transaction: {
                        source: {
                            tag: publicKeyHash2buffer(operation.source).originated,
                            hash: publicKeyHash2buffer(operation.source).hash,
                        },
                        destination: {
                            tag: publicKeyHash2buffer(operation.destination).originated,
                            hash: publicKeyHash2buffer(operation.destination).hash,
                        },
                        amount: parseInt(operation.amount),
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    } }) });
        }
        if (operation.kind === 'origination') {
            message = Object.assign({}, message, { operation: Object.assign({}, message.operation, { 
                    // add origination to operation
                    origination: {
                        source: {
                            tag: publicKeyHash2buffer(operation.source).originated,
                            hash: publicKeyHash2buffer(operation.source).hash,
                        },
                        manager_pubkey: publicKeyHash2buffer(operation.manager_pubkey).hash,
                        balance: parseInt(operation.balance),
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                        spendable: operation.spendable,
                        delegatable: operation.delegatable,
                        delegate: publicKeyHash2buffer(operation.delegate).hash,
                    } }) });
        }
        if (operation.kind === 'delegation') {
            message = Object.assign({}, message, { operation: Object.assign({}, message.operation, { 
                    // add delegation to operation
                    delegation: {
                        source: {
                            tag: publicKeyHash2buffer(operation.source).originated,
                            hash: publicKeyHash2buffer(operation.source).hash,
                        },
                        delegate: !operation.delegate ?
                            publicKeyHash2buffer(operation.source).hash : publicKeyHash2buffer(operation.delegate).hash,
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    } }) });
        }
    });
    // (<any>window).TrezorConnect.tezosGetAddress({
    //     'path': "m/44'/1729'/0'/0'/2'",
    //     'curve': 1,
    //     'showOnTrezor': true,
    // }).then((response:any) => console.error('[TrezorConnect.tezosGetAddress]', response) )
    return of([state]).pipe(tap(state => console.warn('[x][TREZOR][signOperationTrezor] message', message)), 
    // wait for resopnse from Trezor
    flatMap(state => window.TrezorConnect.tezosSignTransaction(message)), tap((response) => { console.warn('[x][TrezorConnect.tezosSignTransaction]', response); }), map(response => (Object.assign({}, state, { signOperation: {
            signature: response.payload.signature,
            signedOperationContents: response.payload.sig_op_contents,
            operationHash: response.payload.operation_hash,
        } }))), catchError(error => {
        console.error('[ERROR][TrezorConnect.tezosSignTransaction]', error);
        return of([]);
    }));
};
export const amount = (amount) => {
    return amount === '0' ? '0' : (parseFloat(amount) * +1000000); // 1 000 000 = 1.00 tez
};
export const keys = (mnemonic) => {
    mnemonic = mnemonic ? mnemonic : bip39.generateMnemonic(160);
    let seed = bip39.mnemonicToSeed(mnemonic, '').slice(0, 32);
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
//# sourceMappingURL=utils.js.map