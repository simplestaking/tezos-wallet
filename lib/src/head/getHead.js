"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
/**
 * Get head for operation
 */
exports.head = () => (source) => source.pipe(
// get head
common_1.rpc((state) => ({
    url: '/chains/main/blocks/head',
    path: 'head',
})));
//# sourceMappingURL=getHead.js.map