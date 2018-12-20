"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
/**
 * Get contract counter
 *
 * @url /chains/main/blocks/head/context/contracts/[publicKeyHash]/counter
 */
exports.counter = () => (source) => source.pipe(
// get counter for contract
common_1.rpc((state) => ({
    url: `/chains/main/blocks/head/context/contracts/${state.wallet.publicKeyHash}/counter`,
    path: 'counter',
})));
