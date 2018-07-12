import { of } from 'rxjs';
// support for node.js
import './node';
import { initialize, newWallet } from './client';
console.log('[+] tezos wallet client');
// wallet used to create transaction with small tez amount
const wallet = {
    // fun sing train buzz document emotion wheel useless treat produce snake alter poverty animal faith
    // tz1XRJy5ht7HPepFk6uz79nnfA98kuTBBnjN
    // qqpigcir.sffflyri@tezos.example.org9ifFxiNEA4
    secretKey: 'edsk3Ux4WbGRaof25ukMi2o3VZxzcbth4Y8D1psZ4ZMkMFPkqqucRB',
    publicKey: 'edpkvKp59pisNXMMRAoqdyfHe4XRthWoYxP2UmonCG7z28txnP5aUh',
    publicKeyHash: 'tz1XRJy5ht7HPepFk6uz79nnfA98kuTBBnjN',
};
//const walletObservable = of({})
const walletObservable = of(wallet);
// create observable with state  
walletObservable.pipe(
// wait for sodium to initialize
initialize(), 
// create mnemonic, secret/public key for new wallet 
newWallet()).subscribe(data => console.log('[+] ok'), error => console.error('[-] error', error));
//# sourceMappingURL=index.js.map