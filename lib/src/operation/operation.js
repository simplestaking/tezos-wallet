"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgeOperation_1 = require("./forgeOperation");
const applyInjectOperation_1 = require("./applyInjectOperation");
/**
 * Create operation in blockchain.
 * Fully forge operation, validates it and inject into blockchain
 */
exports.operation = () => (source) => source.pipe(
// create operation
forgeOperation_1.forgeOperation(), 
// apply & inject operation
applyInjectOperation_1.applyAndInjectOperation());
//# sourceMappingURL=operation.js.map