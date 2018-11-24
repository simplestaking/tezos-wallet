import { of } from 'rxjs'
import { tap, map, flatMap } from 'rxjs/operators';

import { Config } from './types'
import { initializeWallet, transaction, confirmOperation } from './client'

// support for node.js
import './node'

console.log('[+] tezos wallet client')

// wallet used to create transaction with small tez amount
const wallet: Config = {
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
    type: 'web',
}

const walletObservable = of([])

// create observable with state  
walletObservable.pipe(

    // wait for sodium to initialize
    initializeWallet(stateWallet => ({
        secretKey: wallet.secretKey,
        publicKey: wallet.publicKey,
        publicKeyHash: wallet.publicKeyHash,
        // set Tezos node
        node: wallet.node,
        // set wallet type: WEB, TREZOR_ONE, TREZOR_T
        type: wallet.type,
        // set HD path for HW wallet
    }
    )),

    // originate contract
    transaction(stateWallet => ({
        to: 'tz1QBgNh18pFRAHhfkdqGcn84jDU8eyjNtwD',
        amount: '0.001',
    })),

    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })),

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
