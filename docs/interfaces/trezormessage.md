[tezos-wallet](../README.md) > [TrezorMessage](../interfaces/trezormessage.md)

# Interface: TrezorMessage

## Hierarchy

**TrezorMessage**

## Index

### Properties

* [branch](trezormessage.md#branch)
* [operation](trezormessage.md#operation)
* [path](trezormessage.md#path)

---

## Properties

<a id="branch"></a>

###  branch

**● branch**: *`any`*

*Defined in [operation/signOperation.ts:17](https://github.com/simplestaking/tezos-wallet/blob/456a549/src/operation/signOperation.ts#L17)*

___
<a id="operation"></a>

###  operation

**● operation**: *`object`*

*Defined in [operation/signOperation.ts:18](https://github.com/simplestaking/tezos-wallet/blob/456a549/src/operation/signOperation.ts#L18)*

#### Type declaration

`Optional`  delegation: [TrezorDelegationOperation](../#trezordelegationoperation)

`Optional`  origination: [TrezorOriginationOperation](../#trezororiginationoperation)

`Optional`  reveal: [TrezorRevealOperation](../#trezorrevealoperation)

`Optional`  transaction: [TrezorTransactionOperation](../#trezortransactionoperation)

___
<a id="path"></a>

###  path

**● path**: *`string`*

*Defined in [operation/signOperation.ts:16](https://github.com/simplestaking/tezos-wallet/blob/456a549/src/operation/signOperation.ts#L16)*

___

