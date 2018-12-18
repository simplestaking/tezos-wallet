"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = require("../rpc");
/**
 * Get wallet details
 */
exports.getWallet = () => (source) => source.pipe(
// get contract info balance 
rpc_1.rpc(state => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/',
    path: 'getWallet'
})));
