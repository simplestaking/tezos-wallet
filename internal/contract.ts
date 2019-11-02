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

    // // originate contract
    // transaction(stateWallet => ({
    //     to: 'KT1EekdMsWCaJ4bCRVck5KUvkP45CgCJQyzg',
    //     amount: '0',
    //     fee: '0.1',

    //     // parameters: {
    //     //     "entrypoint": "setRole",
    //     //     "value": {
    //     //         "prim": "Pair",
    //     //         "args":
    //     //             [{
    //     //                 "prim": "Pair",
    //     //                 "args": [{
    //     //                     "prim": "Pair",
    //     //                     "args":
    //     //                         [{ "prim": "True" },
    //     //                         { "prim": "True" }]
    //     //                 },
    //     //                 {
    //     //                     "prim": "Pair",
    //     //                     "args":
    //     //                         [{ "prim": "True" },
    //     //                         { "prim": "True" }]
    //     //                 }]
    //     //             },
    //     //             { "string": "tz1MGtVUsRN2duS21pLgSUuAhuW1hhQmLXKP" }]
    //     //     }
    //     // },

    //     parameters:
    //         { "entrypoint": "updateRole",
    //           "value":
    //             { "prim": "Pair",
    //               "args":
    //                 [ { "prim": "Pair",
    //                     "args":
    //                       [ { "prim": "Pair",
    //                           "args":
    //                             [ { "prim": "True" }, { "prim": "True" } ] },
    //                         { "prim": "Pair",
    //                           "args":
    //                             [ { "prim": "True" }, { "prim": "True" } ] } ] },
    //                   { "string": "tz1MGtVUsRN2duS21pLgSUuAhuW1hhQmLXKP" } ] } },
    // })),
    
    // originate new smart contract
    originateContract(stateWallet => ({
        amount: "100",
        fee: "0.3",
        script: {
            "code":
                [{
                    "prim": "parameter",
                    "args":
                        [{
                            "prim": "pair",
                            "args":
                                [{
                                    "prim": "address",
                                    "annots": ["%initiator"]
                                },
                                {
                                    "prim": "pair",
                                    "args":
                                        [{
                                            "prim": "pair",
                                            "args":
                                                [{
                                                    "prim": "bool",
                                                    "annots": ["%customer"]
                                                },
                                                {
                                                    "prim": "bool",
                                                    "annots": ["%data_creator"]
                                                }]
                                        },
                                        {
                                            "prim": "pair",
                                            "args":
                                                [{
                                                    "prim": "bool",
                                                    "annots":
                                                        ["%metadata_creator"]
                                                },
                                                {
                                                    "prim": "bool",
                                                    "annots": ["%publisher"]
                                                }]
                                        }],
                                    "annots": ["%roles"]
                                }]
                        }]
                },
                {
                    "prim": "storage",
                    "args":
                        [{
                            "prim": "pair",
                            "args":
                                [{
                                    "prim": "pair",
                                    "args":
                                        [{
                                            "prim": "big_map",
                                            "args":
                                                [{ "prim": "string" },
                                                {
                                                    "prim": "pair",
                                                    "args":
                                                        [{
                                                            "prim": "pair",
                                                            "args":
                                                                [{
                                                                    "prim": "pair",
                                                                    "args":
                                                                        [{
                                                                            "prim":
                                                                                "address",
                                                                            "annots":
                                                                                ["%data_creator"]
                                                                        },
                                                                        {
                                                                            "prim":
                                                                                "address",
                                                                            "annots":
                                                                                ["%data_publisher"]
                                                                        }]
                                                                },
                                                                {
                                                                    "prim": "pair",
                                                                    "args":
                                                                        [{
                                                                            "prim":
                                                                                "bool",
                                                                            "annots":
                                                                                ["%is_data_public"]
                                                                        },
                                                                        {
                                                                            "prim":
                                                                                "bool",
                                                                            "annots":
                                                                                ["%is_metadata_public"]
                                                                        }]
                                                                }]
                                                        },
                                                        {
                                                            "prim": "pair",
                                                            "args":
                                                                [{
                                                                    "prim": "pair",
                                                                    "args":
                                                                        [{
                                                                            "prim":
                                                                                "address",
                                                                            "annots":
                                                                                ["%metadata_creator"]
                                                                        },
                                                                        {
                                                                            "prim":
                                                                                "string",
                                                                            "annots":
                                                                                ["%metadata_id"]
                                                                        }]
                                                                },
                                                                {
                                                                    "prim": "address",
                                                                    "annots":
                                                                        ["%metadata_publisher"]
                                                                }]
                                                        }]
                                                }],
                                            "annots": ["%catalog"]
                                        },
                                        {
                                            "prim": "address",
                                            "annots": ["%manager"]
                                        }]
                                },
                                {
                                    "prim": "big_map",
                                    "args":
                                        [{ "prim": "address" },
                                        {
                                            "prim": "pair",
                                            "args":
                                                [{
                                                    "prim": "pair",
                                                    "args":
                                                        [{
                                                            "prim": "bool",
                                                            "annots":
                                                                ["%customer"]
                                                        },
                                                        {
                                                            "prim": "bool",
                                                            "annots":
                                                                ["%data_creator"]
                                                        }]
                                                },
                                                {
                                                    "prim": "pair",
                                                    "args":
                                                        [{
                                                            "prim": "bool",
                                                            "annots":
                                                                ["%metadata_creator"]
                                                        },
                                                        {
                                                            "prim": "bool",
                                                            "annots":
                                                                ["%publisher"]
                                                        }]
                                                }]
                                        }],
                                    "annots": ["%user"]
                                }]
                        }]
                },
                {
                    "prim": "code",
                    "args":
                        [[{ "prim": "DUP" }, { "prim": "CAR" },
                        {
                            "prim": "DIP",
                            "args": [[{ "prim": "DUP" }]]
                        },
                        { "prim": "SWAP" }, { "prim": "CDR" },
                        { "prim": "DUP" }, { "prim": "CAR" },
                        { "prim": "CDR" }, { "prim": "SOURCE" },
                        { "prim": "COMPARE" }, { "prim": "NEQ" },
                        {
                            "prim": "IF",
                            "args":
                                [[{
                                    "prim": "PUSH",
                                    "args":
                                        [{ "prim": "string" },
                                        {
                                            "string":
                                                "setRole - permission denied - Not contract manager"
                                        }]
                                },
                                { "prim": "FAILWITH" }],
                                [{
                                    "prim": "PUSH",
                                    "args":
                                        [{ "prim": "unit" },
                                        { "prim": "Unit" }]
                                }]]
                        },
                        { "prim": "DROP" },
                        {
                            "prim": "DIP",
                            "args": [[{ "prim": "DUP" }]]
                        },
                        { "prim": "SWAP" }, { "prim": "CAR" },
                        {
                            "prim": "DIP",
                            "args":
                                [[{
                                    "prim": "DIP",
                                    "args": [[{ "prim": "DUP" }]]
                                },
                                { "prim": "SWAP" }, { "prim": "CDR" },
                                { "prim": "SOME" },
                                {
                                    "prim": "DIP",
                                    "args":
                                        [[{ "prim": "DUP" },
                                        { "prim": "CDR" }]]
                                }]]
                        },
                        { "prim": "UPDATE" },
                        {
                            "prim": "DIP",
                            "args":
                                [[{ "prim": "DUP" }, { "prim": "CAR" }]]
                        },
                        { "prim": "SWAP" }, { "prim": "PAIR" },
                        { "prim": "SWAP" }, { "prim": "DROP" },
                        { "prim": "DUP" },
                        {
                            "prim": "NIL",
                            "args": [{ "prim": "operation" }]
                        },
                        { "prim": "PAIR" }, { "prim": "SWAP" },
                        { "prim": "DROP" }, { "prim": "SWAP" },
                        { "prim": "DROP" }, { "prim": "SWAP" },
                        { "prim": "DROP" }]]
                }],
            "storage":
            {
                "prim": "Pair",
                "args":
                    [{
                        "prim": "Pair",
                        "args":
                            [[{
                                "prim": "Elt",
                                "args":
                                    [{ "string": "a_unique_id" },
                                    {
                                        "prim": "Pair",
                                        "args":
                                            [{
                                                "prim": "Pair",
                                                "args":
                                                    [{
                                                        "prim": "Pair",
                                                        "args":
                                                            [{
                                                                "string":
                                                                    "tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo"
                                                            },
                                                            {
                                                                "string":
                                                                    "tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo"
                                                            }]
                                                    },
                                                    {
                                                        "prim": "Pair",
                                                        "args":
                                                            [{ "prim": "True" },
                                                            { "prim": "True" }]
                                                    }]
                                            },
                                            {
                                                "prim": "Pair",
                                                "args":
                                                    [{
                                                        "prim": "Pair",
                                                        "args":
                                                            [{
                                                                "string":
                                                                    "tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo"
                                                            },
                                                            {
                                                                "string":
                                                                    "mtd_id_hjkldfn"
                                                            }]
                                                    },
                                                    {
                                                        "string":
                                                            "tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo"
                                                    }]
                                            }]
                                    }]
                            }],
                            {
                                "string":
                                    "tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo"
                            }]
                    },
                    [{
                        "prim": "Elt",
                        "args":
                            [{
                                "string":
                                    "tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo"
                            },
                            {
                                "prim": "Pair",
                                "args":
                                    [{
                                        "prim": "Pair",
                                        "args":
                                            [{ "prim": "True" },
                                            { "prim": "True" }]
                                    },
                                    {
                                        "prim": "Pair",
                                        "args":
                                            [{ "prim": "True" },
                                            { "prim": "True" }]
                                    }]
                            }]
                    }]]
            }
        },                                   
    })),


    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })),


).subscribe(
        data => console.log('[+] ok'),
        error => console.error('[-] error', error)
    )
