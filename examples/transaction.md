# Transaction

Purpose of transaction is to send amount of xtz from current wallet to different one.

<a id="transaction"></a>

## `<Const>` transaction

▸ **transaction**<`T`>(selector: *`function`*): `Observable<State & StateTransaction>`

*Defined in transaction/createTransaction.ts:37*

Send amount to another wallet

Fully covers send useace and get transaction to blockchain

**Type parameters:**

#### T :  [State](../docs/interfaces/state.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `function` |  method returning transaction obejct |

**Returns:** `Observable<State & StateTransaction>`


```
import { of } from 'rxjs';
import { initializeWallet, transaction, confirmOperation } from 'tezos-wallet';



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
    transaction(state => ({        
        to: 'wallet address',
        amount: '0.001',
        fee: '0'
    })),

    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(state => ({
        injectionOperation: state.injectionOperation,
    }))    
).subscribe(
    state => console.log('transaction succeeded'),
    error => console.log('transaction failed', error)
)
```