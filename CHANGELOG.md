## 1.0.0
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

## 1.2
- Support for new trezor-connect 7.0.1

### 1.2.1
- fixed manager_pubkey handling for Trezor Connect

### 1.2.2
- added extra gas for safety 

### 1.2.3
- fixed mempool check 

### 1.2.4
- fixed manage_key for Babylon update

### 1.2.5
- Support for new trezor-connect 8.0.6

### 1.2.6
- Added support for manger.tz 

### 1.2.7
- Added support for KT to KT transfer

### 1.2.8
- Fixed issue with fee for inactive accounts

## 1.3
- Fixed origination

### 1.3.1
- Fixed issue with storage limit 

### 1.3.2
- Added newWallet and changed default gas fees 

### 1.3.3
- Added support for new 2.3.0 firmware