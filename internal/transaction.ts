import { of } from 'rxjs';

import { Config, initializeWallet, transaction } from '../src';

// support for node.js
// @ts-ignore
import './node';

console.log('[+] tezos wallet client');

// wallet used to create transaction with small tez amount
const wallet: Config = {

  // secretKey: 'edsk3hEtniBGLP2wqYnc1Lix1hhV74eEenRBTfxjHTRHP59R7BapMW',
  // publicKey: 'edpkth42B7j7rvLeZWmufj28a7sEdbMBb9y16qgQmGHYGX4hPis9V4',
  // publicKeyHash: 'tz1WCojrEZWrjenejUZmG8QNsMtKPELx2TFA',

  secretKey: 'edsk48vvey4bjEQjmJ16iFun9tLKs3A5Qmx5iTida3fakpqSVw1qLQ',
  publicKey: 'edpkvPepgUwmic1rNCnHqe4kht8R5mbMLDBRHVWP5d19nmUbYQv9gy',
  publicKeyHash: 'tz1YqZPuie4xLmFakAYHKRwgQMLsA4BCRkpu',

  node: {
    name: 'testnet',
    display: 'Testnet',
    url: 'http://116.202.128.230:18732',
    tzstats: {
      url: 'http://116.202.128.230:18732/account/'
    }
  },
  type: 'web',
};

const walletObservable = of([]);

walletObservable.pipe(
  // wait for sodium to initialize
  initializeWallet(stateWallet => ({
    secretKey: wallet.secretKey,
    publicKey: wallet.publicKey,
    publicKeyHash: wallet.publicKeyHash,
    // set Tezos node
    node: wallet.node,
    // set wallet type: WEB, TREZOR_ONE, TREZOR_T, LEDGER
    type: wallet.type,
  })),

  // generate new tezos wallet with keys
  // newWallet(),

  // originate contract
  transaction(stateWallet => ([
    {
      to: 'tz1fm6a28VahUmoGkRV2RwuBMhtYNztkrtJy',
      // to: stateWallet.newWallet ? stateWallet.newWallet.publicKeyHash : 'tz1N4wqm7mqCFECjh8HUNHLyxfL73ay981LH',
      amount: '0.005',
      fee: '0.01'
    }
  ])),

  // // originate contract
  // tap(state => pendingOperation(stateWallet => ({
  //     publicKeyHash: stateWallet.newWallet ? stateWallet.newWallet.publicKeyHash : 'tz1N4wqm7mqCFECjh8HUNHLyxfL73ay981LH',
  // }))
  // ),

  // // wait until operation is confirmed & moved from mempool to head
  // confirmOperation(stateWallet => ({
  //     injectionOperation: stateWallet.injectionOperation,
  // })),


).subscribe(
  data => console.log('[+] ok'),
  error => console.error('[-] error', error)
);

