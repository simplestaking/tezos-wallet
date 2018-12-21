# Delegation

Delegation operation allows to temporarily move (lend) amount of tezos to other account in return for income.

<a id="setdelegation"></a>

### `<Const>` setDelegation

▸ **setDelegation**<`T`>(selector: *`function`*): `Observable<State & StateDelegation>`

*Defined in delegate/setDelegate.ts:31*

Set delegation rights to tezos address

**Type parameters:**

#### T :  [State](../docs/interfaces/state.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `function` |  provides data for delegation operation |

**Returns:** `Observable<State & StateDelegation>`


```
import { of } from 'rxjs';
import { initializeWallet, setDelegation, confirmOperation } from 'tezos-wallet';



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

    // delegate amount on originated contract
    setDelegation(state => ({        
        to: 'wallet address',
        fee: '0'
    })),

    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(state => ({
        injectionOperation: state.injectionOperation,
    }))    
).subscribe(
    state => console.log('delegation succeeded'),
    error => console.log('delegation failed', error)
)
```