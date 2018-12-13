import { of } from 'rxjs'

import { Config } from './src/types'

// support for node.js
import './node'
import { WalletType } from './src/utils/enums';
import { initializeWallet, transaction, confirmOperation } from './src';

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
    type: WalletType.WEB,
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
        type: wallet.type
    })),

    // originate contract
    transaction(() => ({
        to: 'tz1QBgNh18pFRAHhfkdqGcn84jDU8eyjNtwD',
        amount: '0.001',
        fee: '0'
    })),

    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })),


).subscribe(
    data => console.log('[+] ok'),
    error => console.error('[-] error', error)
)
