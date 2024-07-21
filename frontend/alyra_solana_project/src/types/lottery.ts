/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lottery.json`.
 */
export type Lottery = {
  "address": "13r5dniDEeMszUj4kMyQHcpQEKQmvDWYwjevdkB4Ta9",
  "metadata": {
    "name": "lottery",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyTicket",
      "discriminator": [
        11,
        24,
        17,
        193,
        168,
        116,
        164,
        169
      ],
      "accounts": [
        {
          "name": "lottery",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "lotteryId"
              }
            ]
          }
        },
        {
          "name": "ticket",
          "writable": true
        },
        {
          "name": "buyer",
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
          "name": "lotteryId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "buyTicketWithToken",
      "discriminator": [
        155,
        182,
        225,
        160,
        8,
        46,
        226,
        131
      ],
      "accounts": [
        {
          "name": "lottery",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "lotteryId"
              }
            ]
          }
        },
        {
          "name": "ticket",
          "writable": true
        },
        {
          "name": "lotteryTokenAccount",
          "writable": true
        },
        {
          "name": "buyerTokenAccount",
          "writable": true
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "lotteryId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "claimPrize",
      "discriminator": [
        157,
        233,
        139,
        121,
        246,
        62,
        234,
        235
      ],
      "accounts": [
        {
          "name": "lottery",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "lotteryId"
              }
            ]
          }
        },
        {
          "name": "ticket",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  105,
                  99,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "lottery"
              },
              {
                "kind": "arg",
                "path": "ticketId"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "ticket"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "lotteryId",
          "type": "u32"
        },
        {
          "name": "ticketId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "claimPrizeToken",
      "discriminator": [
        205,
        10,
        121,
        45,
        57,
        7,
        18,
        81
      ],
      "accounts": [
        {
          "name": "lottery",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "lotteryId"
              }
            ]
          }
        },
        {
          "name": "ticket",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  105,
                  99,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "lottery"
              },
              {
                "kind": "arg",
                "path": "ticketId"
              }
            ]
          }
        },
        {
          "name": "senderTokenSynthX",
          "writable": true
        },
        {
          "name": "receiverTokenSynthX",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "ticket"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "lotteryId",
          "type": "u32"
        },
        {
          "name": "ticketId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "createLottery",
      "discriminator": [
        242,
        165,
        247,
        119,
        17,
        203,
        21,
        42
      ],
      "accounts": [
        {
          "name": "lottery",
          "writable": true
        },
        {
          "name": "master",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  115,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
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
          "name": "ticketPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositToStaking",
      "discriminator": [
        218,
        232,
        61,
        107,
        58,
        0,
        82,
        210
      ],
      "accounts": [
        {
          "name": "lottery",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "lotteryId"
              }
            ]
          }
        },
        {
          "name": "tokenX",
          "writable": true
        },
        {
          "name": "synthXMint",
          "writable": true
        },
        {
          "name": "vaultX",
          "writable": true
        },
        {
          "name": "senderTokenSynthX",
          "writable": true
        },
        {
          "name": "senderTokenX",
          "writable": true
        },
        {
          "name": "receipt",
          "writable": true
        },
        {
          "name": "stakingProgram",
          "address": "3K44q3YYWGyeXsW3sh5zM1QkfDNiPjuSKPJko5v28WPo"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "lotteryId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initMaster",
      "discriminator": [
        168,
        49,
        22,
        248,
        228,
        56,
        111,
        24
      ],
      "accounts": [
        {
          "name": "master",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  115,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "pickWinner",
      "discriminator": [
        227,
        62,
        25,
        73,
        132,
        106,
        68,
        96
      ],
      "accounts": [
        {
          "name": "lottery",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "lotteryId"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "lottery"
          ]
        }
      ],
      "args": [
        {
          "name": "lotteryId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "refundTicketToken",
      "discriminator": [
        178,
        187,
        224,
        1,
        130,
        30,
        199,
        254
      ],
      "accounts": [
        {
          "name": "lottery",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "lotteryId"
              }
            ]
          }
        },
        {
          "name": "ticket",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  105,
                  99,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "lottery"
              },
              {
                "kind": "arg",
                "path": "ticketId"
              }
            ]
          }
        },
        {
          "name": "senderTokenX",
          "writable": true
        },
        {
          "name": "receiverTokenX",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "ticket"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "lotteryId",
          "type": "u32"
        },
        {
          "name": "ticketId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "removeFromStaking",
      "discriminator": [
        254,
        63,
        212,
        44,
        222,
        250,
        243,
        222
      ],
      "accounts": [
        {
          "name": "lottery",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "lotteryId"
              }
            ]
          }
        },
        {
          "name": "tokenX",
          "writable": true
        },
        {
          "name": "synthXMint",
          "writable": true
        },
        {
          "name": "vaultX",
          "writable": true
        },
        {
          "name": "senderTokenSynthX",
          "writable": true
        },
        {
          "name": "senderTokenX",
          "writable": true
        },
        {
          "name": "receipt",
          "writable": true
        },
        {
          "name": "stakingProgram",
          "address": "3K44q3YYWGyeXsW3sh5zM1QkfDNiPjuSKPJko5v28WPo"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "lotteryId",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "lottery",
      "discriminator": [
        162,
        182,
        26,
        12,
        164,
        214,
        112,
        3
      ]
    },
    {
      "name": "master",
      "discriminator": [
        168,
        213,
        193,
        12,
        77,
        162,
        58,
        235
      ]
    },
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
    },
    {
      "name": "ticket",
      "discriminator": [
        41,
        228,
        24,
        165,
        78,
        90,
        235,
        200
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "winnerAlreadyExists",
      "msg": "Winner already exists."
    },
    {
      "code": 6001,
      "name": "noTickets",
      "msg": "Can't choose a winner when there are no tickets."
    },
    {
      "code": 6002,
      "name": "winnerNotChosen",
      "msg": "Winner has not been chosen."
    },
    {
      "code": 6003,
      "name": "invalidWinner",
      "msg": "Invalid winner."
    },
    {
      "code": 6004,
      "name": "alreadyClaimed",
      "msg": "The prize has already been claimed."
    },
    {
      "code": 6005,
      "name": "badToken",
      "msg": "Bad token"
    }
  ],
  "types": [
    {
      "name": "lottery",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "lastTicketId",
            "type": "u32"
          },
          {
            "name": "winnerId",
            "type": "u32"
          },
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "master",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastId",
            "type": "u32"
          }
        ]
      }
    },
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
    },
    {
      "name": "ticket",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "lotteryId",
            "type": "u32"
          },
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
