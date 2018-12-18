import { of, from, throwError } from 'rxjs'
import { flatMap, catchError, map, tap } from 'rxjs/operators'


import * as utils from '../src/utils'
import * as fs from 'fs'

// support for node.js
import './node'
import { WalletType } from '../src/utils/enums';
import { State, RpcError } from '../src/types';
import { initializeWallet, activateWallet, confirmOperation, getWallet, transaction } from '../src';

const config = {
    transaction: {
        // hw_trezor_zero
        to: 'tz1UQfd6Hqbfy9x4yQAA9XdkZih57aZYYtnC',
        // to: 'tz1UX1CrhjPSEkV8qUZuYnDiNuJtmwTA1j2p',
        amount: '1.23',
        fee: '1',
    },
    node: {
        name: 'zeronet',
        display: 'Zeronet',
        url: 'https://zeronet.simplestaking.com:3000',
        tzscan: {
            url: 'http://zeronet.tzscan.io/',
        }
    },
    type: WalletType.WEB,
}

// go to https://faucet.tzalpha.net/ and save files to ./faucet directory
// read connet of faucet files
const dir = './faucet/'
let faucets: {
    publicKeyHash: string
    mnemonic: string
    password: string,
    secret: string
}[] = []

// read directory
const files = fs.readdirSync(dir);
files.forEach((file: any) => {
    // read file 
    console.log('[file]', file)

    let faucet = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
    // save only files with mnemonic
    if (faucet.hasOwnProperty('mnemonic')) {
        faucets.push({
            'publicKeyHash': faucet.pkh,
            'mnemonic': faucet.mnemonic.join(' '),
            'password': faucet.email + faucet.password,
            'secret': faucet.secret,
        });
    }
});

// console.log(faucets[0])

// wait for sodium to initialize
utils.ready().then(() => {

    // activate wallet
    from(faucets).pipe(

        flatMap(faucet => of(faucet).pipe(

            // create privateKey & publicKey form mnemonic
            map((faucet) => ({
                wallet: {
                    ...utils.keys(faucet.mnemonic, faucet.password),
                    secret: faucet.secret,
                }
            })),

            tap((stateWallet) => console.log('\n\n[+] [stateWallet]', stateWallet.wallet.publicKeyHash)),

            // wait for sodium to initialize
            initializeWallet(stateWallet => ({
                secretKey: stateWallet.wallet.secretKey,
                publicKey: stateWallet.wallet.publicKey,
                publicKeyHash: stateWallet.wallet.publicKeyHash,
                secret: stateWallet.wallet.secret,
                // set Tezos node
                node: config.node,
                // set wallet type: WEB, TREZOR_ONE, TREZOR_T
                type: 'web',
            })),

            // activate wallet
            activateWallet(stateWallet => ({
                secret: <string>stateWallet.wallet.secret
            })),

            // wait for transaction to be confirmed
            confirmOperation(stateWallet => ({
                injectionOperation: stateWallet.injectionOperation,
            })),

            // continue if wallet was activated already, otherwise throw error
            catchError<State, State>((error: RpcError) => {

                // ignore activation error and proceed if already activated
                return error.response && error.response[0].id === 'proto.alpha.operation.invalid_activation' ?
                    of({ ...error.state }) : 
                    throwError(error)
            }),

            // get wallet info
            getWallet(),

            tap((stateWallet) => console.log('[+] getWallet: balance', (stateWallet.getWallet.balance / 1000000))),

            // send XTZ if balance is > 100 xt
            flatMap(stateWallet => (stateWallet.getWallet.balance / 1000000) > 1 ?
                of(stateWallet).pipe(                    

                    // send xtz
                    transaction(stateWallet => ({
                        to: config.transaction.to,
                        amount: ((stateWallet.getWallet.balance / 1000000) - 100).toString(),
                        // amount: 0.1,
                        fee: config.transaction.fee,
                    })),

                    // wait for transacation to be confirmed
                    confirmOperation(stateWallet => ({
                        injectionOperation: stateWallet.injectionOperation,
                    })),

                ) :
                of(stateWallet)
            ),

            // // originate contract
            // originateContract(stateWallet => ({
            //     amount: config.transaction.amount,
            //     fee: config.transaction.fee,
            // })),

        )),

    ).subscribe(data => {
        // console.log('[result]', data)
    })

})
