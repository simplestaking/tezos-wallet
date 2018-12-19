"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils = __importStar(require("../src/utils"));
const fs = __importStar(require("fs"));
// support for node.js
require("./node");
const enums_1 = require("../src/utils/enums");
const src_1 = require("../src");
const config = {
    transaction: {
        // hw_trezor_zero
        to: 'tz1UQfd6Hqbfy9x4yQAA9XdkZih57aZYYtnC',
        // to: 'tz1UX1CrhjPSEkV8qUZuYnDiNuJtmwTA1j2p',
        amount: '1.23',
        fee: '1',
    },
    node: {
        name: 'zeronet',
        display: 'Zeronet',
        url: 'https://zeronet.simplestaking.com:3000',
        tzscan: {
            url: 'http://zeronet.tzscan.io/',
        }
    },
    type: enums_1.WalletType.WEB,
};
// go to https://faucet.tzalpha.net/ and save files to ./faucet directory
// read connet of faucet files
const dir = './faucet/';
let faucets = [];
// read directory
const files = fs.readdirSync(dir);
files.forEach((file) => {
    // read file 
    console.log('[file]', file);
    let faucet = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
    // save only files with mnemonic
    if (faucet.hasOwnProperty('mnemonic')) {
        faucets.push({
            'publicKeyHash': faucet.pkh,
            'mnemonic': faucet.mnemonic.join(' '),
            'password': faucet.email + faucet.password,
            'secret': faucet.secret,
        });
    }
});
// console.log(faucets[0])
// wait for sodium to initialize
utils.ready().then(() => {
    // activate wallet
    rxjs_1.from(faucets).pipe(operators_1.flatMap(faucet => rxjs_1.of(faucet).pipe(
    // create privateKey & publicKey form mnemonic
    operators_1.map((faucet) => ({
        wallet: Object.assign({}, utils.keys(faucet.mnemonic, faucet.password), { secret: faucet.secret })
    })), operators_1.tap((stateWallet) => console.log('\n\n[+] [stateWallet]', stateWallet.wallet.publicKeyHash)), 
    // wait for sodium to initialize
    src_1.initializeWallet(stateWallet => ({
        secretKey: stateWallet.wallet.secretKey,
        publicKey: stateWallet.wallet.publicKey,
        publicKeyHash: stateWallet.wallet.publicKeyHash,
        secret: stateWallet.wallet.secret,
        // set Tezos node
        node: config.node,
        // set wallet type: WEB, TREZOR_ONE, TREZOR_T
        type: 'web',
    })), 
    // activate wallet
    src_1.activateWallet(stateWallet => ({
        secret: stateWallet.wallet.secret
    })), 
    // wait for transaction to be confirmed
    src_1.confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })), 
    // continue if wallet was activated already, otherwise throw error
    operators_1.catchError((error) => {
        // ignore activation error and proceed if already activated
        return error.response && error.response[0].id === 'proto.alpha.operation.invalid_activation' ?
            rxjs_1.of(Object.assign({}, error.state)) :
            rxjs_1.throwError(error);
    }), 
    // get wallet info
    src_1.getWallet(), operators_1.tap((stateWallet) => console.log('[+] getWallet: balance', (stateWallet.getWallet.balance / 1000000))), 
    // send XTZ if balance is > 100 xt
    operators_1.flatMap(stateWallet => (stateWallet.getWallet.balance / 1000000) > 1 ?
        rxjs_1.of(stateWallet).pipe(
        // send xtz
        src_1.transaction(stateWallet => ({
            to: config.transaction.to,
            amount: ((stateWallet.getWallet.balance / 1000000) - 100).toString(),
            // amount: 0.1,
            fee: config.transaction.fee,
        })), 
        // wait for transacation to be confirmed
        src_1.confirmOperation(stateWallet => ({
            injectionOperation: stateWallet.injectionOperation,
        }))) :
        rxjs_1.of(stateWallet))))).subscribe(data => {
        // console.log('[result]', data)
    });
});
//# sourceMappingURL=faucet.js.map