import { of } from 'rxjs'
import { tap } from 'rxjs/operators';

import { Config, initializeWallet, originateContract, transaction, pendingOperation, confirmOperation } from '../src'

// support for node.js
import './node'

console.log('[+] tezos wallet client')
//(<any>window).__TREZOR_CONNECT_SRC = 'http://localhost:8088/'
// wallet used to create transaction with small tez amount
const wallet: Config = {
    secretKey: 'edsk4WXfRdwKqpgrMia7E2GxZEdUgEUGcA6mqteKNo7Q91iPcbtGsX',
    publicKey: 'edpktgu6SSaQRfvvy4dzBRXwhZtZDPipk8WLUJwiJ1Gauxfcz9Enbp',
    publicKeyHash: 'tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo',
    node: {
        name: 'mainnet',
        display: 'Mainnet',
        url: 'http://zeronet-node.tzscan.io',
        tzscan: {
            url: 'http://zeronet.tzscan.io/',
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
        // path: "m/44'/1729'/0'"
        type: 'web'
    })),

    // transfer tokens from smart kontrakt to implicit
    transaction(stateWallet => ({
        to: 'KT1MJSg8YrnjSewrWGYL3e8XfqtLAG5WU4Hg',
        amount: '0',
        fee: '0.02941',

        parameters_manager: {
            transfer: {
                destination: 'tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo',
                amount: 100,
            }
        }

        parameters: {
            "entrypoint": "do",
            "value":
                [{ "prim": "DROP" },
                { "prim": "NIL", "args": [{ "prim": "operation" }] },
                {
                    "prim": "PUSH",
                    "args":
                        [{ "prim": "key_hash" },
                        {
                            "bytes": "005f450441f41ee11eee78a31d1e1e55627c783bd6"
                        }]
                },
                { "prim": "IMPLICIT_ACCOUNT" },
                {
                    "prim": "PUSH",
                    "args":
                        [{ "prim": "mutez" }, { "int": "100" }]
                },
                { "prim": "UNIT" }, { "prim": "TRANSFER_TOKENS" },
                { "prim": "CONS" }]
        },
    })),

    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })),

    // set the delegate
    transaction(stateWallet => ({
        to: 'KT1MJSg8YrnjSewrWGYL3e8XfqtLAG5WU4Hg',
        amount: '0',
        fee: '0.02941',

        parameters_manager: {
            set_delegate: 'tz1UKmZhi8dhUX5a5QTfCrsH9pK4dt1dVfJo',
        }

        parameters: {
            "entrypoint": "do",
            "value":
                [{ "prim": "DROP" },
                { "prim": "NIL", "args": [{ "prim": "operation" }] },
                {
                    "prim": "PUSH",
                    "args":
                        [{ "prim": "key_hash" },
                        {
                            "bytes": "005f450441f41ee11eee78a31d1e1e55627c783bd6"
                        }]
                },
                { "prim": "SOME" },
                { "prim": "SET_DELEGATE" },
                { "prim": "CONS" }]
        },
    })),

    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })),

    // cancel the delegation
    transaction(stateWallet => ({
        to: 'KT1MJSg8YrnjSewrWGYL3e8XfqtLAG5WU4Hg',
        amount: '0',
        fee: '0.02941',

        parameters_manager: {
            cancel_delegate: true,
        }

        parameters: {
            "entrypoint": "do",
            "value":
                [{ "prim": "DROP" },
                { "prim": "NIL", "args": [{ "prim": "operation" }] },
                { "prim": "NONE", "args": [{ "prim": "key_hash" }] },
                { "prim": "SET_DELEGATE" },
                { "prim": "CONS" }]
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
