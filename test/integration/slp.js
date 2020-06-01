/*
  Integration tests for the bchjs covering SLP tokens.
*/

const chai = require("chai")
const assert = chai.assert

const BCHJS = require("../../src/bch-js")
const bchjs = new BCHJS()

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

describe(`#SLP`, () => {
  // before(() => {
  //   console.log(`bchjs.SLP.restURL: ${bchjs.SLP.restURL}`)
  //   console.log(`bchjs.SLP.apiToken: ${bchjs.SLP.apiToken}`)
  // })

  beforeEach(async () => {
    // Introduce a delay so that the BVT doesn't trip the rate limits.
    await sleep(1000)
  })

  describe("#util", () => {
    describe("#list", () => {
      it(`should get information on the Spice token`, async () => {
        const tokenId = `4de69e374a8ed21cbddd47f2338cc0f479dc58daa2bbe11cd604ca488eca0ddf`

        const result = await bchjs.SLP.Utils.list(tokenId)
        //console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.hasAnyKeys(result, [
          "decimals",
          "timestamp",
          "timestamp_unix",
          "versionType",
          "documentUri",
          "symbol",
          "name",
          "containsBaton",
          "id",
          "documentHash",
          "initialTokenQty",
          "blockCreated",
          "blockLastActiveSend",
          "blockLastActiveMint",
          "txnsSinceGenesis",
          "validAddress",
          "totalMinted",
          "totalBurned",
          "circulatingSupply",
          "mintingBatonStatus"
        ])
      })
    })

    // describe("#decodeOpReturn", () => {
    //   it("should decode the OP_RETURN for a SEND txid", async () => {
    //     const txid =
    //       "266844d53e46bbd7dd37134688dffea6e54d944edff27a0add63dd0908839bc1"
    //
    //     const result = await bchjs.SLP.Utils.decodeOpReturn(txid)
    //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
    //
    //     assert.hasAllKeys(result, [
    //       "tokenType",
    //       "transactionType",
    //       "tokenId",
    //       "spendData"
    //     ])
    //   })
    //
    //   it("should decode the OP_RETURN for a GENESIS txid", async () => {
    //     const txid =
    //       "497291b8a1dfe69c8daea50677a3d31a5ef0e9484d8bebb610dac64bbc202fb7"
    //
    //     const result = await bchjs.SLP.Utils.decodeOpReturn(txid)
    //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
    //
    //     assert.hasAllKeys(result, [
    //       "tokenType",
    //       "transactionType",
    //       "ticker",
    //       "name",
    //       "documentUrl",
    //       "documentHash",
    //       "decimals",
    //       "mintBatonVout",
    //       "initialQty",
    //       "tokensSentTo",
    //       "batonHolder"
    //     ])
    //   })
    //
    //   it("should decode the OP_RETURN for a MINT txid", async () => {
    //     const txid =
    //       "65f21bbfcd545e5eb515e38e861a9dfe2378aaa2c4e458eb9e59e4d40e38f3a4"
    //
    //     const result = await bchjs.SLP.Utils.decodeOpReturn(txid)
    //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
    //
    //     assert.hasAllKeys(result, [
    //       "tokenType",
    //       "transactionType",
    //       "tokenId",
    //       "mintBatonVout",
    //       "batonStillExists",
    //       "quantity",
    //       "tokensSentTo",
    //       "batonHolder"
    //     ])
    //   })
    //
    //   it("should throw an error for a non-SLP transaction", async () => {
    //     try {
    //       const txid =
    //         "3793d4906654f648e659f384c0f40b19c8f10c1e9fb72232a9b8edd61abaa1ec"
    //
    //       await bchjs.SLP.Utils.decodeOpReturn(txid)
    //
    //       assert.equal(true, false, "Unexpected result")
    //     } catch (err) {
    //       // console.log(`err: `, err)
    //       assert.include(err.message, "Not an OP_RETURN")
    //     }
    //   })
    // })

    describe("#decodeOpReturn", () => {
      it("should decode the OP_RETURN for a SEND txid", async () => {
        const txid =
          "266844d53e46bbd7dd37134688dffea6e54d944edff27a0add63dd0908839bc1"

        const result = await bchjs.SLP.Utils.decodeOpReturn(txid)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.hasAllKeys(result, ["tokenType", "txType", "tokenId", "amounts"])
        assert.equal(
          result.tokenId,
          "497291b8a1dfe69c8daea50677a3d31a5ef0e9484d8bebb610dac64bbc202fb7"
        )

        // Verify outputs
        assert.equal(result.amounts.length, 2)
        assert.equal(result.amounts[0], "100000000")
        assert.equal(result.amounts[1], "99883300000000")
      })

      it("should decode the OP_RETURN for a GENESIS txid", async () => {
        const txid =
          "497291b8a1dfe69c8daea50677a3d31a5ef0e9484d8bebb610dac64bbc202fb7"

        const result = await bchjs.SLP.Utils.decodeOpReturn(txid)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.hasAllKeys(result, [
          "tokenType",
          "txType",
          "tokenId",
          "ticker",
          "name",
          "documentUri",
          "documentHash",
          "decimals",
          "mintBatonVout",
          "qty"
        ])
        assert.equal(
          result.tokenId,
          "497291b8a1dfe69c8daea50677a3d31a5ef0e9484d8bebb610dac64bbc202fb7"
        )
        assert.equal(result.txType, "GENESIS")
        assert.equal(result.ticker, "TOK-CH")
        assert.equal(result.name, "TokyoCash")
      })

      it("should decode the OP_RETURN for a MINT txid", async () => {
        const txid =
          "65f21bbfcd545e5eb515e38e861a9dfe2378aaa2c4e458eb9e59e4d40e38f3a4"

        const result = await bchjs.SLP.Utils.decodeOpReturn(txid)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.hasAllKeys(result, [
          "tokenType",
          "txType",
          "tokenId",
          "mintBatonVout",
          "qty"
        ])
      })

      it("should throw an error for a non-SLP transaction", async () => {
        try {
          const txid =
            "3793d4906654f648e659f384c0f40b19c8f10c1e9fb72232a9b8edd61abaa1ec"

          await bchjs.SLP.Utils.decodeOpReturn(txid)

          assert.equal(true, false, "Unexpected result")
        } catch (err) {
          // console.log(`err: `, err)
          assert.include(err.message, "scriptpubkey not op_return")
        }
      })

      // Note: This TX is interpreted as valid by the original decodeOpReturn().
      // Fixing this issue and related issues was the reason for creating the
      // decodeOpReturn2() method using the slp-parser library.
      it("should throw error for invalid SLP transaction", async () => {
        try {
          const txid =
            "a60a522cc11ad7011b74e57fbabbd99296e4b9346bcb175dcf84efb737030415"

          await bchjs.SLP.Utils.decodeOpReturn(txid)
          // console.log(`result: ${JSON.stringify(result, null, 2)}`)
        } catch (err) {
          // console.log(`err: `, err)
          assert.include(err.message, "amount string size not 8 bytes")
        }
      })
    })

    describe("#isTokenUtxo", () => {
      it("should accurately analyze UTXOs from Blockbook", async () => {
        const addr = "bitcoincash:qqkpnx2rff4q5jranf3wk9jsprhae9unxckq07gph4"

        const utxos = await bchjs.Blockbook.utxo(addr)
        // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

        const isTokenUtxos = await bchjs.SLP.Utils.isTokenUtxo(utxos)
        // console.log(`isTokenUtxos: ${JSON.stringify(isTokenUtxos, null, 2)}`)

        // Filter out the result that is associated with the known non-slp tx.
        const nonSlp = isTokenUtxos.filter(
          x =>
            x.txid ===
            "2069e99a90499693e42cd1db82147e3e0acfe5e7315c6cc2f0252432f45300d7"
        )

        const isSlp = isTokenUtxos.filter(
          x =>
            x.txid ===
            "99093e8a19e0a649bf943dbc33d926feb09c02e61258c1bdaf2caffa7183c730"
        )

        assert.isArray(isTokenUtxos)
        assert.equal(nonSlp[0].isSlp, false)
        assert.equal(isSlp[0].isSlp, true)
      })

      it("should accurately analyze UTXOs from Electrumx", async () => {
        try {
          const addr = "bitcoincash:qqkpnx2rff4q5jranf3wk9jsprhae9unxckq07gph4"

          const utxos = await bchjs.Electrumx.utxo(addr)
          // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

          const isTokenUtxos = await bchjs.SLP.Utils.isTokenUtxo(utxos.utxos)
          // console.log(`isTokenUtxos: ${JSON.stringify(isTokenUtxos, null, 2)}`)

          // Filter out the result that is associated with the known non-slp tx.
          const nonSlp = isTokenUtxos.filter(
            x =>
              x.tx_hash ===
              "2069e99a90499693e42cd1db82147e3e0acfe5e7315c6cc2f0252432f45300d7"
          )

          const isSlp = isTokenUtxos.filter(
            x =>
              x.tx_hash ===
              "99093e8a19e0a649bf943dbc33d926feb09c02e61258c1bdaf2caffa7183c730"
          )

          assert.isArray(isTokenUtxos)
          assert.equal(nonSlp[0].isSlp, false)
          assert.equal(isSlp[0].isSlp, true)
        } catch (err) {
          console.log(`Error: `, err)
        }
      })

      // This captures an important corner-case. When an SLP token is created, the
      // change UTXO will contain the same SLP txid, but it is not an SLP UTXO.
      it("should return false for change in an SLP token creation transaction", async () => {
        const utxos = [
          {
            txid:
              "bd158c564dd4ef54305b14f44f8e94c44b649f246dab14bcb42fb0d0078b8a90",
            vout: 3,
            amount: 0.00002015,
            satoshis: 2015,
            height: 594892,
            confirmations: 5
          },
          {
            txid:
              "bd158c564dd4ef54305b14f44f8e94c44b649f246dab14bcb42fb0d0078b8a90",
            vout: 2,
            amount: 0.00000546,
            satoshis: 546,
            height: 594892,
            confirmations: 5
          }
        ]

        const data = await bchjs.SLP.Utils.isTokenUtxo(utxos)
        // console.log(`data: ${JSON.stringify(data, null, 2)}`)

        assert.equal(
          data[0].isSlp,
          false,
          "Change should not be identified as SLP utxo."
        )
        assert.equal(data[1].isSlp, true, "SLP UTXO correctly identified.")
      })
    })

    // describe("#tokenUtxoDetails", () => {
    //   it("should return token details on a valid UTXO", async () => {
    //     const utxos = [
    //       {
    //         txid:
    //           "266844d53e46bbd7dd37134688dffea6e54d944edff27a0add63dd0908839bc1",
    //         vout: 1,
    //         value: "546",
    //         height: 597740,
    //         confirmations: 1,
    //         satoshis: 546
    //       }
    //     ]
    //
    //     const result = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
    //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
    //
    //     assert.hasAllKeys(result[0], [
    //       "txid",
    //       "vout",
    //       "value",
    //       "height",
    //       "confirmations",
    //       "satoshis",
    //       "utxoType",
    //       "transactionType",
    //       "tokenId",
    //       "tokenTicker",
    //       "tokenName",
    //       "tokenDocumentUrl",
    //       "tokenDocumentHash",
    //       "decimals",
    //       "tokenQty",
    //       "isValid"
    //     ])
    //   })
    //
    //   it("should not choke on this problematic utxo", async () => {
    //     const utxos = [
    //       {
    //         txid:
    //           "a8eb788b8ddda6faea00e6e2756624b8feb97655363d0400dd66839ea619d36e",
    //         vout: 1,
    //         value: "546",
    //         height: 603282,
    //         confirmations: 156,
    //         satoshis: 546
    //       }
    //     ]
    //
    //     const result = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
    //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
    //
    //     assert.hasAllKeys(result[0], [
    //       "txid",
    //       "vout",
    //       "value",
    //       "height",
    //       "confirmations",
    //       "satoshis",
    //       "utxoType",
    //       "transactionType",
    //       "tokenId",
    //       "tokenTicker",
    //       "tokenName",
    //       "tokenDocumentUrl",
    //       "tokenDocumentHash",
    //       "decimals",
    //       "tokenQty",
    //       "isValid"
    //     ])
    //   })
    //
    //   it("should handle BCH and SLP utxos in the same TX", async () => {
    //     const utxos = [
    //       {
    //         txid:
    //           "d56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56",
    //         vout: 3,
    //         value: "6816",
    //         height: 606848,
    //         confirmations: 13,
    //         satoshis: 6816
    //       },
    //       {
    //         txid:
    //           "d56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56",
    //         vout: 2,
    //         value: "546",
    //         height: 606848,
    //         confirmations: 13,
    //         satoshis: 546
    //       }
    //     ]
    //
    //     const result = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
    //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
    //
    //     assert.isArray(result)
    //     assert.equal(result.length, 2)
    //     assert.equal(result[0], false)
    //   })
    //
    //   // This captures an important corner-case. When an SLP token is created, the
    //   // change UTXO will contain the same SLP txid, but it is not an SLP UTXO.
    //   it("should return details on minting baton from genesis transaction", async () => {
    //     const utxos = [
    //       {
    //         txid:
    //           "bd158c564dd4ef54305b14f44f8e94c44b649f246dab14bcb42fb0d0078b8a90",
    //         vout: 3,
    //         amount: 0.00002015,
    //         satoshis: 2015,
    //         height: 594892,
    //         confirmations: 5
    //       },
    //       {
    //         txid:
    //           "bd158c564dd4ef54305b14f44f8e94c44b649f246dab14bcb42fb0d0078b8a90",
    //         vout: 2,
    //         amount: 0.00000546,
    //         satoshis: 546,
    //         height: 594892,
    //         confirmations: 5
    //       }
    //     ]
    //
    //     const data = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
    //     // console.log(`data: ${JSON.stringify(data, null, 2)}`)
    //
    //     assert.equal(data[0], false, "Change UTXO marked as false.")
    //
    //     assert.property(data[1], "txid")
    //     assert.property(data[1], "vout")
    //     assert.property(data[1], "amount")
    //     assert.property(data[1], "satoshis")
    //     assert.property(data[1], "height")
    //     assert.property(data[1], "confirmations")
    //     assert.property(data[1], "tokenType")
    //     assert.property(data[1], "tokenId")
    //     assert.property(data[1], "tokenTicker")
    //     assert.property(data[1], "tokenName")
    //     assert.property(data[1], "tokenDocumentUrl")
    //     assert.property(data[1], "tokenDocumentHash")
    //     assert.property(data[1], "decimals")
    //     assert.property(data[1], "isValid")
    //     assert.equal(data[1].isValid, true)
    //   })
    //
    //   it("should return details for a MINT token utxo", async () => {
    //     const utxos = [
    //       {
    //         txid:
    //           "cf4b922d1e1aa56b52d752d4206e1448ea76c3ebe69b3b97d8f8f65413bd5c76",
    //         vout: 1,
    //         amount: 0.00000546,
    //         satoshis: 546,
    //         height: 600297,
    //         confirmations: 76
    //       }
    //     ]
    //
    //     const data = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
    //     // console.log(`data: ${JSON.stringify(data, null, 2)}`)
    //
    //     assert.property(data[0], "txid")
    //     assert.property(data[0], "vout")
    //     assert.property(data[0], "amount")
    //     assert.property(data[0], "satoshis")
    //     assert.property(data[0], "height")
    //     assert.property(data[0], "confirmations")
    //     assert.property(data[0], "utxoType")
    //     assert.property(data[0], "transactionType")
    //     assert.property(data[0], "tokenId")
    //     assert.property(data[0], "tokenTicker")
    //     assert.property(data[0], "tokenName")
    //     assert.property(data[0], "tokenDocumentUrl")
    //     assert.property(data[0], "tokenDocumentHash")
    //     assert.property(data[0], "decimals")
    //     assert.property(data[0], "mintBatonVout")
    //     assert.property(data[0], "batonStillExists")
    //     assert.property(data[0], "tokenQty")
    //     assert.property(data[0], "isValid")
    //     assert.equal(data[0].isValid, true)
    //   })
    //
    //   it("should return details for a simple SEND SLP token utxo", async () => {
    //     const utxos = [
    //       {
    //         txid:
    //           "fde117b1f176b231e2fa9a6cb022e0f7c31c288221df6bcb05f8b7d040ca87cb",
    //         vout: 1,
    //         amount: 0.00000546,
    //         satoshis: 546,
    //         height: 596089,
    //         confirmations: 748
    //       }
    //     ]
    //
    //     const data = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
    //     // console.log(`data: ${JSON.stringify(data, null, 2)}`)
    //
    //     assert.property(data[0], "txid")
    //     assert.property(data[0], "vout")
    //     assert.property(data[0], "amount")
    //     assert.property(data[0], "satoshis")
    //     assert.property(data[0], "height")
    //     assert.property(data[0], "confirmations")
    //     assert.property(data[0], "utxoType")
    //     assert.property(data[0], "tokenId")
    //     assert.property(data[0], "tokenTicker")
    //     assert.property(data[0], "tokenName")
    //     assert.property(data[0], "tokenDocumentUrl")
    //     assert.property(data[0], "tokenDocumentHash")
    //     assert.property(data[0], "decimals")
    //     assert.property(data[0], "tokenQty")
    //     assert.property(data[0], "isValid")
    //     assert.equal(data[0].isValid, true)
    //   })
    //
    //   it("should handle BCH and SLP utxos in the same TX", async () => {
    //     const utxos = [
    //       {
    //         txid:
    //           "d56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56",
    //         vout: 3,
    //         value: "6816",
    //         height: 606848,
    //         confirmations: 13,
    //         satoshis: 6816
    //       },
    //       {
    //         txid:
    //           "d56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56",
    //         vout: 2,
    //         value: "546",
    //         height: 606848,
    //         confirmations: 13,
    //         satoshis: 546
    //       }
    //     ]
    //
    //     const result = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
    //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
    //
    //     assert.isArray(result)
    //     assert.equal(result.length, 2)
    //     assert.equal(result[0], false)
    //     assert.equal(result[1].isValid, true)
    //   })
    //
    //   it("should handle problematic utxos", async () => {
    //     const utxos = [
    //       {
    //         txid:
    //           "0e3a217fc22612002031d317b4cecd9b692b66b52951a67b23c43041aefa3959",
    //         vout: 0,
    //         amount: 0.00018362,
    //         satoshis: 18362,
    //         height: 613483,
    //         confirmations: 124
    //       },
    //       {
    //         txid:
    //           "67fd3c7c3a6eb0fea9ab311b91039545086220f7eeeefa367fa28e6e43009f19",
    //         vout: 1,
    //         amount: 0.00000546,
    //         satoshis: 546,
    //         height: 612075,
    //         confirmations: 1532
    //       }
    //     ]
    //
    //     const result = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
    //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
    //
    //     assert.isArray(result)
    //     assert.equal(result.length, 2)
    //     assert.equal(result[0], false)
    //     assert.equal(result[1].isValid, true)
    //   })
    //
    //   it("should return false for BCH-only UTXOs", async () => {
    //     const utxos = [
    //       {
    //         txid:
    //           "a937f792c7c9eb23b4f344ce5c233d1ac0909217d0a504d71e6b1e4efb864a3b",
    //         vout: 0,
    //         amount: 0.00001,
    //         satoshis: 1000,
    //         confirmations: 0,
    //         ts: 1578424704
    //       },
    //       {
    //         txid:
    //           "53fd141c2e999e080a5860887441a2c45e9cbe262027e2bd2ac998fc76e43c44",
    //         vout: 0,
    //         amount: 0.00001,
    //         satoshis: 1000,
    //         confirmations: 0,
    //         ts: 1578424634
    //       }
    //     ]
    //
    //     const data = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
    //     // console.log(`data: ${JSON.stringify(data, null, 2)}`)
    //
    //     assert.isArray(data)
    //     assert.equal(false, data[0])
    //     assert.equal(false, data[1])
    //   })
    // })

    describe("#tokenUtxoDetails", () => {
      // // This captures an important corner-case. When an SLP token is created, the
      // // change UTXO will contain the same SLP txid, but it is not an SLP UTXO.
      it("should return details on minting baton from genesis transaction", async () => {
        const utxos = [
          {
            txid:
              "bd158c564dd4ef54305b14f44f8e94c44b649f246dab14bcb42fb0d0078b8a90",
            vout: 3,
            amount: 0.00002015,
            satoshis: 2015,
            height: 594892,
            confirmations: 5
          },
          {
            txid:
              "bd158c564dd4ef54305b14f44f8e94c44b649f246dab14bcb42fb0d0078b8a90",
            vout: 2,
            amount: 0.00000546,
            satoshis: 546,
            height: 594892,
            confirmations: 5
          }
        ]

        const data = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
        // console.log(`data: ${JSON.stringify(data, null, 2)}`)

        assert.equal(data[0], false, "Change UTXO marked as false.")

        assert.property(data[1], "txid")
        assert.property(data[1], "vout")
        assert.property(data[1], "amount")
        assert.property(data[1], "satoshis")
        assert.property(data[1], "height")
        assert.property(data[1], "confirmations")
        assert.property(data[1], "utxoType")
        assert.property(data[1], "tokenId")
        assert.property(data[1], "tokenTicker")
        assert.property(data[1], "tokenName")
        assert.property(data[1], "tokenDocumentUrl")
        assert.property(data[1], "tokenDocumentHash")
        assert.property(data[1], "decimals")
        assert.property(data[1], "isValid")
        assert.equal(data[1].isValid, true)
      })

      it("should return details for a MINT token utxo", async () => {
        // Mock the call to REST API

        const utxos = [
          {
            txid:
              "cf4b922d1e1aa56b52d752d4206e1448ea76c3ebe69b3b97d8f8f65413bd5c76",
            vout: 1,
            amount: 0.00000546,
            satoshis: 546,
            height: 600297,
            confirmations: 76
          }
        ]

        const data = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
        // console.log(`data: ${JSON.stringify(data, null, 2)}`)

        assert.property(data[0], "txid")
        assert.property(data[0], "vout")
        assert.property(data[0], "amount")
        assert.property(data[0], "satoshis")
        assert.property(data[0], "height")
        assert.property(data[0], "confirmations")
        assert.property(data[0], "utxoType")
        assert.property(data[0], "transactionType")
        assert.property(data[0], "tokenId")
        assert.property(data[0], "tokenTicker")
        assert.property(data[0], "tokenName")
        assert.property(data[0], "tokenDocumentUrl")
        assert.property(data[0], "tokenDocumentHash")
        assert.property(data[0], "decimals")
        assert.property(data[0], "mintBatonVout")
        assert.property(data[0], "tokenQty")
        assert.property(data[0], "isValid")
        assert.equal(data[0].isValid, true)
      })

      it("should return details for a simple SEND SLP token utxo", async () => {
        const utxos = [
          {
            txid:
              "fde117b1f176b231e2fa9a6cb022e0f7c31c288221df6bcb05f8b7d040ca87cb",
            vout: 1,
            amount: 0.00000546,
            satoshis: 546,
            height: 596089,
            confirmations: 748
          }
        ]

        const data = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
        // console.log(`data: ${JSON.stringify(data, null, 2)}`)

        assert.property(data[0], "txid")
        assert.property(data[0], "vout")
        assert.property(data[0], "amount")
        assert.property(data[0], "satoshis")
        assert.property(data[0], "height")
        assert.property(data[0], "confirmations")
        assert.property(data[0], "utxoType")
        assert.property(data[0], "tokenId")
        assert.property(data[0], "tokenTicker")
        assert.property(data[0], "tokenName")
        assert.property(data[0], "tokenDocumentUrl")
        assert.property(data[0], "tokenDocumentHash")
        assert.property(data[0], "decimals")
        assert.property(data[0], "tokenQty")
        assert.property(data[0], "isValid")
        assert.equal(data[0].isValid, true)
      })

      it("should handle BCH and SLP utxos in the same TX", async () => {
        const utxos = [
          {
            txid:
              "d56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56",
            vout: 3,
            value: "6816",
            height: 606848,
            confirmations: 13,
            satoshis: 6816
          },
          {
            txid:
              "d56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56",
            vout: 2,
            value: "546",
            height: 606848,
            confirmations: 13,
            satoshis: 546
          }
        ]

        const result = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.isArray(result)
        assert.equal(result.length, 2)
        assert.equal(result[0], false)
        assert.equal(result[1].isValid, true)
      })

      it("should handle problematic utxos", async () => {
        const utxos = [
          {
            txid:
              "0e3a217fc22612002031d317b4cecd9b692b66b52951a67b23c43041aefa3959",
            vout: 0,
            amount: 0.00018362,
            satoshis: 18362,
            height: 613483,
            confirmations: 124
          },
          {
            txid:
              "67fd3c7c3a6eb0fea9ab311b91039545086220f7eeeefa367fa28e6e43009f19",
            vout: 1,
            amount: 0.00000546,
            satoshis: 546,
            height: 612075,
            confirmations: 1532
          }
        ]

        const result = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.isArray(result)
        assert.equal(result.length, 2)
        assert.equal(result[0], false)
        assert.equal(result[1].isValid, true)
      })

      it("should return false for BCH-only UTXOs", async () => {
        const utxos = [
          {
            txid:
              "a937f792c7c9eb23b4f344ce5c233d1ac0909217d0a504d71e6b1e4efb864a3b",
            vout: 0,
            amount: 0.00001,
            satoshis: 1000,
            confirmations: 0,
            ts: 1578424704
          },
          {
            txid:
              "53fd141c2e999e080a5860887441a2c45e9cbe262027e2bd2ac998fc76e43c44",
            vout: 0,
            amount: 0.00001,
            satoshis: 1000,
            confirmations: 0,
            ts: 1578424634
          }
        ]

        const data = await bchjs.SLP.Utils.tokenUtxoDetails(utxos)
        // console.log(`data: ${JSON.stringify(data, null, 2)}`)

        assert.isArray(data)
        assert.equal(false, data[0])
        assert.equal(false, data[1])
      })
    })

    describe("#balancesForAddress", () => {
      it(`should throw an error if input is not a string or array of strings`, async () => {
        try {
          const address = 1234

          await bchjs.SLP.Utils.balancesForAddress(address)

          assert.equal(true, false, "Uh oh. Code path should not end here.")
        } catch (err) {
          //console.log(`Error: `, err)
          assert.include(
            err.message,
            `Input address must be a string or array of strings`
          )
        }
      })

      it(`should fetch all balances for address: simpleledger:qzv3zz2trz0xgp6a96lu4m6vp2nkwag0kvyucjzqt9`, async () => {
        const balances = await bchjs.SLP.Utils.balancesForAddress(
          "simpleledger:qzv3zz2trz0xgp6a96lu4m6vp2nkwag0kvyucjzqt9"
        )
        // console.log(`balances: ${JSON.stringify(balances, null, 2)}`)

        assert.isArray(balances)
        assert.hasAllKeys(balances[0], [
          "tokenId",
          "balanceString",
          "balance",
          "decimalCount",
          "slpAddress"
        ])
      })

      it(`should fetch balances for multiple addresses`, async () => {
        const addresses = [
          "simpleledger:qzv3zz2trz0xgp6a96lu4m6vp2nkwag0kvyucjzqt9",
          "simpleledger:qqss4zp80hn6szsa4jg2s9fupe7g5tcg5ucdyl3r57"
        ]

        const balances = await bchjs.SLP.Utils.balancesForAddress(addresses)
        // console.log(`balances: ${JSON.stringify(balances, null, 2)}`)

        assert.isArray(balances)
        assert.isArray(balances[0])
        assert.hasAllKeys(balances[0][0], [
          "tokenId",
          "balanceString",
          "balance",
          "decimalCount",
          "slpAddress"
        ])
      })
    })
  })
})

// Promise-based sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
