import { of } from 'rxjs'
import { tap } from 'rxjs/operators';

import { Config, initializeWallet, originateContract, transaction, pendingOperation, confirmOperation } from '../src'

// support for node.js
import './node'


console.log('[+] tezos wallet client')

// wallet used to create transaction with small tez amount
const wallet: Config = {
    secretKey: 'edsk3hEtniBGLP2wqYnc1Lix1hhV74eEenRBTfxjHTRHP59R7BapMW',
    publicKey: 'edpkth42B7j7rvLeZWmufj28a7sEdbMBb9y16qgQmGHYGX4hPis9V4',
    publicKeyHash: 'tz1WCojrEZWrjenejUZmG8QNsMtKPELx2TFA',
    node: {
        name: 'mainnet',
        display: 'Mainnet',
        url: 'https://mainnet.simplestaking.com:3000',
        tzstats: {
            url: 'http://tzstats.com/account/',
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
        // type: 'TREZOR_T',
        // path: "m/44'/1729'/1'"
        type: 'web'
    })),

    // transfer tokens from smart contract to implicit
    transaction(stateWallet => ({
        to: 'KT1Jr8K4woJx7XA1xAjFU2YeorHviTa18ns5',
        amount: '0',
        fee: '0.01',
        parameters_manager: {
            transfer: {
                //destination: 'tz1ho86qZyxtHbedZku7qdCHaQPpFi6qs6Ti',
                destination: 'KT1H3KG698mndrxgurnY7GDbnY3DE5AKypNP',
                amount: '0.001',
            }
        },
    })),

    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })),

    // // set the delegate
    // transaction(stateWallet => ({
    //     to: 'KT1MJSg8YrnjSewrWGYL3e8XfqtLAG5WU4Hg',
    //     amount: '0',
    //     fee: '0.02941',

    //     parameters_manager: {
    //         set_delegate: 'tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo',
    //     },

    // })),

    // // wait until operation is confirmed & moved from mempool to head
    // confirmOperation(stateWallet => ({
    //     injectionOperation: stateWallet.injectionOperation,
    // })),

    // // cancel the delegation
    // transaction(stateWallet => ({
    //     to: 'KT1MJSg8YrnjSewrWGYL3e8XfqtLAG5WU4Hg',
    //     amount: '0',
    //     fee: '0.02941',

    //     parameters_manager: {
    //         cancel_delegate: true,
    //     },

    // })),

    // // wait until operation is confirmed & moved from mempool to head
    // confirmOperation(stateWallet => ({
    //     injectionOperation: stateWallet.injectionOperation,
    // })),


).subscribe(
    data => console.log('[+] ok'),
    error => console.error('[-] error', error)
)
