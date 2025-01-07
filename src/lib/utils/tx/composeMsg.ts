import type { EncodeObject } from "@cosmjs/proto-signing";
import type { Coin } from "@cosmjs/stargate";
import { MsgPublish, MsgScript } from "@initia/initia.js";
import type { Msg } from "@initia/initia.js";
import { ParameterChangeProposal } from "cosmjs-types/cosmos/params/v1beta1/params";
import { StoreCodeProposal } from "cosmjs-types/cosmwasm/wasm/v1/proposal";

import { serializeAbiData } from "../abi";
import { exponentify } from "../formatter";
import { typeUrlDict } from "lib/data";
import type {
  AbiFormData,
  AccessType,
  BechAddr,
  BechAddr20,
  ComposedMsg,
  ExposedFunction,
  Option,
  Token,
  TxMessage,
} from "lib/types";
import { MsgType, UpgradePolicy } from "lib/types";

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
  addresses?: BechAddr[];
  permission: AccessType;
  sender: BechAddr20;
  wasmByteCode: Uint8Array;
}

export const composeStoreCodeMsg = ({
  addresses,
  permission,
  sender,
  wasmByteCode,
}: StoreCodeMsgArgs) =>
  composeMsg(MsgType.STORE_CODE, {
    instantiatePermission: {
      address: "" as BechAddr,
      addresses,
      permission,
    },
    sender,
    wasmByteCode,
  });

interface WhitelistProposalMsgArgs {
  changesValue: string;
  description: string;
  initialDeposit: Coin;
  precision: Option<number>;
  proposer: BechAddr20;
  title: string;
}

export const composeSubmitWhitelistProposalMsg = ({
  changesValue,
  description,
  initialDeposit,
  precision,
  proposer,
  title,
}: WhitelistProposalMsgArgs): ComposedMsg =>
  composeMsg(MsgType.SUBMIT_PROPOSAL, {
    content: {
      typeUrl: "/cosmos.params.v1beta1.ParameterChangeProposal",
      value: Uint8Array.from(
        ParameterChangeProposal.encode({
          changes: [
            {
              key: "uploadAccess",
              subspace: "wasm",
              value: changesValue,
            },
          ],
          description,
          title,
        }).finish()
      ),
    },
    initialDeposit: [
      {
        amount: exponentify(
          (initialDeposit.amount || 0) as Token,
          precision
        ).toFixed(0),
        denom: initialDeposit.denom,
      },
    ],
    proposer,
  });

interface StoreCodeProposalMsgArgs {
  addresses: BechAddr[];
  builder: string;
  codeHash: Uint8Array;
  description: string;
  initialDeposit: Coin;
  permission: AccessType;
  precision: Option<number>;
  proposer: BechAddr20;
  runAs: BechAddr;
  source: string;
  title: string;
  unpinCode: boolean;
  wasmByteCode: Uint8Array;
}

export const composeStoreCodeProposalMsg = ({
  addresses,
  builder,
  codeHash,
  description,
  initialDeposit,
  permission,
  precision,
  proposer,
  runAs,
  source,
  title,
  unpinCode,
  wasmByteCode,
}: StoreCodeProposalMsgArgs): ComposedMsg =>
  composeMsg(MsgType.SUBMIT_PROPOSAL, {
    content: {
      typeUrl: "/cosmwasm.wasm.v1.StoreCodeProposal",
      value: Uint8Array.from(
        StoreCodeProposal.encode({
          builder,
          codeHash,
          description: description.trim(),
          instantiatePermission: {
            address: "" as BechAddr,
            addresses,
            permission,
          },
          runAs,
          source,
          title: title.trim(),
          unpinCode,
          wasmByteCode,
        }).finish()
      ),
    },
    initialDeposit: [
      {
        amount: exponentify(
          (initialDeposit.amount || 0) as Token,
          precision
        ).toFixed(0),
        denom: initialDeposit.denom,
      },
    ],
    proposer,
  });

export const composePublishMsg = (
  address: Option<BechAddr20>,
  codeBytesArr: string[],
  upgradePolicy: UpgradePolicy
) =>
  address
    ? toEncodeObject([
        new MsgPublish(
          address,
          codeBytesArr,
          Object.keys(UpgradePolicy).findIndex(
            (policy) => policy === upgradePolicy
          )
        ),
      ])
    : [];

export const composeScriptMsg = (
  address: Option<BechAddr20>,
  scriptBytes: string,
  fn: Option<ExposedFunction>,
  data: AbiFormData
) => {
  if (!address || !fn) return [];
  const { args, typeArgs } = serializeAbiData(fn, data);
  return toEncodeObject([new MsgScript(address, scriptBytes, typeArgs, args)]);
};
