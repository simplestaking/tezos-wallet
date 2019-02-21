import * as sodium from 'libsodium-wrappers';
import * as sodiumSumo from 'libsodium-wrappers-sumo';
import * as crypto from 'crypto';
import * as zxcvbn from 'zxcvbn';
import * as bs58check from 'bs58check';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';


export interface WalletBase {
    mnemonic?: string
    secretKey: string
    publicKey: string
    publicKeyHash: string
}

export interface EncryptedWallet {
    version: string;
    salt: string;
    ciphertext: string;
    kdf: string;
}


/**
 * Prefix table
 */
export const prefix = {
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

/**
 * Encode byte array into base58check format using optional prefix
 * @param prefix 
 * @param payload 
 */
export function bs58checkEncode(this: void, prefix: Uint8Array | null, payload: Uint8Array | any) {
    if (prefix) {
        const n = new Uint8Array(prefix.length + payload.length);
        n.set(prefix);
        n.set(payload, prefix.length);
        return bs58check.encode(Buffer.from(n));
    } else {
        const n = new Uint8Array(payload.length);
        n.set(payload);
        return bs58check.encode(Buffer.from(n));
    }
}

/**
 * Decodes base58 encoded string into byte array and removes defined prefix 
 * @param prefix 
 * @param encoded 
 */
export function base58CheckDecode(this: void, prefix: Uint8Array, encoded: string) {
    return bs58check.decode(encoded).slice(prefix.length);
}


/**
 * Concat together private and public key
 * @param privateKey 
 * @param publicKey 
 */
export function concatKeys(this: void, privateKey: Uint8Array, publicKey: Uint8Array) {

    const concated = new Uint8Array(privateKey.length + publicKey.length);
    concated.set(privateKey);
    concated.set(publicKey, privateKey.length);
    return concated;
}



/**
 * Convert string amount notation into number in milions
 * @param amount text amount (3.50 tez)
 */
export function parseAmount(this: void, amount: string) {
    return amount === '0' ? 0 : Math.round(parseFloat(amount) * +1000000); // 1 000 000 = 1.00 tez
}


/**
 * Generates wallet new wallet or uses provided mnemonic and password 
 * @param mnemonic mnemonics joined with spaces (['a','b'].join(' '))
 * @param passpharse 
 */
export function keys(): WalletBase
export function keys(mnemonic: string, password: string): WalletBase
export function keys(mnemonic?: string, password?: string): WalletBase {

    mnemonic = mnemonic ? mnemonic : bip39.generateMnemonic(160);
    password = mnemonic ? password : '';

    let seed = bip39.mnemonicToSeed(mnemonic, password).slice(0, 32);
    // ED25516 
    let keyPair = sodium.crypto_sign_seed_keypair(seed, 'uint8array');
    // remove publicKey
    let privateKey = keyPair.privateKey.slice(0, 32);

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


/**
 * Get sodium ready state
 */
export const ready = () => sodium.ready;


/**
 * Encrypt wallet
 */
export const encryptKeys = (wallet: WalletBase, passphrase: string) : EncryptedWallet => {

	const keys = JSON.stringify({
			publicKey: wallet.publicKey,
			publicKeyHash: wallet.publicKeyHash,
			secretKey: wallet.secretKey //encode secretKey
	});
	const salt = generateSaltForPwHash();

	console.log("encryptKeys: ", keys, passphrase )

	let encryptedKeys: Uint8Array;
	// try {
    //     encryptedKeys = encryptMessage(keys, passphrase, salt);
	// } catch (err) {
    //     console.log(err);
    // }
    encryptedKeys = encryptMessage(keys, passphrase, salt);

	return {
		version: '1',
		salt: bs58checkEncode(null, salt),
		ciphertext: bs58checkEncode(null, encryptedKeys),
		kdf: 'Argon2'
	}

}

/**
* Encrypts a given message using a passphrase
* @param {string} message  Message to encrypt
* @param {string} passphrase   User-supplied passphrase
* @param {Buffer} salt Salt for key derivation
* @returns {Buffer}    Concatenated bytes of nonce and cipher text
*/
function encryptMessage(message: string, passphrase: string, salt: Buffer): Buffer {

	const passwordStrength = getPasswordStrength(passphrase);
	if (passwordStrength < 3) {
	    throw new Error('The password is not strength enought!');
	}

	const messageBytes = sodium.from_string(message);
	const keyBytes = sodiumSumo.crypto_pwhash(
			sodium.crypto_box_SEEDBYTES,
			passphrase,
			salt,
			sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
			sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
			sodium.crypto_pwhash_ALG_DEFAULT
	);
	const nonce = Buffer.from(sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES));
	const cipherText = Buffer.from(sodium.crypto_secretbox_easy(messageBytes, nonce, keyBytes));
	return Buffer.concat([nonce, cipherText]);
}

/**
 * Decrypts a given message using a passphrase
 * @param {Buffer} nonce_and_ciphertext Concatenated bytes of nonce and cipher text
 * @param {string} passphrase   User-supplied passphrase
 * @param {Buffer} salt Salt for key derivation
 * @returns {any}   Decrypted message
 */
export function decryptMessage(nonce_and_ciphertext: Buffer, passphrase: string, salt: Buffer ): string {
	const keyBytes = sodiumSumo.crypto_pwhash(
			sodium.crypto_box_SEEDBYTES,
			passphrase,
			salt,
			sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
			sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
			sodium.crypto_pwhash_ALG_DEFAULT
	);
	if (nonce_and_ciphertext.length < sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES) {
			throw new Error("The cipher text is of insufficient length");
	}
	const nonce = nonce_and_ciphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES);
	const ciphertext = nonce_and_ciphertext.slice(sodium.crypto_secretbox_NONCEBYTES);
	return sodium.crypto_secretbox_open_easy(ciphertext, nonce, keyBytes, 'text');
}

/**
* Generates a salt for key derivation.
* @returns {Buffer}    Salt
*/
function generateSaltForPwHash() {
	return crypto.randomBytes(sodium.crypto_pwhash_SALTBYTES)
}

/**
 * Checking the password strength using zxcvbn
 * @returns {number}    Password score
 */
function getPasswordStrength(password: string): number {
    const results = zxcvbn(password);
    return results.score;
}