"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const common_1 = require("../common");
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
exports.newWallet = () => (source) => source.pipe(
// create keys
operators_1.map(() => common_1.keys()), operators_1.tap(state => {
    console.log('[+] mnemonic: "' + state.mnemonic + '"');
    console.log('[+] publicKey: "' + state.publicKey + '"');
    console.log('[+] publicKeyHash: "' + state.publicKeyHash + '"');
    console.log('[+] secretKey: "' + state.secretKey + '"');
}));
