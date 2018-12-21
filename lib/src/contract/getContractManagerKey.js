"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
/**
* Get manager key for contract
*/
exports.managerKey = () => (source) => source.pipe(
// get manager key for contract 
common_1.rpc((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/manager_key',
    path: 'manager_key' // @TODO: should not be 'manager' ??
})));
//# sourceMappingURL=getContractManagerKey.js.map