"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateRevealOperation(operation) {
    ['public_key'].forEach(prop => checkPropertyWithError(operation, prop, 'validateRevealOperation'));
}
exports.validateRevealOperation = validateRevealOperation;
function validateTransactionOperation(operation) {
    ['amount', 'destination'].forEach(prop => checkPropertyWithError(operation, prop, 'validateTransactionOperation'));
}
exports.validateTransactionOperation = validateTransactionOperation;
function validateOriginationOperation(operation) {
    ['manager_pubkey', 'balance', 'spendable', 'delegatable', 'delegate'].forEach(prop => checkPropertyWithError(operation, prop, 'validateOriginationOperation'));
}
exports.validateOriginationOperation = validateOriginationOperation;
function checkPropertyWithError(o, prop, origin) {
    if (!o.hasOwnProperty(prop)) {
        const error = `[${origin}] Object is missing required property "${prop}".`;
        console.error(error);
        throw new TypeError(error);
    }
}
