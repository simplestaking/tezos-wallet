"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sodium = __importStar(require("libsodium-wrappers"));
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
/**
 * Waits for sodium to initialize and prepares wallet for working with it
 * Should be the first step of every workflow
 *
 */
exports.initializeWallet = (selector) => (source) => source.pipe(operators_1.flatMap(state => rxjs_1.of({}).pipe(
// wait for sodium to initialize
operators_1.concatMap(() => Promise.resolve(sodium.ready)), 
// exec callback function and add result state
operators_1.map(() => ({
    wallet: selector(state)
})), operators_1.catchError((error) => {
    console.warn('[initializeWallet][sodium] ready', error);
    // this might not work. Why we do not propagate error further?
    // incompatible
    return rxjs_1.of(Object.assign({}, state, { error }));
}))));
