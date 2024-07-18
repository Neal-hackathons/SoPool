/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/staking.json`.
 */
export type Staking = {
  "address": "2X9yDvzea1rfp7NyRn9Fwi9ikhh2ho84pvDJ34GQSvWb",
  "metadata": {
    "name": "staking",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "add",
      "discriminator": [
        41,
        249,
        249,
        146,
        197,
        111,
        56,
        181
      ],
      "accounts": [
        {
          "name": "tokenX"
        },
        {
          "name": "syntheticX",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  121,
                  110,
                  116,
                  104,
                  101,
                  116,
                  105,
                  99
                ]
              },
              {
                "kind": "account",
                "path": "tokenX"
              }
            ]
          }
        },
        {
          "name": "vaultX",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tokenX"
              }
            ]
          }
        },
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "senderTokenX",
          "writable": true
        },
        {
          "name": "senderTokenSynthX",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "receipt",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tokenX"
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "depositAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "syntheticX",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  121,
                  110,
                  116,
                  104,
                  101,
                  116,
                  105,
                  99
                ]
              },
              {
                "kind": "account",
                "path": "tokenX"
              }
            ]
          }
        },
        {
          "name": "vaultX",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tokenX"
              }
            ]
          }
        },
        {
          "name": "tokenX"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "newStaker",
      "discriminator": [
        184,
        151,
        212,
        133,
        67,
        15,
        155,
        247
      ],
      "accounts": [
        {
          "name": "tokenX"
        },
        {
          "name": "receipt",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tokenX"
              },
              {
                "kind": "arg",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "remove",
      "discriminator": [
        199,
        186,
        9,
        79,
        96,
        129,
        24,
        106
      ],
      "accounts": [
        {
          "name": "tokenX"
        },
        {
          "name": "syntheticX",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  121,
                  110,
                  116,
                  104,
                  101,
                  116,
                  105,
                  99
                ]
              },
              {
                "kind": "account",
                "path": "tokenX"
              }
            ]
          }
        },
        {
          "name": "vaultX",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tokenX"
              }
            ]
          }
        },
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "senderTokenX",
          "writable": true
        },
        {
          "name": "senderTokenSynthX",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "receipt",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tokenX"
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "receipt",
      "discriminator": [
        39,
        154,
        73,
        106,
        80,
        102,
        145,
        153
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "accountAlreadyStakedError",
      "msg": "Account has already staked."
    },
    {
      "code": 6001,
      "name": "invalidAccountData",
      "msg": "Account has not deposited."
    }
  ],
  "types": [
    {
      "name": "receipt",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isValid",
            "type": "u8"
          },
          {
            "name": "createdTs",
            "type": "u64"
          },
          {
            "name": "amountDeposited",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
