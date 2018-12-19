"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sodium = __importStar(require("libsodium-wrappers"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("./utils");
const validators_1 = require("./validators");
/**
 * Sign operation in state. Software signing is used.
 * @param state transaction state
 */
function signOperation(state) {
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
    const publicKey = utils_1.base58CheckDecode(utils_1.prefix.edpk, state.wallet.publicKey || '');
    const privateKey = utils_1.base58CheckDecode(utils_1.prefix.edsk32, state.wallet.secretKey || '');
    //console.log('[secretKey]', secretKey)
    //console.log('[publicKey]', publicKey)
    //console.log('[operation]', operation)
    // @TODO: add all watermarks
    // ed25516
    const sig = sodium.crypto_sign_detached(sodium.crypto_generichash(32, utils_1.concatKeys(new Uint8Array([3]), operation)), utils_1.concatKeys(privateKey, publicKey), 'uint8array');
    //console.log('[sig]', sig)
    const signature = utils_1.bs58checkEncode(utils_1.prefix.edsig, sig);
    //console.log('[signature]', signature)
    // build signed operation
    const signedOperationContents = state.operation + sodium.to_hex(sig);
    const operationHash = utils_1.bs58checkEncode(utils_1.prefix.operation, 
    // blake2b
    sodium.crypto_generichash(32, sodium.from_hex(signedOperationContents)));
    // add signed operation to state
    return rxjs_1.of(state).pipe(operators_1.map(state => (Object.assign({}, state, { signOperation: {
            signature: signature,
            signedOperationContents: signedOperationContents,
            operationHash: operationHash
        } }))));
}
exports.signOperation = signOperation;
;
/**
 * Sign operation using hardware Trezor wallet
 * @param state transaction state
 * @throws Typerror
 */
function signOperationTrezor(state) {
    if (!Array.isArray(state.operations)) {
        throw new TypeError('[signOperationTrezor] Operations not available in state');
    }
    // set basic config
    let message = {
        path: state.wallet.path || '',
        branch: state.head.hash,
        operation: {}
    };
    // add operations to message 
    state.operations.map((operation) => {
        console.log('[signOperationTrezor] operation', operation);
        switch (operation.kind) {
            case 'reveal': {
                validators_1.validateRevealOperation(operation);
                // add reveal to operation 
                message.operation.reveal = {
                    source: operation.source,
                    public_key: operation.public_key,
                    fee: parseInt(operation.fee),
                    counter: parseInt(operation.counter),
                    gas_limit: parseInt(operation.gas_limit),
                    storage_limit: parseInt(operation.storage_limit),
                };
                break;
            }
            case 'transaction': {
                validators_1.validateTransactionOperation(operation);
                // add transaction to operation
                message.operation.transaction = {
                    source: operation.source,
                    destination: operation.destination,
                    amount: parseInt(operation.amount),
                    fee: parseInt(operation.fee),
                    counter: parseInt(operation.counter),
                    gas_limit: parseInt(operation.gas_limit),
                    storage_limit: parseInt(operation.storage_limit),
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
                // add origination to operation
                message.operation.origination = {
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
                };
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
                };
                break;
            }
            default: {
                throw new TypeError(`[signOperationTrezor] Unknown operation type "${operation.kind}". Cannot proceed.`);
            }
        }
    });
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
}
exports.signOperationTrezor = signOperationTrezor;
//# sourceMappingURL=signing.js.map