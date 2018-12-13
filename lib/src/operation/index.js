"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const forge_1 = require("./forge");
const applyInject_1 = require("./applyInject");
__export(require("./applyInject"));
__export(require("./forge"));
__export(require("./confirm"));
__export(require("./pack"));
__export(require("./pending"));
/**
 * Create operation in blocchain
 */
exports.operation = () => (source) => source.pipe(
// create operation
forge_1.forgeOperation(), 
// apply & inject operation
applyInject_1.applyAndInjectOperation());
//# sourceMappingURL=index.js.map