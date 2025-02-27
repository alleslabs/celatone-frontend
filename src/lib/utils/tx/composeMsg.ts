import type { EncodeObject } from "@cosmjs/proto-signing";
import type { Coin } from "@cosmjs/stargate";
import { MsgPublish, MsgScript } from "@initia/initia.js";
import type { Msg } from "@initia/initia.js";
import { ParameterChangeProposal } from "cosmjs-types/cosmos/params/v1beta1/params";
import { StoreCodeProposal } from "cosmjs-types/cosmwasm/wasm/v1/proposal";

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
import { serializeAbiData } from "../abi";
import { exponentify } from "../formatter";

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
  sender: BechAddr20;
  wasmByteCode: Uint8Array;
  permission: AccessType;
  addresses?: BechAddr[];
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
      address: "" as BechAddr,
    },
  });

interface WhitelistProposalMsgArgs {
  title: string;
  description: string;
  changesValue: string;
  initialDeposit: Coin;
  proposer: BechAddr20;
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
  proposer: BechAddr20;
  title: string;
  description: string;
  runAs: BechAddr;
  wasmByteCode: Uint8Array;
  permission: AccessType;
  addresses: BechAddr[];
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
            address: "" as BechAddr,
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
  const { typeArgs, args } = serializeAbiData(fn, data);
  return toEncodeObject([new MsgScript(address, scriptBytes, typeArgs, args)]);
};
