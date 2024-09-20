/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/prediction_market.json`.
 */
export type PredictionMarket = {
  "address": "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS",
  "metadata": {
    "name": "predictionMarket",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claim",
      "docs": [
        "Claim rewards from an ended prediction pool",
        "Users can claim their rewards based on their winning votes"
      ],
      "discriminator": [
        62,
        198,
        214,
        193,
        213,
        159,
        108,
        210
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "user",
          "signer": true
        },
        {
          "name": "userUsdtAccount",
          "writable": true
        },
        {
          "name": "poolUsdtAccount",
          "writable": true
        },
        {
          "name": "yesTokenMint",
          "writable": true
        },
        {
          "name": "noTokenMint",
          "writable": true
        },
        {
          "name": "userYesTokenAccount",
          "writable": true
        },
        {
          "name": "userNoTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "createPool",
      "docs": [
        "Create a new prediction pool",
        "This function creates a new pool with YES and NO token mints"
      ],
      "discriminator": [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "writable": true
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "poolId"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "yesTokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  121,
                  101,
                  115,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "noTokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  111,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "declareResult",
      "docs": [
        "Declare the result of a prediction pool",
        "Only the oracle can call this function to set the winner"
      ],
      "discriminator": [
        205,
        129,
        155,
        217,
        131,
        167,
        175,
        38
      ],
      "accounts": [
        {
          "name": "predictionMarket"
        },
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "oracle",
          "signer": true
        },
        {
          "name": "yesTokenMint"
        },
        {
          "name": "noTokenMint"
        }
      ],
      "args": [
        {
          "name": "winner",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initialize",
      "docs": [
        "Initialize the prediction market",
        "This function sets up the main prediction market account"
      ],
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
          "name": "predictionMarket",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
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
          "name": "usdtMint",
          "type": "pubkey"
        },
        {
          "name": "oracle",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "pausePool",
      "docs": [
        "Pause an active prediction pool",
        "Only the owner can pause a pool"
      ],
      "discriminator": [
        160,
        15,
        12,
        189,
        160,
        0,
        243,
        245
      ],
      "accounts": [
        {
          "name": "predictionMarket"
        },
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "owner",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "setOracle",
      "docs": [
        "Set a new oracle for the prediction market",
        "Only the owner can change the oracle"
      ],
      "discriminator": [
        186,
        128,
        81,
        104,
        74,
        79,
        18,
        224
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "writable": true
        },
        {
          "name": "owner",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newOracle",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "vote",
      "docs": [
        "Vote in a prediction pool",
        "Users can vote YES or NO by transferring USDT and receiving corresponding tokens"
      ],
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "user",
          "signer": true
        },
        {
          "name": "userUsdtAccount",
          "writable": true
        },
        {
          "name": "poolUsdtAccount",
          "writable": true
        },
        {
          "name": "yesTokenMint",
          "writable": true
        },
        {
          "name": "noTokenMint",
          "writable": true
        },
        {
          "name": "userYesTokenAccount",
          "writable": true
        },
        {
          "name": "userNoTokenAccount",
          "writable": true
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
          "name": "voteYes",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pool",
      "discriminator": [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    },
    {
      "name": "predictionMarket",
      "discriminator": [
        117,
        150,
        97,
        152,
        119,
        58,
        51,
        58
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "notOwner",
      "msg": "Not the owner"
    },
    {
      "code": 6001,
      "name": "poolEnded",
      "msg": "Pool has ended"
    },
    {
      "code": 6002,
      "name": "poolNotStarted",
      "msg": "Pool has not started"
    },
    {
      "code": 6003,
      "name": "poolNotActive",
      "msg": "Pool is not active"
    },
    {
      "code": 6004,
      "name": "notOracle",
      "msg": "Not the oracle"
    },
    {
      "code": 6005,
      "name": "poolNotEnded",
      "msg": "Pool has not ended yet"
    },
    {
      "code": 6006,
      "name": "resultNotDeclared",
      "msg": "Result has not been declared"
    }
  ],
  "types": [
    {
      "name": "pool",
      "docs": [
        "The structure for individual prediction pools"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
          },
          {
            "name": "poolAmount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "poolStatus"
              }
            }
          },
          {
            "name": "winner",
            "type": "u8"
          },
          {
            "name": "yesTokenMint",
            "type": "pubkey"
          },
          {
            "name": "noTokenMint",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "totalWinningTokens",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "poolStatus",
      "docs": [
        "The possible statuses of a prediction pool"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "paused"
          },
          {
            "name": "ended"
          }
        ]
      }
    },
    {
      "name": "predictionMarket",
      "docs": [
        "The main prediction market account structure"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "usdtMint",
            "type": "pubkey"
          },
          {
            "name": "oracle",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
