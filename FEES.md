# Fee changes due to Proto 003 update

**Fees are in mutez, and should be at least:**

```minfees >= 100 + (gas * 0.1) + (opbytes)```

Fees are in nanotez (1 nanotez is 0.000 001 tez)

**Reveals**
- storage_limit : 0
- gas_limit : 10000
- opbytes : ~169
- fee : 1269

**Delegations**
- storage_limit : 0
- gas_limit : 10000
- opbytes : ~147
- fee : 1257

**Originations**
- storage_limit : 257
- gas_limit : 10000
- opbytes : ~179
- fee : ~1289 + 257 000 burn from source account


**Transactions to KT1/active implicit account***
- storage_limit : 0
- gas_limit : 10200
- opbytes : ~155
- fee : 1275

**Transactions to inactive implicit account**
- storage_limit : 257
- gas_limit : 10100
- opbytes : ~155
- fee : 1275 + 257 000 burn from source account

**Emptying an implicit account**
- gas_limit: add 160
- fee: add 16
