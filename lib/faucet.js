import { of, from, throwError } from 'rxjs';
import { flatMap, catchError, map, tap } from 'rxjs/operators';
import { initializeWallet, activateWallet, transaction, getWallet, confirmOperation } from './client';
import * as utils from './utils';
import * as fs from 'fs';
// support for node.js
import './node';
const config = {
    transaction: {
        to: 'tz1UX1CrhjPSEkV8qUZuYnDiNuJtmwTA1j2p',
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
    type: 'web',
};
// go to https://faucet.tzalpha.net/ and save files to ./faucet directory
// read connet of faucet files
const dir = './faucet/';
let faucets = [];
// read directory
const files = fs.readdirSync(dir);
files.forEach((file) => {
    // read file 
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
    from(faucets).pipe(flatMap(faucet => of(faucet).pipe(
    // create privateKey & publicKey form mnemonic
    map((faucet) => ({
        wallet: Object.assign({}, utils.keys(faucet.mnemonic, faucet.password), { secret: faucet.secret })
    })), tap((stateWallet) => console.log('\n\n[+] [stateWallet]', stateWallet.wallet.publicKeyHash)), 
    // wait for sodium to initialize
    initializeWallet(stateWallet => ({
        secretKey: stateWallet.wallet.secretKey,
        publicKey: stateWallet.wallet.publicKey,
        publicKeyHash: stateWallet.wallet.publicKeyHash,
        secret: stateWallet.wallet.secret,
        // set Tezos node
        node: config.node,
        // set wallet type: WEB, TREZOR_ONE, TREZOR_T
        type: config.type,
    })), 
    // activate wallet
    activateWallet(stateWallet => ({
        secret: stateWallet.wallet.secret
    })), 
    // wait for transaction to be confirmed
    confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
    })), 
    // continue if wallet was activated already, otherwise throw error
    catchError((error, caught) => {
        return error.response && error.response[0].id === 'proto.alpha.operation.invalid_activation' ?
            of({ wallet: error.state.wallet }) : throwError(error);
    }), 
    // get wallet info
    getWallet(), tap((stateWallet) => console.log('[+] getWallet: balance', (stateWallet.getWallet.balance / 1000000))), 
    // send XTZ if balance is > 100 xtz
    flatMap(stateWallet => (stateWallet.getWallet.balance / 1000000) > 100 ?
        of(stateWallet).pipe(
        // send xtz
        transaction(stateWallet => ({
            to: config.transaction.to,
            amount: ((stateWallet.getWallet.balance / 1000000) - 100),
            fee: config.transaction.fee,
        }))) :
        of(stateWallet))))).subscribe(data => {
        // console.log('[result]', data)
    });
});
//# sourceMappingURL=faucet.js.map