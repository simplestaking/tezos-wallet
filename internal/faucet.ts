import { of, from, throwError } from 'rxjs'
import { flatMap, catchError, map, tap } from 'rxjs/operators'


import * as utils from '../src/common'
import * as fs from 'fs'

// support for node.js
import './node'
import { State, RpcError } from '../src/common';
import { initializeWallet, activateWallet, confirmOperation, getWallet, transaction } from '../src';

const config = {
    transaction: {
        to: 'tz1L1YBz3nDNypeHPbSXECZbLdYVyJaGhv7w',
        // to: 'tz1UX1CrhjPSEkV8qUZuYnDiNuJtmwTA1j2p',
        amount: '5.23',
        fee: '0.0013',
    },
    node: {
        name: 'zeronet',
        display: 'Zeronet',
        url: 'http://zeronet-node.tzscan.io',
        tzscan: {
            url: 'http://zeronet.tzscan.io/',
        }
    },
    type: 'web',
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
            catchError((error: RpcError) => {

                // ignore activation error and proceed if already activated
                return error.response && error.response[0].id === 'proto.alpha.operation.invalid_activation' ?
                    of({ ...error.state }) :
                    throwError(error)
            }),

            // get wallet info
            getWallet(),

            tap(stateWallet => console.log('[+] getWallet: balance', (stateWallet.getWallet.balance / 1000000))),

            // send xtz
            transaction(stateWallet => ({
                to: config.transaction.to,
                amount: (stateWallet.getWallet.balance / 1000000 / 10).toString(),
                // amount: 0.1,
                fee: config.transaction.fee,
                testRun: false
            })),

            catchError((error) => {

                // retry transaction with lowered amount to fit balance without fee
                if(error.response[0].id === 'proto.alpha.contract.balance_too_low'){

                    return of({ ...error.state }).pipe(
                        transaction(state => ({
                            to: config.transaction.to,
                            amount: (error.response[0].balance / 1000000).toString(),
                            fee: config.transaction.fee
                        }))
                    )
                } else {
                    console.error('Unhandled transaction error', error.response[0].id, error);
                    return throwError(error); 
                }
            }),

            // wait for transacation to be confirmed
            confirmOperation(stateWallet => ({
                injectionOperation: stateWallet.injectionOperation,
            })),

            // // originate contract
            // originateContract(stateWallet => ({
            //     amount: config.transaction.amount,
            //     fee: config.transaction.fee,
            // })),

        )),

    ).subscribe(data => {
        console.log('[result]', data)
    })

})
