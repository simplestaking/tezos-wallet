"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = require("../rpc");
exports.checkPendingOperations = () => (source) => source.pipe(rpc_1.rpc(() => ({
    url: '/chains/main/mempool/pending_operations',
    path: 'mempool'
})));
//# sourceMappingURL=pending.js.map