import { of } from 'rxjs';
// support for node.js
import './node';
// import { initialize, originate, setDelegation, transfer, newWallet, getWallet } from './client'
import { initialize, transfer, getWallet } from './client';
console.log('[+] tezos wallet client');
// wallet used to create transaction with small tez amount
const wallet = {
    secretKey: 'edsk4Kr6FgbaKmJCiSAxsGNp8F9digNG2ZftB1FXYuymcSUn1jLcEw',
    publicKey: 'edpktz95bLQpor3a6PKMjeCXA7cAXk5AobbRZdoDELDdr93jruErKw',
    publicKeyHash: 'tz1L1YBz3nDNypeHPbSXECZbLdYVyJaGhv7w',
};
//const walletObservable = of({})
const walletObservable = of(wallet);
// create observable with state  
walletObservable.pipe(
// wait for sodium to initialize
initialize(), 
// create mnemonic, secret/public key for new wallet 
//newWallet(),
// get more details for new wallet
getWallet(state => ({
    'publicKeyHash': state.publicKeyHash,
})), 
// send small amount to new wallet and wait for block creation
transfer((state) => ({
    'secretKey': wallet.secretKey,
    'publicKey': wallet.publicKey,
    'publicKeyHash': wallet.publicKeyHash,
    // 'publicKeyHash': 'tz1L1YBz3nDNypeHPbSXECZbLdYVyJaGhv7w',
    //'to': 'KT1QUswUywUe5WPuukjyK61prvjWvJPeZRHh',
    'to': 'tz1gw3bvZLSyw5Rj2a5rrH5LCWFAMBipLFmy',
    'amount': '0.000001',
}))).subscribe(data => console.log('[+] ok'), error => console.error('[-] error', error));
//# sourceMappingURL=index.js.map