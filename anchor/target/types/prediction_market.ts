export type PredictionMarket = {
  "version": "0.1.0",
  "name": "prediction_market",
  "instructions": [
    {
      "name": "initialize",
      "docs": [
        "Initialize the prediction market",
        "This function sets up the main prediction market account"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "usdtMint",
          "type": "publicKey"
        },
        {
          "name": "oracle",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createPool",
      "docs": [
        "Create a new prediction pool",
        "This function creates a new pool with YES and NO token mints"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "yesTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "noTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
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
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "vote",
      "docs": [
        "Vote in a prediction pool",
        "Users can vote YES or NO by transferring USDT and receiving corresponding tokens"
      ],
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userUsdtAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolUsdtAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "yesTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "noTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userYesTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userNoTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
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
    },
    {
      "name": "declareResult",
      "docs": [
        "Declare the result of a prediction pool",
        "Only the oracle can call this function to set the winner"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "yesTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noTokenMint",
          "isMut": false,
          "isSigner": false
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
      "name": "setOracle",
      "docs": [
        "Set a new oracle for the prediction market",
        "Only the owner can change the oracle"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newOracle",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "claim",
      "docs": [
        "Claim rewards from an ended prediction pool",
        "Users can claim their rewards based on their winning votes"
      ],
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userUsdtAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolUsdtAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "yesTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "noTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userYesTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userNoTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "pausePool",
      "docs": [
        "Pause an active prediction pool",
        "Only the owner can pause a pool"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
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
            "name": "yesAmount",
            "type": "u64"
          },
          {
            "name": "noAmount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": "PoolStatus"
            }
          },
          {
            "name": "winner",
            "type": "u8"
          },
          {
            "name": "yesTokenMint",
            "type": "publicKey"
          },
          {
            "name": "noTokenMint",
            "type": "publicKey"
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
      "name": "predictionMarket",
      "docs": [
        "The main prediction market account structure"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "usdtMint",
            "type": "publicKey"
          },
          {
            "name": "oracle",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PoolStatus",
      "docs": [
        "The possible statuses of a prediction pool"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Paused"
          },
          {
            "name": "Ended"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotOwner",
      "msg": "Not the owner"
    },
    {
      "code": 6001,
      "name": "PoolEnded",
      "msg": "Pool has ended"
    },
    {
      "code": 6002,
      "name": "PoolNotStarted",
      "msg": "Pool has not started"
    },
    {
      "code": 6003,
      "name": "PoolNotActive",
      "msg": "Pool is not active"
    },
    {
      "code": 6004,
      "name": "NotOracle",
      "msg": "Not the oracle"
    },
    {
      "code": 6005,
      "name": "PoolNotEnded",
      "msg": "Pool has not ended yet"
    },
    {
      "code": 6006,
      "name": "ResultNotDeclared",
      "msg": "Result has not been declared"
    }
  ]
};

export const IDL: PredictionMarket = {
  "version": "0.1.0",
  "name": "prediction_market",
  "instructions": [
    {
      "name": "initialize",
      "docs": [
        "Initialize the prediction market",
        "This function sets up the main prediction market account"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "usdtMint",
          "type": "publicKey"
        },
        {
          "name": "oracle",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createPool",
      "docs": [
        "Create a new prediction pool",
        "This function creates a new pool with YES and NO token mints"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "yesTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "noTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
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
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "vote",
      "docs": [
        "Vote in a prediction pool",
        "Users can vote YES or NO by transferring USDT and receiving corresponding tokens"
      ],
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userUsdtAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolUsdtAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "yesTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "noTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userYesTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userNoTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
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
    },
    {
      "name": "declareResult",
      "docs": [
        "Declare the result of a prediction pool",
        "Only the oracle can call this function to set the winner"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "yesTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noTokenMint",
          "isMut": false,
          "isSigner": false
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
      "name": "setOracle",
      "docs": [
        "Set a new oracle for the prediction market",
        "Only the owner can change the oracle"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newOracle",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "claim",
      "docs": [
        "Claim rewards from an ended prediction pool",
        "Users can claim their rewards based on their winning votes"
      ],
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userUsdtAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolUsdtAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "yesTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "noTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userYesTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userNoTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "pausePool",
      "docs": [
        "Pause an active prediction pool",
        "Only the owner can pause a pool"
      ],
      "accounts": [
        {
          "name": "predictionMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
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
            "name": "yesAmount",
            "type": "u64"
          },
          {
            "name": "noAmount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": "PoolStatus"
            }
          },
          {
            "name": "winner",
            "type": "u8"
          },
          {
            "name": "yesTokenMint",
            "type": "publicKey"
          },
          {
            "name": "noTokenMint",
            "type": "publicKey"
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
      "name": "predictionMarket",
      "docs": [
        "The main prediction market account structure"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "usdtMint",
            "type": "publicKey"
          },
          {
            "name": "oracle",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PoolStatus",
      "docs": [
        "The possible statuses of a prediction pool"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Paused"
          },
          {
            "name": "Ended"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotOwner",
      "msg": "Not the owner"
    },
    {
      "code": 6001,
      "name": "PoolEnded",
      "msg": "Pool has ended"
    },
    {
      "code": 6002,
      "name": "PoolNotStarted",
      "msg": "Pool has not started"
    },
    {
      "code": 6003,
      "name": "PoolNotActive",
      "msg": "Pool is not active"
    },
    {
      "code": 6004,
      "name": "NotOracle",
      "msg": "Not the oracle"
    },
    {
      "code": 6005,
      "name": "PoolNotEnded",
      "msg": "Pool has not ended yet"
    },
    {
      "code": 6006,
      "name": "ResultNotDeclared",
      "msg": "Result has not been declared"
    }
  ]
};
