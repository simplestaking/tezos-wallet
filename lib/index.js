"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
// support for node.js
require("./node");
var client_1 = require("./client");
console.log('[+] tezos wallet client');
// wallet used to create transaction with small tez amount
var wallet = {
    secretKey: 'edsk4Kr6FgbaKmJCiSAxsGNp8F9digNG2ZftB1FXYuymcSUn1jLcEw',
    publicKey: 'edpktz95bLQpor3a6PKMjeCXA7cAXk5AobbRZdoDELDdr93jruErKw',
    publicKeyHash: 'tz1L1YBz3nDNypeHPbSXECZbLdYVyJaGhv7w',
};
//const walletObservable = of({})
var walletObservable = rxjs_1.of(wallet);
// create observable with state  
walletObservable.pipe(
// wait for sodium to initialize
client_1.initialize(), 
// create mnemonic, secret/public key for new wallet 
//newWallet(),
// get more details for new wallet
client_1.getWallet(function (state) { return ({
    'publicKeyHash': state.publicKeyHash,
}); }), 
// send small amount to new wallet and wait for block creation
client_1.transfer(function (state) { return ({
    'secretKey': wallet.secretKey,
    'publicKey': wallet.publicKey,
    //'publicKeyHash': wallet.publicKeyHash,
    'publicKeyHash': 'KT1QUswUywUe5WPuukjyK61prvjWvJPeZRHh',
    //'to': 'KT1QUswUywUe5WPuukjyK61prvjWvJPeZRHh',
    'to': 'tz1gw3bvZLSyw5Rj2a5rrH5LCWFAMBipLFmy',
    'amount': '0.000001',
}); })).subscribe(function (data) { return console.log('[+] ok'); }, function (error) { return console.error('[-] error', error); });
//# sourceMappingURL=index.js.map