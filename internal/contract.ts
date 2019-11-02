import { of } from 'rxjs'
import { tap } from 'rxjs/operators';

import { Config, initializeWallet, transaction, pendingOperation, confirmOperation, validateOriginationOperation, originateContract } from '../src'

// support for node.js
import './node'

console.log('[+] tezos wallet client')

// wallet used to create transaction with small tez amount
const wallet: Config = {
    secretKey: 'edsk3hEtniBGLP2wqYnc1Lix1hhV74eEenRBTfxjHTRHP59R7BapMW',
    publicKey: 'edpkth42B7j7rvLeZWmufj28a7sEdbMBb9y16qgQmGHYGX4hPis9V4',
    publicKeyHash: 'tz1WCojrEZWrjenejUZmG8QNsMtKPELx2TFA',
    node: {
        name: 'babylon',
        display: 'Babylon',
        url: 'https://alphanet.simplestaking.com:3000',
        tzstats: {
            url: 'http://babylonnet.tzstats.com/account/',
        }
    },
    type: 'web'
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
    })),

    // originate contract
    transaction(stateWallet => ({
        to: 'KT1Ueoy8N2k45A5JVS5SSRNAA6oP4hweHR3o',
        amount: '0',
        fee: '0.1',

        parameters: {
            "entrypoint": "setRole",
            "value": {
                "prim": "Pair",
                "args":
                    [{
                        "prim": "Pair",
                        "args": [{
                            "prim": "Pair",
                            "args":
                                [{ "prim": "False" },
                                { "prim": "False" }]
                        },
                        {
                            "prim": "Pair",
                            "args":
                                [{ "prim": "False" },
                                { "prim": "True" }]
                        }]
                    },
                    { "string": "tz1PayTZoKjNyofxFQxkzhcv9RCdyW7Q64Wc" }]
            }
        },

        // parameters:
        //     { "entrypoint": "updateRole",
        //       "value":
        //         { "prim": "Pair",
        //           "args":
        //             [ { "prim": "Pair",
        //                 "args":
        //                   [ { "prim": "Pair",
        //                       "args":
        //                         [ { "prim": "True" }, { "prim": "False" } ] },
        //                     { "prim": "Pair",
        //                       "args":
        //                         [ { "prim": "True" }, { "prim": "True" } ] } ] },
        //               { "string": "tz1cbQ4Nsst6cUBnZryFsJc5zaWaaoPwYyif" } ] } },
    })),
    
 
    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })),


).subscribe(
        data => console.log('[+] ok'),
        error => console.error('[-] error', error)
    )
