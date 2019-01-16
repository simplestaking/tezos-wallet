
Tezos Wallet
============

Client side library written in [Typescript](https://www.typescriptlang.org/) for building application utilizing [Tezos](http://tezos.com/) crypto currency and [Trezor](https://trezor.io/) hardware wallet.

Tezos wallet simplifies communication with Tezos nodes and significantly reduces burden of working with Tezos network.

Installation
------------

Add NPM package to the list of dependencies

`npm install tezos-wallet`

Project is based on [RxJS](https://rxjs-dev.firebaseapp.com/) and relies on it as peer dependency, therefore add supported version as dependency of you project.

`npm install rxjs@~6.3.2`

Development
-----------

Import the libary methods as `import { initializeWallet, getWallet } from 'tezos-wallet';`

Library is tested with Typescript versions 3.2.2.

Code
----

Code is well described and documentation generated using [Typedoc](http://typedoc.org/) can be viewed in [docs](/docs/README.md) folder.

Examples
--------

Code samples describing usage can be found in [example](/examples/index.md) folder.

## Index

### Interfaces

* [ActivateWalletOperationMetadata](interfaces/activatewalletoperationmetadata.md)
* [BaseOperationMetadata](interfaces/baseoperationmetadata.md)
* [Config](interfaces/config.md)
* [DelegationOperationMetadata](interfaces/delegationoperationmetadata.md)
* [OriginationOperationMetadata](interfaces/originationoperationmetadata.md)
* [RevealOperationMetadata](interfaces/revealoperationmetadata.md)
* [RpcParams](interfaces/rpcparams.md)
* [State](interfaces/state.md)
* [TZScanNode](interfaces/tzscannode.md)
* [TezosNode](interfaces/tezosnode.md)
* [TransactionOperationMetadata](interfaces/transactionoperationmetadata.md)
* [TrezorConnectResponse](interfaces/trezorconnectresponse.md)
* [TrezorMessage](interfaces/trezormessage.md)
* [WalletBase](interfaces/walletbase.md)

### Type aliases

* [ActivatedWallet](#activatedwallet)
* [BalanceUpdate](#balanceupdate)
* [ConfirmOperation](#confirmoperation)
* [ContractBalanceUpdate](#contractbalanceupdate)
* [ErrorKind](#errorkind)
* [FeeBalanceUpdate](#feebalanceupdate)
* [Head](#head)
* [HeadConstants](#headconstants)
* [InjectionError](#injectionerror)
* [InjectionOperation](#injectionoperation)
* [LowFeeError](#lowfeeerror)
* [ManagerKey](#managerkey)
* [Mempool](#mempool)
* [MempoolOperation](#mempooloperation)
* [OperationApplicationResult](#operationapplicationresult)
* [OperationMetadata](#operationmetadata)
* [OperationValidationResult](#operationvalidationresult)
* [OriginatedContract](#originatedcontract)
* [PackOperationParameters](#packoperationparameters)
* [PendingOperation](#pendingoperation)
* [PreapplyOperation](#preapplyoperation)
* [RpcError](#rpcerror)
* [SetDelegate](#setdelegate)
* [SignOperation](#signoperation)
* [StateActivateWallet](#stateactivatewallet)
* [StateConfirmOperation](#stateconfirmoperation)
* [StateConstants](#stateconstants)
* [StateCounter](#statecounter)
* [StateHead](#statehead)
* [StateInjectionOperation](#stateinjectionoperation)
* [StateManagerKey](#statemanagerkey)
* [StateMempool](#statemempool)
* [StateOperation](#stateoperation)
* [StateOperations](#stateoperations)
* [StateOriginateContract](#stateoriginatecontract)
* [StatePackOperationParameters](#statepackoperationparameters)
* [StatePendingOperation](#statependingoperation)
* [StatePreapplyOperation](#statepreapplyoperation)
* [StateSetDelegate](#statesetdelegate)
* [StateSignOperation](#statesignoperation)
* [StateTransaction](#statetransaction)
* [StateValidatedOperations](#statevalidatedoperations)
* [StateWallet](#statewallet)
* [StateWalletDetail](#statewalletdetail)
* [Transaction](#transaction)
* [TrezorDelegationOperation](#trezordelegationoperation)
* [TrezorOperationTarget](#trezoroperationtarget)
* [TrezorOriginationOperation](#trezororiginationoperation)
* [TrezorRevealOperation](#trezorrevealoperation)
* [TrezorTransactionOperation](#trezortransactionoperation)
* [ValidationError](#validationerror)
* [ValidationResult](#validationresult)
* [Wallet](#wallet)
* [WalletDetail](#walletdetail)

### Functions

* [activateWallet](#activatewallet)
* [applyAndInjectOperation](#applyandinjectoperation)
* [base58CheckDecode](#base58checkdecode)
* [bs58checkEncode](#bs58checkencode)
* [checkPropertyWithError](#checkpropertywitherror)
* [concatKeys](#concatkeys)
* [confirmOperation](#confirmoperation)
* [constants](#constants)
* [counter](#counter)
* [forgeOperation](#forgeoperation)
* [forgeOperationAtomic](#forgeoperationatomic)
* [getWallet](#getwallet)
* [hasAppliedOperationInMempool](#hasappliedoperationinmempool)
* [hasRefusedOperationInMempool](#hasrefusedoperationinmempool)
* [head](#head)
* [initializeWallet](#initializewallet)
* [injectOperations](#injectoperations)
* [keys](#keys)
* [managerKey](#managerkey)
* [newWallet](#newwallet)
* [operation](#operation)
* [operationIsValid](#operationisvalid)
* [originateContract](#originatecontract)
* [packOperationParameters](#packoperationparameters)
* [packOperationParametersAtomic](#packoperationparametersatomic)
* [parseAmount](#parseamount)
* [pendingOperation](#pendingoperation)
* [pendingOperationsAtomic](#pendingoperationsatomic)
* [preapplyOperations](#preapplyoperations)
* [ready](#ready)
* [rpc](#rpc)
* [setDelegation](#setdelegation)
* [signOperation](#signoperation)
* [signOperationTrezor](#signoperationtrezor)
* [transaction](#transaction)
* [updateFeesForOperation](#updatefeesforoperation)
* [validateOperation](#validateoperation)
* [validateOperationAtomic](#validateoperationatomic)
* [validateOriginationOperation](#validateoriginationoperation)
* [validateRevealOperation](#validaterevealoperation)
* [validateTransactionOperation](#validatetransactionoperation)

### Object literals

* [prefix](#prefix)

---

## Type aliases

<a id="activatedwallet"></a>

###  ActivatedWallet

**Ƭ ActivatedWallet**: *`object`*

*Defined in [common/state.ts:31](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L31)*

#### Type declaration

 secret: `string`

___
<a id="balanceupdate"></a>

###  BalanceUpdate

**Ƭ BalanceUpdate**: * [ContractBalanceUpdate](#contractbalanceupdate) &#124; [FeeBalanceUpdate](#feebalanceupdate)
*

*Defined in [common/operations.ts:65](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L65)*

___
<a id="confirmoperation"></a>

###  ConfirmOperation

**Ƭ ConfirmOperation**: *`object`*

*Defined in [common/state.ts:35](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L35)*

#### Type declaration

 injectionOperation: [InjectionOperation](#injectionoperation)

___
<a id="contractbalanceupdate"></a>

###  ContractBalanceUpdate

**Ƭ ContractBalanceUpdate**: *`object`*

*Defined in [common/operations.ts:51](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L51)*

#### Type declaration

 change: `string`

 contract: `string`

 kind: "contract"

___
<a id="errorkind"></a>

###  ErrorKind

**Ƭ ErrorKind**: * "temporary" &#124; "permanent"
*

*Defined in [common/errors.ts:4](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/errors.ts#L4)*

___
<a id="feebalanceupdate"></a>

###  FeeBalanceUpdate

**Ƭ FeeBalanceUpdate**: *`object`*

*Defined in [common/operations.ts:57](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L57)*

#### Type declaration

 category: "fees"

 change: `string`

 delegate: `string`

 kind: "freezer"

 level: `number`

___
<a id="head"></a>

###  Head

**Ƭ Head**: *`object`*

*Defined in [common/state.ts:67](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L67)*

#### Type declaration

 chain_id: `string`

 hash: `string`

 header: `object`

 context: `string`

 fitness: [`string`, `string`]

 level: `number`

 operations_hash: `string`

 predecessor: `string`

 priority: `number`

 proof_of_work_nonce: `string`

 proto: `number`

 signature: `string`

 timestamp: `string`

 validation_pass: `number`

 metadata: `object`

 baker: `string`

 balance_updates: `any`[]

 consumed_gas: `string`

 deactivated: `any`[]

 level: `any`

 max_block_header_length: `number`

 max_operation_data_length: `number`

 max_operation_list_length: `object`[]

 max_operations_ttl: `number`

 next_protocol: `string`

 nonce_hash:  `string` &#124; `null`

 protocol: `string`

 test_chain_status: `object`

 status:  "running" &#124; "not_running"

 voting_period_kind: "proposal"

 operations: `object`[]

 protocol: `string`

___
<a id="headconstants"></a>

###  HeadConstants

**Ƭ HeadConstants**: *`object`*

*Defined in [common/state.ts:39](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L39)*

#### Type declaration

 block_reward: `string`

 block_security_deposit: `string`

 blocks_per_commitment: `number`

 blocks_per_cycle: `number`

 blocks_per_roll_snapshot: `number`

 blocks_per_voting_period: `number`

 cost_per_byte: `string`

 endorsement_reward: `string`

 endorsement_security_deposit: `string`

 endorsers_per_block: `number`

 hard_gas_limit_per_block: `string`

 hard_gas_limit_per_operation: `string`

 hard_storage_limit_per_operation: `string`

 max_operation_data_length: `number`

 max_proposals_per_delegate: `number`

 max_revelations_per_block: `number`

 michelson_maximum_type_size: `number`

 nonce_length: `number`

 origination_size: `number`

 preserved_cycles: `number`

 proof_of_work_nonce_size: `number`

 proof_of_work_threshold: `string`

 seed_nonce_revelation_tip: `string`

 time_between_blocks: `string`[]

 tokens_per_roll: `string`

___
<a id="injectionerror"></a>

###  InjectionError

**Ƭ InjectionError**: *`object`*

*Defined in [common/errors.ts:24](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/errors.ts#L24)*

#### Type declaration

 response: `object`[]

 state: `S`

___
<a id="injectionoperation"></a>

###  InjectionOperation

**Ƭ InjectionOperation**: *`object`*

*Defined in [common/state.ts:119](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L119)*

#### Type declaration

___
<a id="lowfeeerror"></a>

###  LowFeeError

**Ƭ LowFeeError**: *`object`*

*Defined in [common/errors.ts:33](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/errors.ts#L33)*

#### Type declaration

 response: `object`[]

 state: `S`

___
<a id="managerkey"></a>

###  ManagerKey

**Ƭ ManagerKey**: *`object`*

*Defined in [common/state.ts:138](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L138)*

#### Type declaration

 key: `string`

 manager: `string`

___
<a id="mempool"></a>

###  Mempool

**Ƭ Mempool**: *`object`*

*Defined in [common/state.ts:130](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L130)*

#### Type declaration

 applied: [MempoolOperation](#mempooloperation)[]

 branch_delayed: [MempoolOperation](#mempooloperation)[]

 branch_refused: [MempoolOperation](#mempooloperation)[]

 refused: [MempoolOperation](#mempooloperation)[]

 unprocessed: [MempoolOperation](#mempooloperation)[]

___
<a id="mempooloperation"></a>

###  MempoolOperation

**Ƭ MempoolOperation**: *`object`*

*Defined in [common/state.ts:123](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L123)*

#### Type declaration

 branch: `string`

 contents: `any`

 hash: `string`

 signature: `string`

___
<a id="operationapplicationresult"></a>

###  OperationApplicationResult

**Ƭ OperationApplicationResult**: * [OperationValidationResult](#operationvalidationresult) & `object`
*

*Defined in [common/operations.ts:81](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L81)*

___
<a id="operationmetadata"></a>

###  OperationMetadata

**Ƭ OperationMetadata**: * [BaseOperationMetadata](interfaces/baseoperationmetadata.md) &  [RevealOperationMetadata](interfaces/revealoperationmetadata.md) &#124; [TransactionOperationMetadata](interfaces/transactionoperationmetadata.md) &#124; [OriginationOperationMetadata](interfaces/originationoperationmetadata.md) &#124; [DelegationOperationMetadata](interfaces/delegationoperationmetadata.md) &#124; [ActivateWalletOperationMetadata](interfaces/activatewalletoperationmetadata.md)

*

*Defined in [common/operations.ts:42](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L42)*

___
<a id="operationvalidationresult"></a>

###  OperationValidationResult

**Ƭ OperationValidationResult**: * [OperationMetadata](#operationmetadata) & `object`
*

*Defined in [common/operations.ts:67](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L67)*

___
<a id="originatedcontract"></a>

###  OriginatedContract

**Ƭ OriginatedContract**: *`object`*

*Defined in [common/state.ts:143](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L143)*

#### Type declaration

 amount: `string`

 fee: `string`

`Optional`  testRun:  `undefined` &#124; `false` &#124; `true`

 to: `string`

___
<a id="packoperationparameters"></a>

###  PackOperationParameters

**Ƭ PackOperationParameters**: *`object`*

*Defined in [common/state.ts:150](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L150)*

#### Type declaration

___
<a id="pendingoperation"></a>

###  PendingOperation

**Ƭ PendingOperation**: *`object`*

*Defined in [common/state.ts:154](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L154)*

#### Type declaration

 publicKeyHash: `string`

___
<a id="preapplyoperation"></a>

###  PreapplyOperation

**Ƭ PreapplyOperation**: *`object`*

*Defined in [common/state.ts:158](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L158)*

#### Type declaration

 contents: [OperationValidationResult](#operationvalidationresult)[]

 signature: `string`

___
<a id="rpcerror"></a>

###  RpcError

**Ƭ RpcError**: *`object`*

*Defined in [common/errors.ts:6](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/errors.ts#L6)*

#### Type declaration

 response: `object`[]

 state: `S`

___
<a id="setdelegate"></a>

###  SetDelegate

**Ƭ SetDelegate**: *`object`*

*Defined in [common/state.ts:163](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L163)*

#### Type declaration

 fee: `string`

`Optional`  testRun:  `undefined` &#124; `false` &#124; `true`

 to: `string`

___
<a id="signoperation"></a>

###  SignOperation

**Ƭ SignOperation**: *`object`*

*Defined in [common/state.ts:169](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L169)*

#### Type declaration

 operationHash: `string`

 signature: `string`

 signedOperationContents: `string`

___
<a id="stateactivatewallet"></a>

###  StateActivateWallet

**Ƭ StateActivateWallet**: *`object`*

*Defined in [wallet/activateWallet.ts:9](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/wallet/activateWallet.ts#L9)*

#### Type declaration

 activateWallet: [ActivatedWallet](#activatedwallet)

___
<a id="stateconfirmoperation"></a>

###  StateConfirmOperation

**Ƭ StateConfirmOperation**: *`object`*

*Defined in [operation/confirmOperation.ts:8](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/confirmOperation.ts#L8)*

#### Type declaration

 confirmOperation: `object`

 injectionOperation: [InjectionOperation](#injectionoperation)

___
<a id="stateconstants"></a>

###  StateConstants

**Ƭ StateConstants**: *`object`*

*Defined in [head/getConstants.ts:6](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/head/getConstants.ts#L6)*

#### Type declaration

 constants: [HeadConstants](#headconstants)

___
<a id="statecounter"></a>

###  StateCounter

**Ƭ StateCounter**: *`object`*

*Defined in [contract/getContractCounter.ts:6](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/contract/getContractCounter.ts#L6)*

#### Type declaration

 counter: `number`

___
<a id="statehead"></a>

###  StateHead

**Ƭ StateHead**: *`object`*

*Defined in [head/getHead.ts:6](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/head/getHead.ts#L6)*

#### Type declaration

 head: [Head](#head)

___
<a id="stateinjectionoperation"></a>

###  StateInjectionOperation

**Ƭ StateInjectionOperation**: *`object`*

*Defined in [operation/applyInjectOperation.ts:16](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/applyInjectOperation.ts#L16)*

#### Type declaration

 injectionOperation: [InjectionOperation](#injectionoperation)

___
<a id="statemanagerkey"></a>

###  StateManagerKey

**Ƭ StateManagerKey**: *`object`*

*Defined in [contract/getContractManagerKey.ts:6](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/contract/getContractManagerKey.ts#L6)*

#### Type declaration

 manager_key: [ManagerKey](#managerkey)

___
<a id="statemempool"></a>

###  StateMempool

**Ƭ StateMempool**: *`object`*

*Defined in [operation/pendingOperation.ts:6](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/pendingOperation.ts#L6)*

#### Type declaration

 mempool: [Mempool](#mempool)

___
<a id="stateoperation"></a>

###  StateOperation

**Ƭ StateOperation**: *`object`*

*Defined in [operation/forgeOperation.ts:16](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/forgeOperation.ts#L16)*

#### Type declaration

 operation: `string`

___
<a id="stateoperations"></a>

###  StateOperations

**Ƭ StateOperations**: *`object`*

*Defined in [operation/operation.ts:9](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/operation.ts#L9)*

#### Type declaration

 operations: [OperationMetadata](#operationmetadata)[]

___
<a id="stateoriginatecontract"></a>

###  StateOriginateContract

**Ƭ StateOriginateContract**: *`object`*

*Defined in [contract/originateContract.ts:14](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/contract/originateContract.ts#L14)*

#### Type declaration

 originateContract: [OriginatedContract](#originatedcontract)

___
<a id="statepackoperationparameters"></a>

###  StatePackOperationParameters

**Ƭ StatePackOperationParameters**: *`object`*

*Defined in [operation/packOperationData.ts:7](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/packOperationData.ts#L7)*

#### Type declaration

 packOperationParameters: [PackOperationParameters](#packoperationparameters)

___
<a id="statependingoperation"></a>

###  StatePendingOperation

**Ƭ StatePendingOperation**: *`object`*

*Defined in [operation/pendingOperation.ts:10](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/pendingOperation.ts#L10)*

#### Type declaration

 pendingOperation: [PendingOperation](#pendingoperation)

___
<a id="statepreapplyoperation"></a>

###  StatePreapplyOperation

**Ƭ StatePreapplyOperation**: *`object`*

*Defined in [operation/applyInjectOperation.ts:12](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/applyInjectOperation.ts#L12)*

#### Type declaration

 preapply: [PreapplyOperation](#preapplyoperation)

___
<a id="statesetdelegate"></a>

###  StateSetDelegate

**Ƭ StateSetDelegate**: *`object`*

*Defined in [delegate/setDelegate.ts:11](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/delegate/setDelegate.ts#L11)*

#### Type declaration

 setDelegate: [SetDelegate](#setdelegate)

___
<a id="statesignoperation"></a>

###  StateSignOperation

**Ƭ StateSignOperation**: *`object`*

*Defined in [operation/signOperation.ts:35](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/signOperation.ts#L35)*

#### Type declaration

 signOperation: [SignOperation](#signoperation)

___
<a id="statetransaction"></a>

###  StateTransaction

**Ƭ StateTransaction**: *`object`*

*Defined in [transaction/createTransaction.ts:11](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/transaction/createTransaction.ts#L11)*

#### Type declaration

 transaction: [Transaction](#transaction)

___
<a id="statevalidatedoperations"></a>

###  StateValidatedOperations

**Ƭ StateValidatedOperations**: *`object`*

*Defined in [operation/validateOperation.ts:10](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/validateOperation.ts#L10)*

#### Type declaration

 validatedOperations: [ValidationResult](#validationresult)

___
<a id="statewallet"></a>

###  StateWallet

**Ƭ StateWallet**: *`object`*

*Defined in [wallet/initializeWallet.ts:8](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/wallet/initializeWallet.ts#L8)*

#### Type declaration

 wallet: [Wallet](#wallet)

___
<a id="statewalletdetail"></a>

###  StateWalletDetail

**Ƭ StateWalletDetail**: *`object`*

*Defined in [wallet/getWallet.ts:5](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/wallet/getWallet.ts#L5)*

#### Type declaration

 getWallet: [WalletDetail](#walletdetail)

___
<a id="transaction"></a>

###  Transaction

**Ƭ Transaction**: *`object`*

*Defined in [common/state.ts:175](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L175)*

#### Type declaration

 amount: `string`

 fee: `string`

`Optional`  parameters: `Record`<`string`, `any`>

`Optional`  testRun:  `undefined` &#124; `false` &#124; `true`

 to: `string`

___
<a id="trezordelegationoperation"></a>

###  TrezorDelegationOperation

**Ƭ TrezorDelegationOperation**: *`object`*

*Defined in [common/operations.ts:123](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L123)*

#### Type declaration

 counter: `number`

 delegate: `string`

 fee: `number`

 gas_limit: `number`

 source: `string`

 storage_limit: `number`

___
<a id="trezoroperationtarget"></a>

###  TrezorOperationTarget

**Ƭ TrezorOperationTarget**: *`object`*

*Defined in [common/operations.ts:86](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L86)*

#### Type declaration

 hash:  `Uint8Array` &#124; `null`

 tag: `number`

___
<a id="trezororiginationoperation"></a>

###  TrezorOriginationOperation

**Ƭ TrezorOriginationOperation**: *`object`*

*Defined in [common/operations.ts:110](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L110)*

#### Type declaration

 balance: `number`

 counter: `number`

 delegatable: `boolean`

 delegate: `string`

 fee: `number`

 gas_limit: `number`

 manager_pubkey: `string`

 source: `string`

 spendable: `boolean`

 storage_limit: `number`

___
<a id="trezorrevealoperation"></a>

###  TrezorRevealOperation

**Ƭ TrezorRevealOperation**: *`object`*

*Defined in [common/operations.ts:91](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L91)*

#### Type declaration

 counter: `number`

 fee: `number`

 gas_limit: `number`

 public_key: `string`

 source: `string`

 storage_limit: `number`

___
<a id="trezortransactionoperation"></a>

###  TrezorTransactionOperation

**Ƭ TrezorTransactionOperation**: *`object`*

*Defined in [common/operations.ts:100](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/operations.ts#L100)*

#### Type declaration

 amount: `number`

 counter: `number`

 destination: `string`

 fee: `number`

 gas_limit: `number`

 source: `string`

 storage_limit: `number`

___
<a id="validationerror"></a>

###  ValidationError

**Ƭ ValidationError**: *`object`*

*Defined in [common/errors.ts:15](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/errors.ts#L15)*

#### Type declaration

 response: `object`[]

 state: `S`

___
<a id="validationresult"></a>

###  ValidationResult

**Ƭ ValidationResult**: *`object`*

*Defined in [common/state.ts:183](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L183)*

#### Type declaration

 contents: [OperationValidationResult](#operationvalidationresult)[]

___
<a id="wallet"></a>

###  Wallet

**Ƭ Wallet**: *`object`*

*Defined in [common/state.ts:187](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L187)*

#### Type declaration

`Optional`  mnemonic:  `undefined` &#124; `string`

 node: [TezosNode](interfaces/tezosnode.md)

`Optional`  path:  `undefined` &#124; `string`

`Optional`  publicKey:  `undefined` &#124; `string`

 publicKeyHash: `string`

`Optional`  secret:  `undefined` &#124; `string`

`Optional`  secretKey:  `undefined` &#124; `string`

`Optional`  type:  "web" &#124; "TREZOR_T" &#124; "TREZOR_P"

___
<a id="walletdetail"></a>

###  WalletDetail

**Ƭ WalletDetail**: *`object`*

*Defined in [common/state.ts:199](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/state.ts#L199)*

#### Type declaration

 balance: `number`

___

## Functions

<a id="activatewallet"></a>

### `<Const>` activateWallet

▸ **activateWallet**<`T`>(selector: *`function`*): `(Anonymous function)`

*Defined in [wallet/activateWallet.ts:20](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/wallet/activateWallet.ts#L20)*

Activate generated wallet address

**Type parameters:**

#### T :  [State](interfaces/state.md)
**Parameters:**

| Name | Type |
| ------ | ------ |
| selector | `function` |

**Returns:** `(Anonymous function)`
Observable

___
<a id="applyandinjectoperation"></a>

### `<Const>` applyAndInjectOperation

▸ **applyAndInjectOperation**<`T`>(): `(Anonymous function)`

*Defined in [operation/applyInjectOperation.ts:26](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/applyInjectOperation.ts#L26)*

Validates and inject operation into tezos blockain Can be applied to any prepared operation

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateHead](#statehead) & [StateOperations](#stateoperations) & [StateSignOperation](#statesignoperation)

**Returns:** `(Anonymous function)`

___
<a id="base58checkdecode"></a>

###  base58CheckDecode

▸ **base58CheckDecode**(this: *`void`*, prefix: *`Uint8Array`*, encoded: *`string`*): `Buffer`

*Defined in [common/crypto.ts:52](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L52)*

Decodes base58 encoded string into byte array and removes defined prefix

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| this | `void` |
| prefix | `Uint8Array` |  \- |
| encoded | `string` |   |

**Returns:** `Buffer`

___
<a id="bs58checkencode"></a>

###  bs58checkEncode

▸ **bs58checkEncode**(this: *`void`*, prefix: *`Uint8Array`*, payload: *`Uint8Array`*): `string`

*Defined in [common/crypto.ts:38](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L38)*

Encode byte array into base58check format using defined prefix

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| this | `void` |
| prefix | `Uint8Array` |  \- |
| payload | `Uint8Array` |   |

**Returns:** `string`

___
<a id="checkpropertywitherror"></a>

###  checkPropertyWithError

▸ **checkPropertyWithError**(o: *`Object`*, propName: *`string`*, methodName: *`string`*): `void`

*Defined in [common/validation.ts:41](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/validation.ts#L41)*

Ensure that defined property exists in object and throw syntax error if not

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| o | `Object` |  object to check |
| propName | `string` |  prop name |
| methodName | `string` |  user friendly method name for better error tracking |

**Returns:** `void`

___
<a id="concatkeys"></a>

###  concatKeys

▸ **concatKeys**(this: *`void`*, privateKey: *`Uint8Array`*, publicKey: *`Uint8Array`*): `Uint8Array`

*Defined in [common/crypto.ts:62](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L62)*

Concat together private and public key

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| this | `void` |
| privateKey | `Uint8Array` |  \- |
| publicKey | `Uint8Array` |   |

**Returns:** `Uint8Array`

___
<a id="confirmoperation"></a>

### `<Const>` confirmOperation

▸ **confirmOperation**<`T`>(selector: *`function`*): `(Anonymous function)`

*Defined in [operation/confirmOperation.ts:21](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/confirmOperation.ts#L21)*

Wait until operation is confirmed & moved from mempool to head

Polls mempool to check when operation is confirmed and moved to head

**Type parameters:**

#### T :  [State](interfaces/state.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `function` |  method returning operation hash to check in mempool |

**Returns:** `(Anonymous function)`

___
<a id="constants"></a>

### `<Const>` constants

▸ **constants**<`T`>(): `(Anonymous function)`

*Defined in [head/getConstants.ts:15](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/head/getConstants.ts#L15)*

Get constants used in block

**Type parameters:**

#### T :  [State](interfaces/state.md)

**Returns:** `(Anonymous function)`

___
<a id="counter"></a>

### `<Const>` counter

▸ **counter**<`T`>(): `(Anonymous function)`

*Defined in [contract/getContractCounter.ts:16](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/contract/getContractCounter.ts#L16)*

Get contract counter

**Type parameters:**

#### T :  [State](interfaces/state.md)

**Returns:** `(Anonymous function)`

___
<a id="forgeoperation"></a>

### `<Const>` forgeOperation

▸ **forgeOperation**<`T`>(): `(Anonymous function)`

*Defined in [operation/forgeOperation.ts:27](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/forgeOperation.ts#L27)*

Forge operation in blocchain. Converts operation into binary format and signs operation using script or Trezor

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateOperations](#stateoperations)

**Returns:** `(Anonymous function)`

___
<a id="forgeoperationatomic"></a>

### `<Const>` forgeOperationAtomic

▸ **forgeOperationAtomic**<`T`>(): `(Anonymous function)`

*Defined in [operation/forgeOperation.ts:69](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/forgeOperation.ts#L69)*

Converts operation to binary format on node

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateHead](#statehead) & [StateOperations](#stateoperations)

**Returns:** `(Anonymous function)`

___
<a id="getwallet"></a>

### `<Const>` getWallet

▸ **getWallet**<`T`>(): `(Anonymous function)`

*Defined in [wallet/getWallet.ts:14](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/wallet/getWallet.ts#L14)*

Get wallet details as balance

**Type parameters:**

#### T :  [State](interfaces/state.md)

**Returns:** `(Anonymous function)`

___
<a id="hasappliedoperationinmempool"></a>

###  hasAppliedOperationInMempool

▸ **hasAppliedOperationInMempool**(this: *[StateConfirmOperation](#stateconfirmoperation)*, operation: *[MempoolOperation](#mempooloperation)*): `boolean`

*Defined in [operation/confirmOperation.ts:68](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/confirmOperation.ts#L68)*

Check if mempool contains operation among applied
*__this__*: state with operation to confirm

**Parameters:**

| Name | Type |
| ------ | ------ |
| this | [StateConfirmOperation](#stateconfirmoperation) |
| operation | [MempoolOperation](#mempooloperation) |

**Returns:** `boolean`

___
<a id="hasrefusedoperationinmempool"></a>

###  hasRefusedOperationInMempool

▸ **hasRefusedOperationInMempool**(this: *[StateConfirmOperation](#stateconfirmoperation)*, operation: *[MempoolOperation](#mempooloperation)*): `boolean`

*Defined in [operation/confirmOperation.ts:59](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/confirmOperation.ts#L59)*

Check if mempool contains operation among refused
*__this__*: state with operation to confirm

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| this | [StateConfirmOperation](#stateconfirmoperation) |
| operation | [MempoolOperation](#mempooloperation) |  mempool operation |

**Returns:** `boolean`

___
<a id="head"></a>

### `<Const>` head

▸ **head**<`T`>(): `(Anonymous function)`

*Defined in [head/getHead.ts:13](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/head/getHead.ts#L13)*

Get head for operation

**Type parameters:**

#### T :  [State](interfaces/state.md)

**Returns:** `(Anonymous function)`

___
<a id="initializewallet"></a>

### `<Const>` initializeWallet

▸ **initializeWallet**<`T`>(selector: *`function`*): `(Anonymous function)`

*Defined in [wallet/initializeWallet.ts:17](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/wallet/initializeWallet.ts#L17)*

Waits for sodium to initialize and prepares wallet for working with it Should be the first step of every workflow

**Type parameters:**

#### T :  [Wallet](#wallet)
**Parameters:**

| Name | Type |
| ------ | ------ |
| selector | `function` |

**Returns:** `(Anonymous function)`

___
<a id="injectoperations"></a>

### `<Const>` injectOperations

▸ **injectOperations**<`T`>(): `(Anonymous function)`

*Defined in [operation/applyInjectOperation.ts:81](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/applyInjectOperation.ts#L81)*

Inbjects prevalidated operation to Tezos blockchain

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateHead](#statehead) & [StateOperations](#stateoperations) & [StateSignOperation](#statesignoperation)

**Returns:** `(Anonymous function)`

___
<a id="keys"></a>

###  keys

▸ **keys**(): [WalletBase](interfaces/walletbase.md)

▸ **keys**(mnemonic: *`string`*, password: *`string`*): [WalletBase](interfaces/walletbase.md)

*Defined in [common/crypto.ts:86](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L86)*

Generates wallet new wallet or uses provided mnemonic and password

**Returns:** [WalletBase](interfaces/walletbase.md)

*Defined in [common/crypto.ts:87](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L87)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| mnemonic | `string` |
| password | `string` |

**Returns:** [WalletBase](interfaces/walletbase.md)

___
<a id="managerkey"></a>

### `<Const>` managerKey

▸ **managerKey**<`T`>(): `(Anonymous function)`

*Defined in [contract/getContractManagerKey.ts:13](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/contract/getContractManagerKey.ts#L13)*

Get manager key for contract

**Type parameters:**

#### T :  [State](interfaces/state.md)

**Returns:** `(Anonymous function)`

___
<a id="newwallet"></a>

### `<Const>` newWallet

▸ **newWallet**(): `(Anonymous function)`

*Defined in [wallet/newWallet.ts:9](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/wallet/newWallet.ts#L9)*

Generate new menomonic, private, public key & tezos wallet address

**Returns:** `(Anonymous function)`

___
<a id="operation"></a>

### `<Const>` operation

▸ **operation**(): `(Anonymous function)`

*Defined in [operation/operation.ts:17](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/operation.ts#L17)*

Create operation in blockchain. Fully forge operation, validates it and inject into blockchain

**Returns:** `(Anonymous function)`

___
<a id="operationisvalid"></a>

###  operationIsValid

▸ **operationIsValid**(operation: *[OperationValidationResult](#operationvalidationresult)*): `boolean`

*Defined in [operation/validateOperation.ts:108](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/validateOperation.ts#L108)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| operation | [OperationValidationResult](#operationvalidationresult) |

**Returns:** `boolean`

___
<a id="originatecontract"></a>

### `<Const>` originateContract

▸ **originateContract**<`T`>(selector: *`function`*): `(Anonymous function)`

*Defined in [contract/originateContract.ts:37](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/contract/originateContract.ts#L37)*

Originate smart contract from implicit wallet. Contract will be used for delegation. Complete operations stack

**Type parameters:**

#### T :  [State](interfaces/state.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `function` |  derives origination data from state |

**Returns:** `(Anonymous function)`

___
<a id="packoperationparameters"></a>

### `<Const>` packOperationParameters

▸ **packOperationParameters**<`T`>(): `(Anonymous function)`

*Defined in [operation/packOperationData.ts:14](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/packOperationData.ts#L14)*

Serialize operation parameters into binary format

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateOperations](#stateoperations)

**Returns:** `(Anonymous function)`

___
<a id="packoperationparametersatomic"></a>

### `<Const>` packOperationParametersAtomic

▸ **packOperationParametersAtomic**<`T`>(): `(Anonymous function)`

*Defined in [operation/packOperationData.ts:30](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/packOperationData.ts#L30)*

Serialize operation parameters on node

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateOperations](#stateoperations)

**Returns:** `(Anonymous function)`

___
<a id="parseamount"></a>

###  parseAmount

▸ **parseAmount**(this: *`void`*, amount: *`string`*): `number`

*Defined in [common/crypto.ts:76](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L76)*

Convert string amount notation into number in milions

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| this | `void` |
| amount | `string` |  text amount (3.50 tez) |

**Returns:** `number`

___
<a id="pendingoperation"></a>

### `<Const>` pendingOperation

▸ **pendingOperation**<`T`>(selector: *`function`*): `(Anonymous function)`

*Defined in [operation/pendingOperation.ts:19](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/pendingOperation.ts#L19)*

Gets list of applied and refused operations in mempool for specific wallet

**Type parameters:**

#### T :  [State](interfaces/state.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `function` |  method returning operation object with public key used as filter |

**Returns:** `(Anonymous function)`

___
<a id="pendingoperationsatomic"></a>

### `<Const>` pendingOperationsAtomic

▸ **pendingOperationsAtomic**<`T`>(): `(Anonymous function)`

*Defined in [operation/pendingOperation.ts:51](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/pendingOperation.ts#L51)*

Gets mempool operations

**Type parameters:**

#### T :  [State](interfaces/state.md)

**Returns:** `(Anonymous function)`

___
<a id="preapplyoperations"></a>

### `<Const>` preapplyOperations

▸ **preapplyOperations**<`T`>(): `(Anonymous function)`

*Defined in [operation/applyInjectOperation.ts:61](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/applyInjectOperation.ts#L61)*

Prevalidates (preapply) operation on tezos node

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateHead](#statehead) & [StateSignOperation](#statesignoperation)

**Returns:** `(Anonymous function)`

___
<a id="ready"></a>

### `<Const>` ready

▸ **ready**(): `Promise`<`void`>

*Defined in [common/crypto.ts:114](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L114)*

Get sodium ready state

**Returns:** `Promise`<`void`>

___
<a id="rpc"></a>

### `<Const>` rpc

▸ **rpc**<`T`>(selector: *`function`*): `(Anonymous function)`

*Defined in [common/rpc.ts:20](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/rpc.ts#L20)*

Remote procedure call (RPC) on tezos node Returns state object with rpc result under property defined in rpc parameters

**Type parameters:**

#### T :  [State](interfaces/state.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `function` |  method returning rpc parameters |

**Returns:** `(Anonymous function)`

___
<a id="setdelegation"></a>

### `<Const>` setDelegation

▸ **setDelegation**<`T`>(selector: *`function`*): `(Anonymous function)`

*Defined in [delegate/setDelegate.ts:33](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/delegate/setDelegate.ts#L33)*

Set delegation rights to tezos address

**Type parameters:**

#### T :  [State](interfaces/state.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `function` |  provides data for delegation operation |

**Returns:** `(Anonymous function)`

___
<a id="signoperation"></a>

###  signOperation

▸ **signOperation**<`T`>(state: *`T`*): `Observable`< `T` & [State](interfaces/state.md) & `object` & `object` & `object`>

*Defined in [operation/signOperation.ts:45](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/signOperation.ts#L45)*

Sign operation in state. Software signing is used.
*__throws__*: TypeError when operation is not available in state

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateHead](#statehead) & [StateOperation](#stateoperation)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| state | `T` |  transaction state |

**Returns:** `Observable`< `T` & [State](interfaces/state.md) & `object` & `object` & `object`>

___
<a id="signoperationtrezor"></a>

###  signOperationTrezor

▸ **signOperationTrezor**<`T`>(state: *`T`*): `Observable`< `T` & [State](interfaces/state.md) & `object` & `object` & `object`>

*Defined in [operation/signOperation.ts:109](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/signOperation.ts#L109)*

Sign operation using hardware Trezor wallet
*__throws__*: Typerror when operation is not available

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateHead](#statehead) & [StateOperation](#stateoperation)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| state | `T` |  transaction state |

**Returns:** `Observable`< `T` & [State](interfaces/state.md) & `object` & `object` & `object`>

___
<a id="transaction"></a>

### `<Const>` transaction

▸ **transaction**<`T`>(selector: *`function`*): `(Anonymous function)`

*Defined in [transaction/createTransaction.ts:39](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/transaction/createTransaction.ts#L39)*

Send amount to another wallet

Fully covers send useace and get transaction to blockchain

**Type parameters:**

#### T :  [State](interfaces/state.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `function` |  method returning transaction obejct |

**Returns:** `(Anonymous function)`

___
<a id="updatefeesforoperation"></a>

### `<Const>` updateFeesForOperation

▸ **updateFeesForOperation**<`T`>(): `(Anonymous function)`

*Defined in [operation/forgeOperation.ts:89](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/forgeOperation.ts#L89)*

Estimates minimal fee for the operation and compares provided defined fees with minimal If provided fee is insuficient its overriden

When fee is modified operation has to be re-forged so signature is matching operation content

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateHead](#statehead) & [StateCounter](#statecounter) & [StateManagerKey](#statemanagerkey) & [StateOperation](#stateoperation) & [StateOperations](#stateoperations)

**Returns:** `(Anonymous function)`

___
<a id="validateoperation"></a>

### `<Const>` validateOperation

▸ **validateOperation**<`T`>(): `(Anonymous function)`

*Defined in [operation/validateOperation.ts:20](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/validateOperation.ts#L20)*

Validates operation on node to ensure, that operation can be executed and prefills gas consumption and storage size data

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateHead](#statehead) & [StateOperations](#stateoperations)

**Returns:** `(Anonymous function)`

___
<a id="validateoperationatomic"></a>

### `<Const>` validateOperationAtomic

▸ **validateOperationAtomic**<`T`>(): `(Anonymous function)`

*Defined in [operation/validateOperation.ts:92](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/operation/validateOperation.ts#L92)*

Serialize operation parameters on node

**Type parameters:**

#### T :   [State](interfaces/state.md) & [StateHead](#statehead) & [StateOperations](#stateoperations) & [StateSignOperation](#statesignoperation)

**Returns:** `(Anonymous function)`

___
<a id="validateoriginationoperation"></a>

###  validateOriginationOperation

▸ **validateOriginationOperation**(operation: *[OperationMetadata](#operationmetadata)*): `void`

*Defined in [common/validation.ts:27](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/validation.ts#L27)*

Check origination operation metadata in runtime to prevent hidden failues

**Parameters:**

| Name | Type |
| ------ | ------ |
| operation | [OperationMetadata](#operationmetadata) |

**Returns:** `void`

___
<a id="validaterevealoperation"></a>

###  validateRevealOperation

▸ **validateRevealOperation**(operation: *[OperationMetadata](#operationmetadata)*): `void`

*Defined in [common/validation.ts:6](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/validation.ts#L6)*

Check reveal operation metadata in runtime to prevent hidden failues

**Parameters:**

| Name | Type |
| ------ | ------ |
| operation | [OperationMetadata](#operationmetadata) |

**Returns:** `void`

___
<a id="validatetransactionoperation"></a>

###  validateTransactionOperation

▸ **validateTransactionOperation**(operation: *[OperationMetadata](#operationmetadata)*): `void`

*Defined in [common/validation.ts:16](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/validation.ts#L16)*

Check transaction operation metadata in runtime to prevent hidden failues

**Parameters:**

| Name | Type |
| ------ | ------ |
| operation | [OperationMetadata](#operationmetadata) |

**Returns:** `void`

___

## Object literals

<a id="prefix"></a>

### `<Const>` prefix

**prefix**: *`object`*

*Defined in [common/crypto.ts:18](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L18)*

Prefix table

<a id="prefix.b"></a>

####  B

**● B**: *`Uint8Array`* =  new Uint8Array([1, 52])

*Defined in [common/crypto.ts:23](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L23)*

___
<a id="prefix.kt1"></a>

####  KT1

**● KT1**: *`Uint8Array`* =  new Uint8Array([2, 90, 121])

*Defined in [common/crypto.ts:22](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L22)*

___
<a id="prefix.edpk"></a>

####  edpk

**● edpk**: *`Uint8Array`* =  new Uint8Array([13, 15, 37, 217])

*Defined in [common/crypto.ts:24](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L24)*

___
<a id="prefix.edsig"></a>

####  edsig

**● edsig**: *`Uint8Array`* =  new Uint8Array([9, 245, 205, 134, 18])

*Defined in [common/crypto.ts:29](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L29)*

___
<a id="prefix.edsk32"></a>

####  edsk32

**● edsk32**: *`Uint8Array`* =  new Uint8Array([13, 15, 58, 7])

*Defined in [common/crypto.ts:28](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L28)*

___
<a id="prefix.edsk64"></a>

####  edsk64

**● edsk64**: *`Uint8Array`* =  new Uint8Array([43, 246, 78, 7])

*Defined in [common/crypto.ts:27](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L27)*

___
<a id="prefix.operation"></a>

####  operation

**● operation**: *`Uint8Array`* =  new Uint8Array([5, 116])

*Defined in [common/crypto.ts:30](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L30)*

___
<a id="prefix.p2pk"></a>

####  p2pk

**● p2pk**: *`Uint8Array`* =  new Uint8Array([3, 178, 139, 127])

*Defined in [common/crypto.ts:26](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L26)*

___
<a id="prefix.sppk"></a>

####  sppk

**● sppk**: *`Uint8Array`* =  new Uint8Array([3, 254, 226, 86])

*Defined in [common/crypto.ts:25](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L25)*

___
<a id="prefix.tz1"></a>

####  tz1

**● tz1**: *`Uint8Array`* =  new Uint8Array([6, 161, 159])

*Defined in [common/crypto.ts:19](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L19)*

___
<a id="prefix.tz2"></a>

####  tz2

**● tz2**: *`Uint8Array`* =  new Uint8Array([6, 161, 161])

*Defined in [common/crypto.ts:20](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L20)*

___
<a id="prefix.tz3"></a>

####  tz3

**● tz3**: *`Uint8Array`* =  new Uint8Array([6, 161, 164])

*Defined in [common/crypto.ts:21](https://github.com/simplestaking/tezos-wallet/blob/8c18c9f/src/common/crypto.ts#L21)*

___

___

