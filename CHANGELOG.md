# 1.0.0
Initial release supporting Tezos:
- contract origination
- delegation
- transaction
- check operation status
- create new wallet
- activate wallet
- gas limit, storage limit and fees are automatically estimated

## 1.1.0
- Improved fees calculation to be more precise
- Operations test run on node (run_operation rpc call) is now optional

### 1.1.1
- fixed origination operation with Trezor on mainet (manager_pubkey used instead of managerPubkey)

### 1.1.2
- fixed manager_pubkey handling for Trezor Connect