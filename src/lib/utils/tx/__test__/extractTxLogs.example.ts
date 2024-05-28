/* eslint-disable sonarjs/no-duplicate-string */
import type { Log } from "@cosmjs/stargate/build/logs";

import type { TypeUrl } from "lib/data";
import type { TxResponse } from "lib/services/types";
import { parseDate } from "lib/utils/date";

type TestCase = { txData: TxResponse; result: Log[] };

export const fromLogs: TestCase = {
  txData: {
    code: 0,
    codespace: "",
    data: "0A260A242F636F736D7761736D2E7761736D2E76312E4D73674D696772617465436F6E7472616374",
    events: [
      {
        attributes: [
          {
            key: "c3BlbmRlcg==",
            value:
              "b3NtbzE4cmYydmtldHVoZnZydzBuOTg2bWdobXMzM2FobTg4NHdzcmZzag==",
          },
          {
            key: "YW1vdW50",
            value: "NDg4MHVvc21v",
          },
        ],
        type: "coin_spent",
      },
      {
        attributes: [
          {
            key: "cmVjZWl2ZXI=",
            value:
              "b3NtbzE3eHBmdmFrbTJhbWc5NjJ5bHM2Zjg0ejNrZWxsOGM1bGN6c3NhMA==",
          },
          {
            key: "YW1vdW50",
            value: "NDg4MHVvc21v",
          },
        ],
        type: "coin_received",
      },
      {
        attributes: [
          {
            key: "cmVjaXBpZW50",
            value:
              "b3NtbzE3eHBmdmFrbTJhbWc5NjJ5bHM2Zjg0ejNrZWxsOGM1bGN6c3NhMA==",
          },
          {
            key: "c2VuZGVy",
            value:
              "b3NtbzE4cmYydmtldHVoZnZydzBuOTg2bWdobXMzM2FobTg4NHdzcmZzag==",
          },
          {
            key: "YW1vdW50",
            value: "NDg4MHVvc21v",
          },
        ],
        type: "transfer",
      },
      {
        attributes: [
          {
            key: "c2VuZGVy",
            value:
              "b3NtbzE4cmYydmtldHVoZnZydzBuOTg2bWdobXMzM2FobTg4NHdzcmZzag==",
          },
        ],
        type: "message",
      },
      {
        attributes: [
          {
            key: "ZmVl",
            value: "NDg4MHVvc21v",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "YWNjX3NlcQ==",
            value:
              "b3NtbzE4cmYydmtldHVoZnZydzBuOTg2bWdobXMzM2FobTg4NHdzcmZzai8w",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "c2lnbmF0dXJl",
            value:
              "RE0rSU42a3hsUlhDNjg4RTM3cFNrcFc4NkxNMHQ4TGxXRGJmK2o2c09QNTJTM2ZOdHBVTEp3Vjd3MUcrQ0tpZXQwcE9jWnAyR1ZJbVVmdnBFc3pDdHc9PQ==",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "YWN0aW9u",
            value: "L2Nvc213YXNtLndhc20udjEuTXNnTWlncmF0ZUNvbnRyYWN0",
          },
        ],
        type: "message",
      },
      {
        attributes: [
          {
            key: "bW9kdWxl",
            value: "d2FzbQ==",
          },
          {
            key: "c2VuZGVy",
            value:
              "b3NtbzE4cmYydmtldHVoZnZydzBuOTg2bWdobXMzM2FobTg4NHdzcmZzag==",
          },
        ],
        type: "message",
      },
      {
        attributes: [
          {
            key: "Y29kZV9pZA==",
            value: "MTc=",
          },
          {
            key: "X2NvbnRyYWN0X2FkZHJlc3M=",
            value:
              "b3NtbzFjdnR6d3NqOGxhbTlhdDh2Zmd4Zm52ZXl6am5lOGVlY3FqbnNoNmszanZ0M2w3dmU2em1zM3d0cGQw",
          },
        ],
        type: "migrate",
      },
      {
        attributes: [
          {
            key: "c3BlbmRlcg==",
            value:
              "b3NtbzE4cmYydmtldHVoZnZydzBuOTg2bWdobXMzM2FobTg4NHdzcmZzag==",
          },
          {
            key: "YW1vdW50",
            value: "NDg4MHVvc21v",
          },
        ],
        type: "coin_spent",
      },
      {
        attributes: [
          {
            key: "cmVjZWl2ZXI=",
            value:
              "b3NtbzE3eHBmdmFrbTJhbWc5NjJ5bHM2Zjg0ejNrZWxsOGM1bGN6c3NhMA==",
          },
          {
            key: "YW1vdW50",
            value: "NDg4MHVvc21v",
          },
        ],
        type: "coin_received",
      },
      {
        attributes: [
          {
            key: "cmVjaXBpZW50",
            value:
              "b3NtbzE3eHBmdmFrbTJhbWc5NjJ5bHM2Zjg0ejNrZWxsOGM1bGN6c3NhMA==",
          },
          {
            key: "c2VuZGVy",
            value:
              "b3NtbzE4cmYydmtldHVoZnZydzBuOTg2bWdobXMzM2FobTg4NHdzcmZzag==",
          },
          {
            key: "YW1vdW50",
            value: "NDg4MHVvc21v",
          },
        ],
        type: "transfer",
      },
      {
        attributes: [
          {
            key: "c2VuZGVy",
            value:
              "b3NtbzE4cmYydmtldHVoZnZydzBuOTg2bWdobXMzM2FobTg4NHdzcmZzag==",
          },
        ],
        type: "message",
      },
      {
        attributes: [
          {
            key: "ZmVl",
            value: "NDg4MHVvc21v",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "YWNjX3NlcQ==",
            value:
              "b3NtbzE4cmYydmtldHVoZnZydzBuOTg2bWdobXMzM2FobTg4NHdzcmZzai8w",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "c2lnbmF0dXJl",
            value:
              "RE0rSU42a3hsUlhDNjg4RTM3cFNrcFc4NkxNMHQ4TGxXRGJmK2o2c09QNTJTM2ZOdHBVTEp3Vjd3MUcrQ0tpZXQwcE9jWnAyR1ZJbVVmdnBFc3pDdHc9PQ==",
          },
        ],
        type: "tx",
      },
    ],
    gasUsed: "150668",
    gasWanted: "195164",
    height: "1417710",
    info: "",
    logs: [
      {
        events: [
          {
            attributes: [
              {
                key: "action",
                value: "/cosmwasm.wasm.v1.MsgMigrateContract",
              },
              {
                key: "module",
                value: "wasm",
              },
              {
                key: "sender",
                value: "osmo18rf2vketuhfvrw0n986mghms33ahm884wsrfsj",
              },
            ],
            type: "message",
          },
          {
            attributes: [
              {
                key: "code_id",
                value: "17",
              },
              {
                key: "_contract_address",
                value:
                  "osmo1cvtzwsj8lam9at8vfgxfnveyzjne8eecqjnsh6k3jvt3l7ve6zms3wtpd0",
              },
            ],
            type: "migrate",
          },
        ],
        log: "",
        msg_index: 0,
      },
    ],
    rawLog:
      '[{"events":[{"type":"message","attributes":[{"key":"action","value":"/cosmwasm.wasm.v1.MsgMigrateContract"},{"key":"module","value":"wasm"},{"key":"sender","value":"osmo18rf2vketuhfvrw0n986mghms33ahm884wsrfsj"}]},{"type":"migrate","attributes":[{"key":"code_id","value":"17"},{"key":"_contract_address","value":"osmo1cvtzwsj8lam9at8vfgxfnveyzjne8eecqjnsh6k3jvt3l7ve6zms3wtpd0"}]}]}]',
    timestamp: parseDate("2023-06-29T06:09:47Z"),
    tx: {
      "@type": "/cosmos.tx.v1beta1.Tx",
      authInfo: {
        fee: {
          amount: [
            {
              amount: "4880",
              denom: "uosmo",
            },
          ],
          gasLimit: "195164",
          granter: "",
          payer: "",
        },
        signerInfos: [
          {
            modeInfo: {
              single: {
                mode: "SIGN_MODE_DIRECT",
              },
            },
            publicKey: {
              "@type": "/cosmos.crypto.secp256k1.PubKey",
              key: "AjpLfngY/rc6Nk4GWQx6HcxHah8KM77D9q01vk83wnF2",
            },
            sequence: "0",
          },
        ],
      },
      body: {
        extensionOptions: [],
        memo: "",
        messages: [
          {
            "@type": "/cosmwasm.wasm.v1.MsgMigrateContract",
            code_id: "17",
            contract:
              "osmo1cvtzwsj8lam9at8vfgxfnveyzjne8eecqjnsh6k3jvt3l7ve6zms3wtpd0",
            msg: {},
            sender: "osmo18rf2vketuhfvrw0n986mghms33ahm884wsrfsj",
          },
        ],
        nonCriticalExtensionOptions: [],
        timeoutHeight: "0",
      },
      signatures: [
        "DM+IN6kxlRXC688E37pSkpW86LM0t8LlWDbf+j6sOP52S3fNtpULJwV7w1G+CKiet0pOcZp2GVImUfvpEszCtw==",
      ],
    },
    txhash: "1B1269C4B5704E9872B26ACE447B043099C98E9B7EA20373517CF59038321A43",
  },
  result: [
    {
      events: [
        {
          attributes: [
            {
              key: "action",
              value: "/cosmwasm.wasm.v1.MsgMigrateContract",
            },
            {
              key: "module",
              value: "wasm",
            },
            {
              key: "sender",
              value: "osmo18rf2vketuhfvrw0n986mghms33ahm884wsrfsj",
            },
          ],
          type: "message",
        },
        {
          attributes: [
            {
              key: "code_id",
              value: "17",
            },
            {
              key: "_contract_address",
              value:
                "osmo1cvtzwsj8lam9at8vfgxfnveyzjne8eecqjnsh6k3jvt3l7ve6zms3wtpd0",
            },
          ],
          type: "migrate",
        },
      ],
      log: "",
      msg_index: 0,
    },
  ],
};

export const fromLogsTxFailed: TestCase = {
  txData: {
    code: 10,
    codespace: "gov",
    data: "",
    events: [
      {
        attributes: [
          {
            key: "c3BlbmRlcg==",
            value:
              "b3NtbzFnMmdkemhocXYzOHFhdThubjI5NXp2ZWdzbmZ2NnU0am02dW1qNw==",
          },
          {
            key: "YW1vdW50",
            value: "MjI1MDAwdW9zbW8=",
          },
        ],
        type: "coin_spent",
      },
      {
        attributes: [
          {
            key: "cmVjZWl2ZXI=",
            value:
              "b3NtbzE3eHBmdmFrbTJhbWc5NjJ5bHM2Zjg0ejNrZWxsOGM1bGN6c3NhMA==",
          },
          {
            key: "YW1vdW50",
            value: "MjI1MDAwdW9zbW8=",
          },
        ],
        type: "coin_received",
      },
      {
        attributes: [
          {
            key: "cmVjaXBpZW50",
            value:
              "b3NtbzE3eHBmdmFrbTJhbWc5NjJ5bHM2Zjg0ejNrZWxsOGM1bGN6c3NhMA==",
          },
          {
            key: "c2VuZGVy",
            value:
              "b3NtbzFnMmdkemhocXYzOHFhdThubjI5NXp2ZWdzbmZ2NnU0am02dW1qNw==",
          },
          {
            key: "YW1vdW50",
            value: "MjI1MDAwdW9zbW8=",
          },
        ],
        type: "transfer",
      },
      {
        attributes: [
          {
            key: "c2VuZGVy",
            value:
              "b3NtbzFnMmdkemhocXYzOHFhdThubjI5NXp2ZWdzbmZ2NnU0am02dW1qNw==",
          },
        ],
        type: "message",
      },
      {
        attributes: [
          {
            key: "ZmVl",
            value: "MjI1MDAwdW9zbW8=",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "YWNjX3NlcQ==",
            value:
              "b3NtbzFnMmdkemhocXYzOHFhdThubjI5NXp2ZWdzbmZ2NnU0am02dW1qNy80",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "c2lnbmF0dXJl",
            value:
              "elkxQXk2SHRJaWtveno0NUV0WFpKMk91TlRyR0hwQkZEY1pWc3JxWDU2TXdJN0ZmeitKS0lKdzBRSGFVUkNLRmpBbkVhNDhkRzZWQzIrVTkvTnhIeGc9PQ==",
          },
        ],
        type: "tx",
      },
    ],
    gasUsed: "706339",
    gasWanted: "9000000",
    height: "5902531",
    info: "",
    logs: [],
    rawLog:
      "failed to execute message; message index: 0: was (1000uosmo), need (400000000uosmo): minimum deposit is too small",
    timestamp: parseDate("2022-09-06T09:03:15Z"),
    tx: {
      "@type": "/cosmos.tx.v1beta1.Tx",
      authInfo: {
        fee: {
          amount: [
            {
              amount: "225000",
              denom: "uosmo",
            },
          ],
          gasLimit: "9000000",
          granter: "",
          payer: "",
        },
        signerInfos: [
          {
            modeInfo: {
              single: {
                mode: "SIGN_MODE_DIRECT",
              },
            },
            publicKey: {
              "@type": "/cosmos.crypto.secp256k1.PubKey",
              key: "A0KHudvOKFXLps3gbcvvMwLy7Tm05wUfuGmNKiszslQ4",
            },
            sequence: "4",
          },
        ],
      },
      body: {
        extensionOptions: [],
        memo: "",
        messages: [
          {
            "@type": "/cosmos.gov.v1beta1.MsgSubmitProposal",
            content: {
              "@type": "/cosmwasm.wasm.v1.StoreCodeProposal",
              builder: "",
              code_hash: null,
              description:
                "We are Band Protocol and would like to propose the upload of oracle base contract. This contract is for receiving price relay from BandChain and we're not recommend anyone to reference price from this contract. The oracle contract code can be found here: [https://github.com/bandprotocol/band-stdreference-contracts-cosmwasm/tree/main/std_reference_basic](https://github.com/bandprotocol/band-stdreference-contracts-cosmwasm/tree/main/std_reference_basic)",
              instantiate_permission: {
                address: "osmo1jkw02jjluu733radeg6vx6zqyg42awg2sy3k3e",
                addresses: [],
                permission: "OnlyAddress",
              },
              run_as: "osmo1g2gdzhhqv38qau8nn295zvegsnfv6u4jm6umj7",
              source: "",
              title: "Upload Oracle StdReferenceBasic Contract",
              unpin_code: false,
              wasm_byte_code:
                "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",
            },
            initial_deposit: [
              {
                amount: "1000",
                denom: "uosmo",
              },
            ],
            is_expedited: false,
            proposer: "osmo1g2gdzhhqv38qau8nn295zvegsnfv6u4jm6umj7",
          },
        ],
        nonCriticalExtensionOptions: [],
        timeoutHeight: "0",
      },
      signatures: [
        "zY1Ay6HtIikozz45EtXZJ2OuNTrGHpBFDcZVsrqX56MwI7Ffz+JKIJw0QHaURCKFjAnEa48dG6VC2+U9/NxHxg==",
      ],
    },
    txhash: "4722758776F36276F617D6018E6AC7D4C1491B31267E7EB5CCC8CD93288F1B63",
  },
  result: [],
};

export const fromEvents: TestCase = {
  txData: {
    code: 0,
    codespace: "",
    data: "12240A222F696E697469612E6D6F76652E76312E4D73675075626C697368526573706F6E7365",
    events: [
      {
        attributes: [
          {
            key: "sender",
            value: "0x38d2a65b2be5d2c1b9f329f5b45f708c7b7d9cf5",
          },
          {
            key: "module_addr",
            value: "0x1",
          },
          {
            key: "module_name",
            value: "coin",
          },
          {
            key: "function_name",
            value: "transfer",
          },
        ],
        type: "execute",
      },
      {
        attributes: [
          {
            key: "type_tag",
            value: "0x1::fungible_asset::WithdrawEvent",
          },
          {
            key: "data",
            value:
              '{"store_addr":"0x48b7bc1a3e58ffa9f964ebc3f4217556dcdaa6749d1df92abd9146bb5405dece","metadata_addr":"0x8e4733bdabcf7d4afc3d14f0dd46c9bf52fb0fce9e4b996c939e195b8bc891d9","amount":"114877"}',
          },
        ],
        type: "move",
      },
      {
        attributes: [
          {
            key: "type_tag",
            value: "0x1::fungible_asset::DepositEvent",
          },
          {
            key: "data",
            value:
              '{"store_addr":"0x66a8cb0bfb991610dcffb8a6543ac0887c7c5405b8f985ebed6d628fe50c4686","metadata_addr":"0x8e4733bdabcf7d4afc3d14f0dd46c9bf52fb0fce9e4b996c939e195b8bc891d9","amount":"114877"}',
          },
        ],
        type: "move",
      },
      {
        attributes: [
          {
            key: "spender",
            value: "init18rf2vketuhfvrw0n986mghms33ahm884gas2dz",
          },
          {
            key: "amount",
            value: "114877uinit",
          },
        ],
        type: "coin_spent",
      },
      {
        attributes: [
          {
            key: "receiver",
            value: "init17xpfvakm2amg962yls6f84z3kell8c5l70rnql",
          },
          {
            key: "amount",
            value: "114877uinit",
          },
        ],
        type: "coin_received",
      },
      {
        attributes: [
          {
            key: "recipient",
            value: "init17xpfvakm2amg962yls6f84z3kell8c5l70rnql",
          },
          {
            key: "sender",
            value: "init18rf2vketuhfvrw0n986mghms33ahm884gas2dz",
          },
          {
            key: "amount",
            value: "114877uinit",
          },
        ],
        type: "transfer",
      },
      {
        attributes: [
          {
            key: "sender",
            value: "init18rf2vketuhfvrw0n986mghms33ahm884gas2dz",
          },
        ],
        type: "message",
      },
      {
        attributes: [
          {
            key: "fee",
            value: "114877uinit",
          },
          {
            key: "fee_payer",
            value: "init18rf2vketuhfvrw0n986mghms33ahm884gas2dz",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "acc_seq",
            value: "init18rf2vketuhfvrw0n986mghms33ahm884gas2dz/0",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "signature",
            value:
              "THA48YPvYrty2OrQakrTpQWanP/BG9rCjDGgdAJ0TpB4xBezWiX5VTFl7EiCx6pF7T0nAf/bznL4l3LcKLGa5g==",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "action",
            value: "/initia.move.v1.MsgPublish",
          },
          {
            key: "sender",
            value: "init18rf2vketuhfvrw0n986mghms33ahm884gas2dz",
          },
          {
            key: "module",
            value: "move",
          },
          {
            key: "msg_index",
            value: "0",
          },
        ],
        type: "message",
      },
      {
        attributes: [
          {
            key: "sender",
            value: "0x38d2a65b2be5d2c1b9f329f5b45f708c7b7d9cf5",
          },
          {
            key: "module_addr",
            value: "0x1",
          },
          {
            key: "module_name",
            value: "code",
          },
          {
            key: "function_name",
            value: "publish",
          },
          {
            key: "msg_index",
            value: "0",
          },
        ],
        type: "execute",
      },
      {
        attributes: [
          {
            key: "type_tag",
            value: "0x1::code::ModulePublishedEvent",
          },
          {
            key: "data",
            value:
              '{"module_id":"0x38d2a65b2be5d2c1b9f329f5b45f708c7b7d9cf5::pool_infos","upgrade_policy":0}',
          },
          {
            key: "msg_index",
            value: "0",
          },
        ],
        type: "move",
      },
    ],
    gasUsed: "374198",
    gasWanted: "760770",
    height: "8030",
    info: "",
    logs: [],
    rawLog: "",
    timestamp: parseDate("2024-01-16T16:51:20Z"),
    tx: {
      "@type": "/cosmos.tx.v1beta1.Tx",
      authInfo: {
        fee: {
          amount: [
            {
              amount: "114877",
              denom: "uinit",
            },
          ],
          gasLimit: "760770",
          granter: "",
          payer: "",
        },
        signerInfos: [
          {
            modeInfo: {
              single: {
                mode: "SIGN_MODE_DIRECT",
              },
            },
            publicKey: {
              "@type": "/cosmos.crypto.secp256k1.PubKey",
              key: "AjpLfngY/rc6Nk4GWQx6HcxHah8KM77D9q01vk83wnF2",
            },
            sequence: "0",
          },
        ],
      },
      body: {
        extensionOptions: [],
        memo: "",
        messages: [
          {
            "@type": "/initia.move.v1.MsgPublish" as TypeUrl,
            code_bytes: [
              "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",
            ],
            sender: "init18rf2vketuhfvrw0n986mghms33ahm884gas2dz",
            upgrade_policy: "ARBITRARY",
          },
        ],
        nonCriticalExtensionOptions: [],
        timeoutHeight: "0",
      },
      signatures: [
        "THA48YPvYrty2OrQakrTpQWanP/BG9rCjDGgdAJ0TpB4xBezWiX5VTFl7EiCx6pF7T0nAf/bznL4l3LcKLGa5g==",
      ],
    },
    txhash: "CA11A83C242A5BF7139CFB1CCF529EC46A87CB6188B71EAAC63A8B7123894132",
  },
  result: [
    {
      msg_index: 0,
      log: "",
      events: [
        {
          attributes: [
            {
              key: "action",
              value: "/initia.move.v1.MsgPublish",
            },
            {
              key: "sender",
              value: "init18rf2vketuhfvrw0n986mghms33ahm884gas2dz",
            },
            {
              key: "module",
              value: "move",
            },
            {
              key: "msg_index",
              value: "0",
            },
          ],
          type: "message",
        },
        {
          attributes: [
            {
              key: "sender",
              value: "0x38d2a65b2be5d2c1b9f329f5b45f708c7b7d9cf5",
            },
            {
              key: "module_addr",
              value: "0x1",
            },
            {
              key: "module_name",
              value: "code",
            },
            {
              key: "function_name",
              value: "publish",
            },
            {
              key: "msg_index",
              value: "0",
            },
          ],
          type: "execute",
        },
        {
          attributes: [
            {
              key: "type_tag",
              value: "0x1::code::ModulePublishedEvent",
            },
            {
              key: "data",
              value:
                '{"module_id":"0x38d2a65b2be5d2c1b9f329f5b45f708c7b7d9cf5::pool_infos","upgrade_policy":0}',
            },
            {
              key: "msg_index",
              value: "0",
            },
          ],
          type: "move",
        },
      ],
    },
  ],
};

export const fromEventsTxFailed: TestCase = {
  txData: {
    code: 1,
    codespace: "undefined",
    data: "",
    events: [
      {
        attributes: [
          {
            key: "sender",
            value: "0xb9fe1fd018852d49cd066379ba314f94dce57f16",
          },
          {
            key: "module_addr",
            value: "0x1",
          },
          {
            key: "module_name",
            value: "coin",
          },
          {
            key: "function_name",
            value: "transfer",
          },
        ],
        type: "execute",
      },
      {
        attributes: [
          {
            key: "type_tag",
            value: "0x1::fungible_asset::WithdrawEvent",
          },
          {
            key: "data",
            value:
              '{"store_addr":"0xb3a18ed65a760faa12b9fa834f53ac6b413e05e416c29d14488aa45d76f15dd3","metadata_addr":"0x8e4733bdabcf7d4afc3d14f0dd46c9bf52fb0fce9e4b996c939e195b8bc891d9","amount":"750000"}',
          },
        ],
        type: "move",
      },
      {
        attributes: [
          {
            key: "type_tag",
            value: "0x1::fungible_asset::DepositEvent",
          },
          {
            key: "data",
            value:
              '{"store_addr":"0x66a8cb0bfb991610dcffb8a6543ac0887c7c5405b8f985ebed6d628fe50c4686","metadata_addr":"0x8e4733bdabcf7d4afc3d14f0dd46c9bf52fb0fce9e4b996c939e195b8bc891d9","amount":"750000"}',
          },
        ],
        type: "move",
      },
      {
        attributes: [
          {
            key: "spender",
            value: "init1h8lpl5qcs5k5nngxvdum5v20jnww2lckg3n2ta",
          },
          {
            key: "amount",
            value: "750000uinit",
          },
        ],
        type: "coin_spent",
      },
      {
        attributes: [
          {
            key: "receiver",
            value: "init17xpfvakm2amg962yls6f84z3kell8c5l70rnql",
          },
          {
            key: "amount",
            value: "750000uinit",
          },
        ],
        type: "coin_received",
      },
      {
        attributes: [
          {
            key: "recipient",
            value: "init17xpfvakm2amg962yls6f84z3kell8c5l70rnql",
          },
          {
            key: "sender",
            value: "init1h8lpl5qcs5k5nngxvdum5v20jnww2lckg3n2ta",
          },
          {
            key: "amount",
            value: "750000uinit",
          },
        ],
        type: "transfer",
      },
      {
        attributes: [
          {
            key: "sender",
            value: "init1h8lpl5qcs5k5nngxvdum5v20jnww2lckg3n2ta",
          },
        ],
        type: "message",
      },
      {
        attributes: [
          {
            key: "fee",
            value: "750000uinit",
          },
          {
            key: "fee_payer",
            value: "init1h8lpl5qcs5k5nngxvdum5v20jnww2lckg3n2ta",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "acc_seq",
            value: "init1h8lpl5qcs5k5nngxvdum5v20jnww2lckg3n2ta/73",
          },
        ],
        type: "tx",
      },
      {
        attributes: [
          {
            key: "signature",
            value:
              "2CXCevdXDrBhyMqVuh3QRwvnWrgecv6bJ2FBOv9o/JhrAF1i7HnXkoTF21fDWMgUbtHFeZvYSpU+ebTiT9+2ew==",
          },
        ],
        type: "tx",
      },
    ],
    gasUsed: "84285",
    gasWanted: "5000000",
    height: "191957",
    info: "",
    logs: [],
    rawLog:
      "failed to execute message; message index: 0: VM failure: status OUT_OF_GAS of type Execution, location=0000000000000000000000002ab506311ffe3aaf8871f84a7ba8a685e025dbba::ed25519, function=1, code_offset=12",
    timestamp: parseDate("2024-01-26T07:05:00Z"),
    tx: {
      "@type": "/cosmos.tx.v1beta1.Tx",
      authInfo: {
        fee: {
          amount: [
            {
              amount: "750000",
              denom: "uinit",
            },
          ],
          gasLimit: "5000000",
          granter: "",
          payer: "",
        },
        signerInfos: [
          {
            modeInfo: {
              single: {
                mode: "SIGN_MODE_DIRECT",
              },
            },
            publicKey: {
              "@type": "/cosmos.crypto.secp256k1.PubKey",
              key: "A5vqpm4KH4Qz7T2DC31p3nZ8nK5M6ZrnDa4PcE6zg/Y0",
            },
            sequence: "73",
          },
        ],
      },
      body: {
        extensionOptions: [],
        memo: "",
        messages: [
          {
            "@type": "/initia.move.v1.MsgExecute" as TypeUrl,
            args: [],
            function_name: "hash_x",
            module_address: "0x2ab506311ffe3aaf8871f84a7ba8a685e025dbba",
            module_name: "ed25519",
            sender: "init1h8lpl5qcs5k5nngxvdum5v20jnww2lckg3n2ta",
            type_args: [],
          },
        ],
        nonCriticalExtensionOptions: [],
        timeoutHeight: "0",
      },
      signatures: [
        "2CXCevdXDrBhyMqVuh3QRwvnWrgecv6bJ2FBOv9o/JhrAF1i7HnXkoTF21fDWMgUbtHFeZvYSpU+ebTiT9+2ew==",
      ],
    },
    txhash: "F252AA07AA9FA79A3488FD6E552E6B7A168E997CB923E0C43C770835F42F217C",
  },
  result: [],
};
