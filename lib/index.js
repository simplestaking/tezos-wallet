"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
// support for node.js
require("./node");
var client_1 = require("./client");
console.log('[+] tezos wallet client');
// wallet used to create transaction with small tez amount
var wallet = {
    // fun sing train buzz document emotion wheel useless treat produce snake alter poverty animal faith
    // tz1XRJy5ht7HPepFk6uz79nnfA98kuTBBnjN
    // qqpigcir.sffflyri@tezos.example.org9ifFxiNEA4
    secretKey: 'edsk3Ux4WbGRaof25ukMi2o3VZxzcbth4Y8D1psZ4ZMkMFPkqqucRB',
    publicKey: 'edpkvKp59pisNXMMRAoqdyfHe4XRthWoYxP2UmonCG7z28txnP5aUh',
    publicKeyHash: 'tz1XRJy5ht7HPepFk6uz79nnfA98kuTBBnjN',
};
//const walletObservable = of({})
var walletObservable = rxjs_1.of(wallet);
// create observable with state  
walletObservable.pipe(
// wait for sodium to initialize
client_1.initialize(), 
// create mnemonic, secret/public key for new wallet 
client_1.newWallet()).subscribe(function (data) { return console.log('[+] ok'); }, function (error) { return console.error('[-] error', error); });
//# sourceMappingURL=index.js.map