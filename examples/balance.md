# Transaction

Purpose of transaction is to send amount of xtz from current wallet to different one.

<a id="getwallet"></a>

### `<Const>` getWallet

▸ **getWallet**<`T`>(): `Observable<State & StateWalletDetail>`

*Defined in wallet/getWallet.ts:14*

Get wallet details as balance

**Type parameters:**

#### T :  [State](../docs/interfaces/state.md)

**Returns:** `Observable<State & StateWalletDetail>`


```
import { of } from 'rxjs';
import { initializeWallet, getWallet } from 'tezos-wallet';



of([]).pipe(

    // define existing wallet and wait till its ready
    initializeWallet(state => ({
        secretKey: '...',
        publicKey: '...',
        publicKeyHash: '...',
        node: {
            name: 'mainnet',
            display: 'Mainnet',
            url: 'https://mainnet.simplestaking.com:3000',
            tzscan: {
                url: 'http://tzscan.io/',
            }
        },
        type: 'web' 
    })),

    // send amount to other wallet
    getWallet()
   
).subscribe(
    state => console.log(`Wallet balance is: ${state.getWallet.balance / 1000000} xtz`),
    error => console.log('Something went wrong while getting wallet balance', error)
)
```