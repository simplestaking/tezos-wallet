"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
// support for node.js
require("./node");
const enums_1 = require("./src/utils/enums");
const src_1 = require("./src");
console.log('[+] tezos wallet client');
// wallet used to create transaction with small tez amount
const wallet = {
    secretKey: 'edsk4Kr6FgbaKmJCiSAxsGNp8F9digNG2ZftB1FXYuymcSUn1jLcEw',
    publicKey: 'edpktz95bLQpor3a6PKMjeCXA7cAXk5AobbRZdoDELDdr93jruErKw',
    publicKeyHash: 'tz1L1YBz3nDNypeHPbSXECZbLdYVyJaGhv7w',
    node: {
        name: 'mainnet',
        display: 'Mainnet',
        url: 'https://mainnet.simplestaking.com:3000',
        tzscan: {
            url: 'http://tzscan.io/',
        }
    },
    type: enums_1.WalletType.WEB,
};
const walletObservable = rxjs_1.of([]);
// create observable with state  
walletObservable.pipe(
// wait for sodium to initialize
src_1.initializeWallet(stateWallet => ({
    secretKey: wallet.secretKey,
    publicKey: wallet.publicKey,
    publicKeyHash: wallet.publicKeyHash,
    // set Tezos node
    node: wallet.node,
    // set wallet type: WEB, TREZOR_ONE, TREZOR_T
    type: wallet.type
})), 
// originate contract
src_1.transaction(() => ({
    to: 'tz1QBgNh18pFRAHhfkdqGcn84jDU8eyjNtwD',
    amount: '0.001',
    fee: '0'
})), 
// wait until operation is confirmed & moved from mempool to head
src_1.confirmOperation(stateWallet => ({
    injectionOperation: stateWallet.injectionOperation,
}))).subscribe(data => console.log('[+] ok'), error => console.error('[-] error', error));
//# sourceMappingURL=start.js.map