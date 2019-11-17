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

    // call entry point 
    transaction(stateWallet => ({
        //to: 'KT1Ueoy8N2k45A5JVS5SSRNAA6oP4hweHR3o',
        to: 'KT1NuhJLGviTo9C5fQMNZ7WrQKaYxGmbYH4V',
        amount: '0',
        fee: '0.1',

        // //setRole
        // parameters:
        //     {
        //         "entrypoint": "setRole",
        //         "value":
        //         {
        //             "prim": "Pair",
        //             "args":
        //                 [{
        //                     "prim": "Pair",
        //                     "args":
        //                         [{
        //                             "prim": "Pair",
        //                             "args":
        //                                 [{
        //                                     "string":
        //                                         "tz1WCojrEZWrjenejUZmG8QNsMtKPELx2TFA"
        //                                 },
        //                                 { "prim": "True" }]
        //                         },
        //                         {
        //                             "prim": "Pair",
        //                             "args":
        //                                 [{ "prim": "True" }, { "prim": "True" }]
        //                         }]
        //                 },
        //                 { "prim": "True" }]
        //         }
        //     },

        // // create data
        // parameters: {
        //     "entrypoint": "createData",
        //     "value": { "string": "abcd" }
        // },
        
        // // requestDataPublication
        // parameters:
        // { "entrypoint": "requestDataPublication",
        //   "value":
        //     { "prim": "Pair",
        //       "args":
        //         [ { "string": "abcd" },
        //           { "string": "tz1WCojrEZWrjenejUZmG8QNsMtKPELx2TFA" } ] } },
        
        // // allowDataPublication
        // parameters:
        //     { "entrypoint": "allowDataPublication",
        //       "value": { "string": "abcd" } },

        // // createMetadata
        // parameters: {
        //      "entrypoint": "createMetadata",
        //     "value":
        //         { "prim": "Pair",
        //         "args":
        //             [ { "prim": "Pair",
        //                 "args":
        //                 [ { "string": "some_keywords_are_typed+here" },
        //                     { "string": "abcd" } ] },
        //             { "string": "some_metadata" } ] }
        //      },

        // buyData
        parameters:{ 
            "entrypoint": "buyData",
            "value":
            { "prim": "Pair",
              "args":
                [ { "prim": "Pair",
                    "args":
                      [ { "string": "abcd" },
                        { "string": "sigXdjIf34Jfc" } ] },
                  { "string": "transaction_id_2" } ] } 
        },

    })),


    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })),


).subscribe(
    data => console.log('[+] ok'),
    error => console.dir(error, { depth: null, colors: true })
)
