import { of } from 'rxjs';

// support for node.js
// @ts-ignore
import './node';
import { tap } from 'rxjs/operators';
import { getLedgerWallet } from '../src';
import { signLedgerOperation } from '../src';

console.log('[+] tezos-wallet client');

/* Get Ledger Wallet details */
// const walletObservable = of({});
//
// walletObservable.pipe(
//   getLedgerWallet(stateWallet => ({
//     transport: undefined,
//   })),
//   tap(state => {
//     console.log(JSON.stringify(state));
//   }),
// ).subscribe(
//   data => console.log('[+] ok'),
//   error => console.error('[-] error', error),
// );

/* Sign an operation using Ledger */
const state = {
  operation: '80e12752f5ee7e63c8c7c09e2e4088136b69dc638931c4221e376cc302eea76a6c0090c7d7304c93cbacecc7dbc06d233efc6b032ea0904e8ad3f904d08603810290a10f0000dcb8aa0d953c0a1a64f0e6b4bd9a670f8b4fa41c00',
  ledger: {
    transportHolder: {
      transport: undefined
    }
  }
} as any;
signLedgerOperation(state).pipe(
  tap(state => {
    console.log(JSON.stringify(state));
  }),
).subscribe(
  data => console.log('[+] ok'),
  error => console.error('[-] error', error),
);
