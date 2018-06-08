"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
var bs58check = __importStar(require("bs58check"));
var bip39 = __importStar(require("bip39"));
var buffer_1 = require("buffer");
var prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    edsk64: new Uint8Array([43, 246, 78, 7]),
    edsk32: new Uint8Array([13, 15, 58, 7]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    operation: new Uint8Array([5, 116]),
};
exports.bs58checkEncode = function (prefix, payload) {
    var n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(new buffer_1.Buffer(n, 'hex'));
};
exports.bs58checkDecode = function (prefix, enc) {
    return bs58check.decode(enc).slice(prefix.length);
    ;
};
exports.concatKeys = function (privateKey, publicKey) {
    var n = new Uint8Array(privateKey.length + publicKey.length);
    n.set(privateKey);
    n.set(publicKey, privateKey.length);
    return n;
};
// sign operation 
exports.signOperation = function (state) {
    // TODO: change secretKey name to privateKey
    var operation = libsodium_wrappers_1.default.from_hex(state.operation);
    var secretKey = exports.bs58checkDecode(prefix.edsk32, state.secretKey);
    var publicKey = exports.bs58checkDecode(prefix.edpk, state.publicKey);
    console.log('[secretKey]', secretKey);
    console.log('[publicKey]', publicKey);
    console.log('[operation]', operation);
    // remove publicKey
    if (secretKey.length > 32)
        secretKey = secretKey.slice(0, 32);
    // ed25516
    var sig = libsodium_wrappers_1.default.crypto_sign_detached(libsodium_wrappers_1.default.crypto_generichash(32, operation), exports.concatKeys(secretKey, publicKey), 'uint8array');
    console.log('[sig]', sig);
    var signature = exports.bs58checkEncode(prefix.edsig, sig);
    console.log('[signature]', signature);
    var signedOperationContents = state.operation + libsodium_wrappers_1.default.to_hex(sig);
    var operationHash = exports.bs58checkEncode(prefix.operation, 
    // blake2b
    libsodium_wrappers_1.default.crypto_generichash(32, libsodium_wrappers_1.default.from_hex(signedOperationContents)));
    return __assign({}, state, { signature: signature, signedOperationContents: signedOperationContents, operationHash: operationHash });
};
// sign operation 
exports.signOperationTrezor = function (state) {
    var trezorPopup = new Promise(function (resolve, reject) {
        // console.log('[TREZOR][signOperationTrezor]', state)
        // tezos address
        var xtzPath = "m/44'/1729'/0'/0'/0'";
        try {
            // open popup
            TrezorConnect.open(function (response) {
                try {
                    // get address and ask for confirmation
                    TrezorConnect.tezosSignTx(xtzPath, state.to, state.fee, state.amount, state.operation, function (response) {
                        var signature = exports.bs58checkEncode(prefix.edsig, libsodium_wrappers_1.default.from_hex(response.signature));
                        var signedOperationContents = state.operation + response.signature;
                        console.log("[+] trezor: signature ", signature);
                        var operationHash = exports.bs58checkEncode(prefix.operation, 
                        // blake2b
                        libsodium_wrappers_1.default.crypto_generichash(32, libsodium_wrappers_1.default.from_hex(signedOperationContents)));
                        resolve(__assign({}, state, { signature: signature, signedOperationContents: signedOperationContents, operationHash: operationHash }));
                    });
                }
                catch (error) {
                    // error happens usualy when user trys to open multiple trezor connect windows
                    console.error("[TrezorConnect] sign transaction ", error);
                }
            });
        }
        catch (errorOpen) {
            console.error('[TrezorConnect] open', errorOpen);
        }
    });
    // wait until promise is resolved 
    return trezorPopup;
};
exports.amount = function (amount) {
    return amount === 0 ? 0 : "" + (+amount * +1000000) + ""; // 1 000 000 = 1.00 tez
};
exports.keys = function (mnemonic) {
    mnemonic = mnemonic ? mnemonic : bip39.generateMnemonic(160);
    var seed = bip39.mnemonicToSeed(mnemonic, '').slice(0, 32);
    // ED25516 
    var keyPair = libsodium_wrappers_1.default.crypto_sign_seed_keypair(seed, 'uint8array');
    // remove publicKey
    var privateKey = keyPair.privateKey.slice(0, 32);
    return {
        mnemonic: mnemonic,
        secretKey: exports.bs58checkEncode(prefix.edsk32, privateKey),
        publicKey: exports.bs58checkEncode(prefix.edpk, keyPair.publicKey),
        publicKeyHash: exports.bs58checkEncode(prefix.tz1, 
        // blake2b algo
        libsodium_wrappers_1.default.crypto_generichash(20, keyPair.publicKey)),
    };
};
//# sourceMappingURL=utils.js.map