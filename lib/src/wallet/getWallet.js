"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
/**
 * Get wallet details as balance
 *
 * @url /chains/main/blocks/head/context/contracts/[walletPublicKey]/
 */
exports.getWallet = () => (source) => source.pipe(
// get contract info balance 
common_1.rpc(state => ({
    url: `/chains/main/blocks/head/context/contracts/${state.wallet.publicKeyHash}/`,
    path: 'getWallet'
})));
//# sourceMappingURL=getWallet.js.map