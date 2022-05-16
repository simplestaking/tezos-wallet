import { of } from 'rxjs';

// support for node.js
// @ts-ignore
import './node';
import { tap } from 'rxjs/operators';
import { getLedgerWallet } from '../src/wallet/getLedgerWallet';

console.log('[+] tezos-wallet client');

const walletObservable = of({});

walletObservable.pipe(
  getLedgerWallet(),
  tap(state => {
    console.log(JSON.stringify(state));
  })
).subscribe(
  data => console.log('[+] ok'),
  error => console.error('[-] error', error)
);

