import { of } from 'rxjs';
import { initializeWallet, transaction } from './client';
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
    },
    type: 'web',
};
const walletObservable = of([]);
// create observable with state  
walletObservable.pipe(
// wait for sodium to initialize
initializeWallet(() => ({
    secretKey: wallet.secretKey,
    publicKey: wallet.publicKey,
    publicKeyHash: wallet.publicKeyHash,
    // set Tezos node
    node: wallet.node,
    // set wallet type: WEB, TREZOR_ONE, TREZOR_T
    type: wallet.type,
})), 
// originate contract
transaction(stateWallet => ({
    to: 'tz1QBgNh18pFRAHhfkdqGcn84jDU8eyjNtwD',
    amount: '0.001',
}))).subscribe(data => console.log('[+] ok'), error => console.error('[-] error', error));
//# sourceMappingURL=index.js.map