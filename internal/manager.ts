import { of } from 'rxjs'
import { tap } from 'rxjs/operators';

import { Config, initializeWallet, originateContract, transaction, pendingOperation, confirmOperation } from '../src'

// support for node.js
import './node'

import * as bs58check from 'bs58check';

const prefix = {
    B: new Uint8Array([1, 52]),
    tz1: new Uint8Array([6, 161, 159]),
    tz2: new Uint8Array([6, 161, 161]),
    tz3: new Uint8Array([6, 161, 164]),
    KT1: new Uint8Array([2, 90, 121]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    sppk: new Uint8Array([3, 254, 226, 86]),
    p2pk: new Uint8Array([3, 178, 139, 127]),
};

const bs58checkDecode = (prefix: Uint8Array, enc: string): Uint8Array => {
    return bs58check.decode(enc).slice(prefix.length);
};

const concatArray = (first: Uint8Array, second: Uint8Array): Uint8Array => {
    const result = new Uint8Array(first.length + second.length);
    result.set(first);
    result.set(second, first.length);
    return result;
};

// convert publicKeyHash to buffer
const publicKeyHash2buffer = (publicKeyHash: string): { originated: number, hash: Uint8Array } => {
    switch (publicKeyHash.substr(0, 3)) {
        case 'tz1':
            return {
                originated: 0,
                hash: concatArray(new Uint8Array([0]), bs58checkDecode(prefix.tz1, publicKeyHash)),
            };
        case 'tz2':
            return {
                originated: 0,
                hash: concatArray(new Uint8Array([1]), bs58checkDecode(prefix.tz2, publicKeyHash)),
            };
        case 'tz3':
            return {
                originated: 0,
                hash: concatArray(new Uint8Array([2]), bs58checkDecode(prefix.tz3, publicKeyHash)),
            };
        case 'KT1':
            return {
                originated: 1,
                hash: concatArray(bs58checkDecode(prefix.KT1, publicKeyHash), new Uint8Array([0])),
            };
        default:
            throw new Error('Wrong Tezos publicKeyHash address');
    }
};

console.log('[+] tezos wallet client')
//(<any>window).__TREZOR_CONNECT_SRC = 'http://localhost:8088/'
// wallet used to create transaction with small tez amount
const wallet: Config = {
    secretKey: 'edsk3hEtniBGLP2wqYnc1Lix1hhV74eEenRBTfxjHTRHP59R7BapMW',
    publicKey: 'edpkth42B7j7rvLeZWmufj28a7sEdbMBb9y16qgQmGHYGX4hPis9V4',
    publicKeyHash: 'tz1WCojrEZWrjenejUZmG8QNsMtKPELx2TFA',
    node: {
        name: 'mainnet',
        display: 'Mainnet',
        url: 'https://mainnet.simplestaking.com:3000',
        tzscan: {
            url: 'http://tzstats.com/account.',
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

    // transfer tokens from smart kontrakt to implicit
    transaction(stateWallet => ({
        to: 'KT1MJSg8YrnjSewrWGYL3e8XfqtLAG5WU4Hg',
        amount: '0.001',
        fee: '0.001',

        // parameters_manager: {
        //     transfer: {
        //         destination: 'tz1WCojrEZWrjenejUZmG8QNsMtKPELx2TFA',
        //         amount: '0.001',
        //     }
        // },
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
