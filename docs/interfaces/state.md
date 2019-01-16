[tezos-wallet](../README.md) > [State](../interfaces/state.md)

# Interface: State

## Hierarchy

**State**

## Index

### Properties

* [activateWallet](state.md#activatewallet)
* [confirmOperation](state.md#confirmoperation)
* [constants](state.md#constants)
* [counter](state.md#counter)
* [getWallet](state.md#getwallet)
* [head](state.md#head)
* [injectionOperation](state.md#injectionoperation)
* [manager_key](state.md#manager_key)
* [mempool](state.md#mempool)
* [operation](state.md#operation)
* [operations](state.md#operations)
* [originateContract](state.md#originatecontract)
* [packOperationParameters](state.md#packoperationparameters)
* [pendingOperation](state.md#pendingoperation)
* [preapply](state.md#preapply)
* [rpc](state.md#rpc)
* [setDelegate](state.md#setdelegate)
* [signOperation](state.md#signoperation)
* [transaction](state.md#transaction)
* [validatedOperations](state.md#validatedoperations)
* [wallet](state.md#wallet)

---

## Properties

<a id="activatewallet"></a>

### `<Optional>` activateWallet

**● activateWallet**: *[ActivatedWallet](../#activatedwallet)*

*Defined in [common/state.ts:8](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L8)*

___
<a id="confirmoperation"></a>

### `<Optional>` confirmOperation

**● confirmOperation**: *[ConfirmOperation](../#confirmoperation)*

*Defined in [common/state.ts:9](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L9)*

___
<a id="constants"></a>

### `<Optional>` constants

**● constants**: *[HeadConstants](../#headconstants)*

*Defined in [common/state.ts:10](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L10)*

___
<a id="counter"></a>

### `<Optional>` counter

**● counter**: * `undefined` &#124; `number`
*

*Defined in [common/state.ts:11](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L11)*

___
<a id="getwallet"></a>

### `<Optional>` getWallet

**● getWallet**: *[WalletDetail](../#walletdetail)*

*Defined in [common/state.ts:12](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L12)*

___
<a id="head"></a>

### `<Optional>` head

**● head**: *[Head](../#head)*

*Defined in [common/state.ts:13](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L13)*

___
<a id="injectionoperation"></a>

### `<Optional>` injectionOperation

**● injectionOperation**: *[InjectionOperation](../#injectionoperation)*

*Defined in [common/state.ts:14](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L14)*

___
<a id="manager_key"></a>

### `<Optional>` manager_key

**● manager_key**: *[ManagerKey](../#managerkey)*

*Defined in [common/state.ts:15](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L15)*

___
<a id="mempool"></a>

### `<Optional>` mempool

**● mempool**: *[Mempool](../#mempool)*

*Defined in [common/state.ts:16](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L16)*

___
<a id="operation"></a>

### `<Optional>` operation

**● operation**: * `undefined` &#124; `string`
*

*Defined in [common/state.ts:18](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L18)*

___
<a id="operations"></a>

### `<Optional>` operations

**● operations**: *[OperationMetadata](../#operationmetadata)[]*

*Defined in [common/state.ts:19](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L19)*

___
<a id="originatecontract"></a>

### `<Optional>` originateContract

**● originateContract**: *[OriginatedContract](../#originatedcontract)*

*Defined in [common/state.ts:17](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L17)*

___
<a id="packoperationparameters"></a>

### `<Optional>` packOperationParameters

**● packOperationParameters**: *[PackOperationParameters](../#packoperationparameters)*

*Defined in [common/state.ts:20](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L20)*

___
<a id="pendingoperation"></a>

### `<Optional>` pendingOperation

**● pendingOperation**: *[PendingOperation](../#pendingoperation)*

*Defined in [common/state.ts:21](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L21)*

___
<a id="preapply"></a>

### `<Optional>` preapply

**● preapply**: *[PreapplyOperation](../#preapplyoperation)[]*

*Defined in [common/state.ts:22](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L22)*

___
<a id="rpc"></a>

### `<Optional>` rpc

**● rpc**: *[RpcParams](rpcparams.md)*

*Defined in [common/state.ts:23](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L23)*

___
<a id="setdelegate"></a>

### `<Optional>` setDelegate

**● setDelegate**: *[SetDelegate](../#setdelegate)*

*Defined in [common/state.ts:24](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L24)*

___
<a id="signoperation"></a>

### `<Optional>` signOperation

**● signOperation**: *[SignOperation](../#signoperation)*

*Defined in [common/state.ts:25](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L25)*

___
<a id="transaction"></a>

### `<Optional>` transaction

**● transaction**: *[Transaction](../#transaction)*

*Defined in [common/state.ts:26](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L26)*

___
<a id="validatedoperations"></a>

### `<Optional>` validatedOperations

**● validatedOperations**: *[ValidationResult](../#validationresult)*

*Defined in [common/state.ts:27](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L27)*

___
<a id="wallet"></a>

###  wallet

**● wallet**: *[Wallet](../#wallet)*

*Defined in [common/state.ts:28](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L28)*

___

