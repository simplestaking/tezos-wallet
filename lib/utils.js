"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
const bs58check = __importStar(require("bs58check"));
const bip39 = __importStar(require("bip39"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const util_1 = require("util");
const validators_1 = require("./src/validators");
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
exports.string2buffer = (payload) => {
    return Buffer.from(payload, 'hex');
};
exports.bs58checkEncode = (prefix, payload) => {
    const n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(Buffer.from(n));
};
exports.bs58checkDecode = (prefix, enc) => {
    return bs58check.decode(enc).slice(prefix.length);
};
exports.concatKeys = (privateKey, publicKey) => {
    const n = new Uint8Array(privateKey.length + publicKey.length);
    n.set(privateKey);
    n.set(publicKey, privateKey.length);
    return n;
};
// sign operation 
exports.signOperation = (state) => {
    // TODO: change secretKey name to privateKey
    // console.log('[signOperation]', state)
    if (typeof state.operation !== 'string') {
        throw new TypeError('[signOperation] Operation not available on state');
    }
    const operation = libsodium_wrappers_1.default.from_hex(state.operation);
    const publicKey = exports.bs58checkDecode(prefix.edpk, state.wallet.publicKey);
    const privateKey = exports.bs58checkDecode(prefix.edsk32, state.wallet.secretKey);
    //console.log('[secretKey]', secretKey)
    //console.log('[publicKey]', publicKey)
    //console.log('[operation]', operation)
    // TODO: add all watermarks
    // ed25516
    const sig = libsodium_wrappers_1.default.crypto_sign_detached(libsodium_wrappers_1.default.crypto_generichash(32, exports.concatKeys(new Uint8Array([3]), operation)), exports.concatKeys(privateKey, publicKey), 'uint8array');
    //console.log('[sig]', sig)
    const signature = exports.bs58checkEncode(prefix.edsig, sig);
    //console.log('[signature]', signature)
    const signedOperationContents = state.operation + libsodium_wrappers_1.default.to_hex(sig);
    const operationHash = exports.bs58checkEncode(prefix.operation, 
    // blake2b
    libsodium_wrappers_1.default.crypto_generichash(32, libsodium_wrappers_1.default.from_hex(signedOperationContents)));
    return rxjs_1.of(state).pipe(operators_1.map(state => (Object.assign({}, state, { signOperation: {
            signature: signature,
            signedOperationContents: signedOperationContents,
            operationHash: operationHash
        } }))));
};
// sign operation 
exports.signOperationTrezor = (state) => {
    if (!util_1.isArray(state.operations)) {
        throw new TypeError('[signOperationTrezor] Operations not available in state');
    }
    // set basic config
    let msg = {
        path: state.wallet.path,
        branch: state.head.hash
    };
    // add operations to message 
    state.operations.map((operation) => {
        console.log('[signOperationTrezor] operation', operation);
        switch (operation.kind) {
            case 'reveal': {
                validators_1.validateRevealOperation(operation);
                msg.operation = {
                    // add reveal to operation 
                    reveal: {
                        source: operation.source,
                        public_key: operation.public_key,
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    }
                };
                break;
            }
            case 'transaction': {
                validators_1.validateTransactionOperation(operation);
                msg.operation = {
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
                };
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
                validators_1.validateOriginationOperation(operation);
                msg.operation = {
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
                    }
                };
            }
            case 'delegation': {
                // no validation as no special properties are required
                msg.operation = {
                    // add delegation to operation
                    delegation: {
                        source: operation.source,
                        delegate: !operation.delegate ? operation.source : operation.delegate,
                        fee: parseInt(operation.fee),
                        counter: parseInt(operation.counter),
                        gas_limit: parseInt(operation.gas_limit),
                        storage_limit: parseInt(operation.storage_limit),
                    }
                };
                break;
            }
            // @TODO: acount activation is missing??
            case 'activate_account': {
                //??
            }
            default: {
                throw new TypeError(`[signOperationTrezor] Unknown operation type "${operation.kind}". Cannot proceed.`);
            }
        }
    });
    // force cast to message as its complete now
    const message = msg;
    return rxjs_1.of(state).pipe(operators_1.tap(() => console.warn('[TrezorConnect][signOperationTrezor] message', JSON.stringify(message))), 
    // wait for resopnse from Trezor
    operators_1.flatMap(() => window.TrezorConnect.tezosSignTransaction(message)), 
    //  handle error from Trezor
    operators_1.flatMap((response) => {
        // error on invalid response
        if (response.payload.error) {
            // throw error
            return rxjs_1.throwError({ response: [Object.assign({ TrezorConnect: 'tezosSignTransaction' }, response.payload)] });
        }
        return rxjs_1.of(response);
    }), operators_1.tap((response) => { console.warn('[TrezorConnect][tezosSignTransaction] reponse', response.payload); }), operators_1.map(response => (Object.assign({}, state, { signOperation: {
            signature: response.payload.signature,
            signedOperationContents: response.payload.sig_op_contents,
            operationHash: response.payload.operation_hash,
        } }))));
};
exports.parseAmount = (amount) => {
    return amount === '0' ? 0 : Math.round(parseFloat(amount) * +1000000); // 1 000 000 = 1.00 tez
};
exports.keys = (mnemonic, passpharse) => {
    mnemonic = mnemonic ? mnemonic : bip39.generateMnemonic(160);
    passpharse = mnemonic ? passpharse : '';
    let seed = bip39.mnemonicToSeed(mnemonic, passpharse).slice(0, 32);
    // ED25516 
    let keyPair = libsodium_wrappers_1.default.crypto_sign_seed_keypair(seed, 'uint8array');
    // remove publicKey
    let privateKey = keyPair.privateKey.slice(0, 32);
    return {
        mnemonic: mnemonic,
        secretKey: exports.bs58checkEncode(prefix.edsk32, privateKey),
        publicKey: exports.bs58checkEncode(prefix.edpk, keyPair.publicKey),
        publicKeyHash: exports.bs58checkEncode(prefix.tz1, 
        // blake2b algo
        libsodium_wrappers_1.default.crypto_generichash(20, keyPair.publicKey))
    };
};
exports.ready = () => libsodium_wrappers_1.default.ready;
