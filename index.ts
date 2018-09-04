import { of } from 'rxjs'
import { tap, map, flatMap } from 'rxjs/operators';

// support for node.js
import './node'

// import { initialize, originate, setDelegation, transfer, newWallet, getWallet } from './client'
import { initializeWallet, originateContract, newWallet, getWallet, setDelegation } from './client'

console.log('[+] tezos wallet client')

// wallet used to create transaction with small tez amount
const wallet = {
    secretKey: 'edsk4Kr6FgbaKmJCiSAxsGNp8F9digNG2ZftB1FXYuymcSUn1jLcEw',
    publicKey: 'edpktz95bLQpor3a6PKMjeCXA7cAXk5AobbRZdoDELDdr93jruErKw',
    publicKeyHash: 'tz1L1YBz3nDNypeHPbSXECZbLdYVyJaGhv7w',
}

//const walletObservable = of({})
const walletObservable = of(wallet)

// create observable with state  
walletObservable.pipe(

    // wait for sodium to initialize
    // initializeWallet(),

    // create mnemonic, secret/public key for new wallet 
    //newWallet(),

    // get more details for new wallet
    // getWallet(state => ({
    //     'publicKeyHash': state.publicKeyHash,
    // })),
    // // send small amount to new wallet and wait for block creation
    // transfer((state: any) => ({
    //     'secretKey': wallet.secretKey,
    //     'publicKey': wallet.publicKey,
    //     'publicKeyHash': wallet.publicKeyHash,
    //     'to': 'tz1gw3bvZLSyw5Rj2a5rrH5LCWFAMBipLFmy',
    //     'amount': '0.000001',
    // })),

    // change delegate
    // setDelegation((state: any) => ({
    //     'secretKey': wallet.secretKey,
    //     'publicKey': wallet.publicKey,
    //     'publicKeyHash': wallet.publicKeyHash,
    //     'to': 'tz1iCKMR6Hq7hSNGVu9mBCu7Tum7Xmd3tD9G',
    // })),

    // originate delegatable contract   
    // originateContract((state: any) => ({
    //     'secretKey': wallet.secretKey,
    //     'publicKey': wallet.publicKey,
    //     'publicKeyHash': wallet.publicKeyHash,
    //     'delegate': 'tz1gw3bvZLSyw5Rj2a5rrH5LCWFAMBipLFmy',
    //     'amount': '0.000001',
    // })),

).subscribe(
    data => console.log('[+] ok'),
    error => console.error('[-] error', error)
)
