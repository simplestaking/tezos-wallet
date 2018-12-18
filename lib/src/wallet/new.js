"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const utils = __importStar(require("../utils"));
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
exports.newWallet = () => (source) => source.pipe(
// create keys
operators_1.map(state => utils.keys()), operators_1.tap(state => {
    console.log('[+] mnemonic: "' + state.mnemonic + '"');
    console.log('[+] publicKey: "' + state.publicKey + '"');
    console.log('[+] publicKeyHash: "' + state.publicKeyHash + '"');
    console.log('[+] secretKey: "' + state.secretKey + '"');
}));
