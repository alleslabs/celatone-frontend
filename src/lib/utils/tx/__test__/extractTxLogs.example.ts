/* eslint-disable sonarjs/no-duplicate-string */
import type { logs } from "@cosmjs/stargate";

import type { TypeUrl } from "lib/data";
import type { TxData } from "lib/services/txService";
import { parseDate } from "lib/utils/date";

type TestCase = { txData: TxData; result: logs.Log[] };

export const fromLogs: TestCase = {
  txData: {
    chainId: "osmo-test-5",
    isTxFailed: false,
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
    gas_used: "150668",
    gas_wanted: "195164",
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
    raw_log:
      '[{"events":[{"type":"message","attributes":[{"key":"action","value":"/cosmwasm.wasm.v1.MsgMigrateContract"},{"key":"module","value":"wasm"},{"key":"sender","value":"osmo18rf2vketuhfvrw0n986mghms33ahm884wsrfsj"}]},{"type":"migrate","attributes":[{"key":"code_id","value":"17"},{"key":"_contract_address","value":"osmo1cvtzwsj8lam9at8vfgxfnveyzjne8eecqjnsh6k3jvt3l7ve6zms3wtpd0"}]}]}]',
    timestamp: parseDate("2023-06-29T06:09:47Z"),
    tx: {
      "@type": "/cosmos.tx.v1beta1.Tx",
      auth_info: {
        fee: {
          amount: [
            {
              amount: "4880",
              denom: "uosmo",
            },
          ],
          gas_limit: "195164",
          granter: "",
          payer: "",
        },
        signer_infos: [
          {
            mode_info: {
              single: {
                mode: "SIGN_MODE_DIRECT",
              },
            },
            public_key: {
              "@type": "/cosmos.crypto.secp256k1.PubKey",
              key: "AjpLfngY/rc6Nk4GWQx6HcxHah8KM77D9q01vk83wnF2",
            },
            sequence: "0",
          },
        ],
      },
      body: {
        extension_options: [],
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
        non_critical_extension_options: [],
        timeout_height: "0",
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

export const fromEvents: TestCase = {
  txData: {
    chainId: "stone-13",
    isTxFailed: false,
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
    gas_used: "374198",
    gas_wanted: "760770",
    height: "8030",
    info: "",
    logs: [],
    raw_log: "",
    timestamp: parseDate("2024-01-16T16:51:20Z"),
    tx: {
      "@type": "/cosmos.tx.v1beta1.Tx",
      auth_info: {
        fee: {
          amount: [
            {
              amount: "114877",
              denom: "uinit",
            },
          ],
          gas_limit: "760770",
          granter: "",
          payer: "",
        },
        signer_infos: [
          {
            mode_info: {
              single: {
                mode: "SIGN_MODE_DIRECT",
              },
            },
            public_key: {
              "@type": "/cosmos.crypto.secp256k1.PubKey",
              key: "AjpLfngY/rc6Nk4GWQx6HcxHah8KM77D9q01vk83wnF2",
            },
            sequence: "0",
          },
        ],
      },
      body: {
        extension_options: [],
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
        non_critical_extension_options: [],
        timeout_height: "0",
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
