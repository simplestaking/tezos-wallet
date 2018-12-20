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
const bs58check = __importStar(require("bs58check"));
const bip39 = __importStar(require("bip39"));
const buffer_1 = require("buffer");
/**
 * Prefix table
 */
exports.prefix = {
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
/**
 * Encode byte array into base58check format using defined prefix
 * @param prefix
 * @param payload
 */
function bs58checkEncode(prefix, payload) {
    const n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(buffer_1.Buffer.from(n));
}
exports.bs58checkEncode = bs58checkEncode;
/**
 * Decodes base58 encoded string into byte array and removes defined prefix
 * @param prefix
 * @param encoded
 */
function base58CheckDecode(prefix, encoded) {
    return bs58check.decode(encoded).slice(prefix.length);
}
exports.base58CheckDecode = base58CheckDecode;
/**
 * Concat together private and public key
 * @param privateKey
 * @param publicKey
 */
function concatKeys(privateKey, publicKey) {
    const concated = new Uint8Array(privateKey.length + publicKey.length);
    concated.set(privateKey);
    concated.set(publicKey, privateKey.length);
    return concated;
}
exports.concatKeys = concatKeys;
/**
 * Convert string amount notation into number in milions
 * @param amount text amount (3.50 tez)
 */
function parseAmount(amount) {
    return amount === '0' ? 0 : Math.round(parseFloat(amount) * +1000000); // 1 000 000 = 1.00 tez
}
exports.parseAmount = parseAmount;
function keys(mnemonic, password) {
    mnemonic = mnemonic ? mnemonic : bip39.generateMnemonic(160);
    password = mnemonic ? password : '';
    let seed = bip39.mnemonicToSeed(mnemonic, password).slice(0, 32);
    // ED25516 
    let keyPair = sodium.crypto_sign_seed_keypair(seed, 'uint8array');
    // remove publicKey
    let privateKey = keyPair.privateKey.slice(0, 32);
    return {
        mnemonic: mnemonic,
        secretKey: bs58checkEncode(exports.prefix.edsk32, privateKey),
        publicKey: bs58checkEncode(exports.prefix.edpk, keyPair.publicKey),
        publicKeyHash: bs58checkEncode(exports.prefix.tz1, 
        // blake2b algo
        sodium.crypto_generichash(20, keyPair.publicKey))
    };
}
exports.keys = keys;
/**
 * Get sodium ready state
 */
exports.ready = () => sodium.ready;
