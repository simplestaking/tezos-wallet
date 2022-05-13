import { Buffer } from 'buffer';
import { blake2b } from 'blakejs';
import * as Bs58check from 'bs58check';

export interface KeyPair {
  sk: string | null;
  pk: string | null;
  pkh: string;
}

export class OperationService {
  prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    tz2: new Uint8Array([6, 161, 161]),
    tz3: new Uint8Array([6, 161, 164]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    sppk: new Uint8Array([3, 254, 226, 86]),
    edsk: new Uint8Array([43, 246, 78, 7]),
    spsk: new Uint8Array([17, 162, 224, 201]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    spsig: new Uint8Array([13, 115, 101, 19, 63]),
    sig: new Uint8Array([4, 130, 43]),
    o: new Uint8Array([5, 116]),
    B: new Uint8Array([1, 52]),
    TZ: new Uint8Array([3, 99, 29]),
    KT: new Uint8Array([2, 90, 121])
  };
  feeHardCap = 10;
  pk2pkh(pk: string): string {
    if (pk.length === 54 && pk.slice(0, 4) === 'edpk') {
      const pkDecoded = this.b58cdecode(pk, this.prefix.edpk);
      // @ts-ignore
      return this.b58cencode(blake2b(pkDecoded, null, 20), this.prefix.tz1);
    } else if (pk.length === 55 && pk.slice(0, 4) === 'sppk') {
      const pkDecoded = this.b58cdecode(pk, this.prefix.edpk);
      // @ts-ignore
      return this.b58cencode(blake2b(pkDecoded, null, 20), this.prefix.tz2);
    }
    throw new Error('Invalid public key');
  }

  hex2pk(hex: string): string {
    // @ts-ignore
    return this.b58cencode(this.hex2buf(hex.slice(2, 66)), this.prefix.edpk);
  }

  hex2buf(hex: any) {
    return new Uint8Array(
      hex.match(/[\da-f]{2}/gi).map((h: string) => parseInt(h, 16))
    );
  }

  buf2hex(buffer: any) {
    const byteArray = new Uint8Array(buffer);
    const hexParts = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < byteArray.length; i++) {
      const hex = byteArray[i].toString(16);
      const paddedHex = ('00' + hex).slice(-2);
      hexParts.push(paddedHex);
    }
    return hexParts.join('');
  }

  b58cencode(payload: any, prefixx?: Uint8Array) {
    if (prefixx === undefined) {
      return;
    }
    const n = new Uint8Array(prefixx.length + payload.length);
    n.set(prefixx);
    n.set(payload, prefixx.length);
    return Bs58check.encode(Buffer.from(this.buf2hex(n), 'hex'));
  }

  b58cdecode(enc: any, prefixx: any) {
    let n = Bs58check.decode(enc);
    n = n.slice(prefixx.length);
    return n;
  }

  ledgerPreHash(opbytes: string): string {
    // @ts-ignore
    return this.buf2hex(blake2b(this.hex2buf(opbytes), null, 32));
  }

  hexsigToEdsig(hex: string): string {
    // @ts-ignore
    return this.b58cencode(this.hex2buf(hex), this.prefix.edsig);
  }

  sig2edsig(sig: string): any {
    return this.b58cencode(this.hex2buf(sig), this.prefix.edsig);
  }

  decodeString(bytes: string): string {
    return Buffer.from(this.hex2buf(bytes)).toString('utf-8');
  }

  getContractDelegation(pkh: string) {
    return {
      entrypoint: 'do',
      value: [
        { prim: 'DROP' },
        {
          prim: 'NIL',
          args: [{ prim: 'operation' }]
        },
        {
          prim: 'PUSH',
          args: [
            { prim: 'key_hash' },
            {
              string: pkh
            }
          ]
        },
        { prim: 'SOME' },
        { prim: 'SET_DELEGATE' },
        { prim: 'CONS' }
      ]
    };
  }

  getContractUnDelegation() {
    return {
      entrypoint: 'do',
      value: [
        { prim: 'DROP' },
        {
          prim: 'NIL',
          args: [{ prim: 'operation' }]
        },
        {
          prim: 'NONE',
          args: [{ prim: 'key_hash' }]
        },
        { prim: 'SET_DELEGATE' },
        { prim: 'CONS' }
      ]
    };
  }

  getContractPkhTransaction(to: string, amount: string) {
    return {
      entrypoint: 'do',
      value: [
        { prim: 'DROP' },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        {
          prim: 'PUSH',
          args: [
            { prim: 'key_hash' },
            {
              string: to
            }
          ]
        },
        { prim: 'IMPLICIT_ACCOUNT' },
        {
          prim: 'PUSH',
          args: [{ prim: 'mutez' }, { int: amount }]
        },
        { prim: 'UNIT' },
        { prim: 'TRANSFER_TOKENS' },
        { prim: 'CONS' }
      ]
    };
  }

  getContractKtTransaction(to: string, amount: string) {
    return {
      entrypoint: 'do',
      value: [
        { prim: 'DROP' },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        {
          prim: 'PUSH',
          args: [{ prim: 'address' }, { string: to }]
        },
        { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
        [
          {
            prim: 'IF_NONE',
            args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []]
          }
        ],
        {
          prim: 'PUSH',
          args: [{ prim: 'mutez' }, { int: amount }]
        },
        { prim: 'UNIT' },
        { prim: 'TRANSFER_TOKENS' },
        { prim: 'CONS' }
      ]
    };
  }

  getManagerScript(pkh: string) {
    let pkHex: string;
    if (pkh.slice(0, 2) === 'tz') {
      pkHex = '00' + this.buf2hex(this.b58cdecode(pkh, this.prefix.tz1));
    } else {
      pkHex = pkh;
    }
    return {
      code: [
        {
          prim: 'parameter',
          args: [
            {
              prim: 'or',
              args: [
                {
                  prim: 'lambda',
                  args: [
                    {
                      prim: 'unit'
                    },
                    {
                      prim: 'list',
                      args: [
                        {
                          prim: 'operation'
                        }
                      ]
                    }
                  ],
                  annots: ['%do']
                },
                {
                  prim: 'unit',
                  annots: ['%default']
                }
              ]
            }
          ]
        },
        {
          prim: 'storage',
          args: [
            {
              prim: 'key_hash'
            }
          ]
        },
        {
          prim: 'code',
          args: [
            [
              [
                [
                  {
                    prim: 'DUP'
                  },
                  {
                    prim: 'CAR'
                  },
                  {
                    prim: 'DIP',
                    args: [
                      [
                        {
                          prim: 'CDR'
                        }
                      ]
                    ]
                  }
                ]
              ],
              {
                prim: 'IF_LEFT',
                args: [
                  [
                    {
                      prim: 'PUSH',
                      args: [
                        {
                          prim: 'mutez'
                        },
                        {
                          int: '0'
                        }
                      ]
                    },
                    {
                      prim: 'AMOUNT'
                    },
                    [
                      [
                        {
                          prim: 'COMPARE'
                        },
                        {
                          prim: 'EQ'
                        }
                      ],
                      {
                        prim: 'IF',
                        args: [
                          [],
                          [
                            [
                              {
                                prim: 'UNIT'
                              },
                              {
                                prim: 'FAILWITH'
                              }
                            ]
                          ]
                        ]
                      }
                    ],
                    [
                      {
                        prim: 'DIP',
                        args: [
                          [
                            {
                              prim: 'DUP'
                            }
                          ]
                        ]
                      },
                      {
                        prim: 'SWAP'
                      }
                    ],
                    {
                      prim: 'IMPLICIT_ACCOUNT'
                    },
                    {
                      prim: 'ADDRESS'
                    },
                    {
                      prim: 'SENDER'
                    },
                    [
                      [
                        {
                          prim: 'COMPARE'
                        },
                        {
                          prim: 'EQ'
                        }
                      ],
                      {
                        prim: 'IF',
                        args: [
                          [],
                          [
                            [
                              {
                                prim: 'UNIT'
                              },
                              {
                                prim: 'FAILWITH'
                              }
                            ]
                          ]
                        ]
                      }
                    ],
                    {
                      prim: 'UNIT'
                    },
                    {
                      prim: 'EXEC'
                    },
                    {
                      prim: 'PAIR'
                    }
                  ],
                  [
                    {
                      prim: 'DROP'
                    },
                    {
                      prim: 'NIL',
                      args: [
                        {
                          prim: 'operation'
                        }
                      ]
                    },
                    {
                      prim: 'PAIR'
                    }
                  ]
                ]
              }
            ]
          ]
        }
      ],
      storage: { bytes: pkHex }
    };
  }

  getFA12Transaction(from: string, to: string, amount: string) {
    return {
      entrypoint: 'transfer',
      value: {
        args: [
          {
            string: from
          },
          {
            args: [
              {
                string: to
              },
              {
                int: amount
              }
            ],
            prim: 'Pair'
          }
        ],
        prim: 'Pair'
      }
    };
  }
}
