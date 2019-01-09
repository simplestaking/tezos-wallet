# Origination

Origination operation creates a contract from the implicit wallet. Contract could hold the code and delegate funds.

<a id="originatecontract"></a>

### `<Const>` originateContract

▸ **originateContract**<`T`>(selector: *`function`*): `Observable<State & OriginatedContract>`

*Defined in contract/originateContract.ts:36*

Originate smart contract from implicit wallet. Contract will be used for delegation. Complete operations stack

**Type parameters:**

#### T :  [State](../docs/interfaces/state.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `function` |  derives origination data from state |

**Returns:** `Observable<State & OriginatedContract>`


```
import { of } from 'rxjs';
import { initializeWallet, originateContract, confirmOperation } from 'tezos-wallet';



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

    // originate a contract account with defined amount
    originateContract(state => ({        
        to: 'wallet address',
        amount: '0.01',
        fee: '0.01'
    })),

    // wait until operation is confirmed & moved from mempool to head
    confirmOperation(state => ({
        injectionOperation: state.injectionOperation,
    }))    
).subscribe(
    state => console.log('origination succeeded'),
    error => console.log('origination failed', error)
)
```