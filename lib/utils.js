import sodium from 'libsodium-wrappers';
import * as bs58check from 'bs58check';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
const prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    edpk: new Uint8Array([13, 15, 37, 217]),
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
    ;
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
    let operation = sodium.from_hex(state.operation);
    let secretKey = bs58checkDecode(prefix.edsk32, state.secretKey);
    let publicKey = bs58checkDecode(prefix.edpk, state.publicKey);
    //console.log('[secretKey]', secretKey)
    //console.log('[publicKey]', publicKey)
    //console.log('[operation]', operation)
    // remove publicKey
    if (secretKey.length > 32)
        secretKey = secretKey.slice(0, 32);
    //debugger;
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
    return Object.assign({}, state, { signature: signature, signedOperationContents: signedOperationContents, operationHash: operationHash });
};
// sign operation 
export const signOperationTrezor = (state) => {
    let trezorPopup = new Promise(function (resolve, reject) {
        // console.log('[TREZOR][signOperationTrezor]', state)
        // tezos address
        let xtzPath = "m/44'/1729'/0'/0'/0'";
        try {
            // open popup
            TrezorConnect.open((response) => {
                try {
                    // get address and ask for confirmation
                    TrezorConnect.tezosSignTx(xtzPath, state.to, state.fee, state.amount, state.operation, (response) => {
                        let signature = bs58checkEncode(prefix.edsig, sodium.from_hex(response.signature));
                        let signedOperationContents = state.operation + response.signature;
                        console.log("[+] trezor: signature ", signature);
                        let operationHash = bs58checkEncode(prefix.operation, 
                        // blake2b
                        sodium.crypto_generichash(32, sodium.from_hex(signedOperationContents)));
                        resolve(Object.assign({}, state, { signature: signature, signedOperationContents: signedOperationContents, operationHash: operationHash }));
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
export const amount = (amount) => {
    return amount === 0 ? 0 : "" + (+amount * +1000000) + ""; // 1 000 000 = 1.00 tez
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