import type { EncodeObject } from "@cosmjs/proto-signing";
import type { Coin } from "@cosmjs/stargate";
import type { Msg } from "@initia/initia.js";
import { ParameterChangeProposal } from "cosmjs-types/cosmos/params/v1beta1/params";
import { StoreCodeProposal } from "cosmjs-types/cosmwasm/wasm/v1/proposal";

import { exponentify } from "../formatter";
import { typeUrlDict } from "lib/data";
import type {
  ComposedMsg,
  TxMessage,
  AccessType,
  Addr,
  Token,
  HumanAddr,
  Option,
} from "lib/types";
import { MsgType } from "lib/types";

export const toEncodeObject = (msgs: Msg[]): EncodeObject[] => {
  return msgs.map((msg) => ({
    typeUrl: msg.toData()["@type"],
    value: msg.toProto(),
  }));
};

// TODO: remove `composeMsg` and use `toEnCodeObject` for sending tx instead
export const composeMsg = (msgType: MsgType, msg: TxMessage): ComposedMsg => {
  const typeUrl = typeUrlDict[msgType];
  return {
    typeUrl,
    value: msg,
  };
};

interface StoreCodeMsgArgs {
  sender: Addr;
  wasmByteCode: Uint8Array;
  permission: AccessType;
  addresses?: Addr[];
}

export const composeStoreCodeMsg = ({
  sender,
  wasmByteCode,
  permission,
  addresses,
}: StoreCodeMsgArgs) =>
  composeMsg(MsgType.STORE_CODE, {
    sender,
    wasmByteCode,
    instantiatePermission: {
      permission,
      addresses,
      address: "" as Addr,
    },
  });

interface WhitelistProposalMsgArgs {
  title: string;
  description: string;
  changesValue: string;
  initialDeposit: Coin;
  proposer: Addr;
  precision: Option<number>;
}

export const composeSubmitWhitelistProposalMsg = ({
  title,
  description,
  changesValue,
  initialDeposit,
  proposer,
  precision,
}: WhitelistProposalMsgArgs): ComposedMsg =>
  composeMsg(MsgType.SUBMIT_PROPOSAL, {
    content: {
      typeUrl: "/cosmos.params.v1beta1.ParameterChangeProposal",
      value: Uint8Array.from(
        ParameterChangeProposal.encode({
          title,
          description,
          changes: [
            {
              subspace: "wasm",
              key: "uploadAccess",
              value: changesValue,
            },
          ],
        }).finish()
      ),
    },
    initialDeposit: [
      {
        denom: initialDeposit.denom,
        amount: exponentify(
          (initialDeposit.amount || 0) as Token,
          precision
        ).toFixed(0),
      },
    ],
    proposer,
  });

interface StoreCodeProposalMsgArgs {
  proposer: HumanAddr;
  title: string;
  description: string;
  runAs: Addr;
  wasmByteCode: Uint8Array;
  permission: AccessType;
  addresses: Addr[];
  unpinCode: boolean;
  source: string;
  builder: string;
  codeHash: Uint8Array;
  initialDeposit: Coin;
  precision: Option<number>;
}

export const composeStoreCodeProposalMsg = ({
  proposer,
  title,
  description,
  runAs,
  wasmByteCode,
  permission,
  addresses,
  unpinCode,
  source,
  builder,
  codeHash,
  initialDeposit,
  precision,
}: StoreCodeProposalMsgArgs): ComposedMsg =>
  composeMsg(MsgType.SUBMIT_PROPOSAL, {
    content: {
      typeUrl: "/cosmwasm.wasm.v1.StoreCodeProposal",
      value: Uint8Array.from(
        StoreCodeProposal.encode({
          title: title.trim(),
          description: description.trim(),
          runAs,
          wasmByteCode,
          instantiatePermission: {
            permission,
            addresses,
            address: "" as Addr,
          },
          unpinCode,
          source,
          builder,
          codeHash,
        }).finish()
      ),
    },
    initialDeposit: [
      {
        denom: initialDeposit.denom,
        amount: exponentify(
          (initialDeposit.amount || 0) as Token,
          precision
        ).toFixed(0),
      },
    ],
    proposer,
  });
