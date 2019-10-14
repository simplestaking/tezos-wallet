import { of } from 'rxjs'
import { tap } from 'rxjs/operators';

import { Config, initializeWallet, originateContract, pendingOperation, confirmOperation } from '../src'

// support for node.js
import './node'

console.log('[+] tezos wallet client')

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
        type: wallet.type,
    })),

    // originate contract
    originateContract(stateWallet => ({
        to: 'tz1QBgNh18pFRAHhfkdqGcn84jDU8eyjNtwD',
        amount: '0.001',
        fee: '0.01'
    })),

    // originate contract
    tap(state => pendingOperation(stateWallet => ({
        publicKeyHash: 'tz1QBgNh18pFRAHhfkdqGcn84jDU8eyjNtwD',
    }))
    ),

    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })),


).subscribe(
    data => console.log('[+] ok'),
    error => console.error('[-] error', error)
)
