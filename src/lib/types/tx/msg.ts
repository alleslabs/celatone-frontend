import type { Coin } from "@cosmjs/stargate";
import type { MsgSubmitProposal } from "cosmjs-types/cosmos/gov/v1beta1/tx";

import type { BechAddr, BechAddr32 } from "../addrs";

export enum MsgType {
  STORE_CODE = "STORE_CODE",
  INSTANTIATE = "INSTANTIATE",
  EXECUTE = "EXECUTE",
  MIGRATE = "MIGRATE",
  UPDATE_ADMIN = "UPDATE_ADMIN",
  SUBMIT_PROPOSAL = "SUBMIT_PROPOSAL",
}

export enum AccessType {
  ACCESS_TYPE_UNSPECIFIED = 0,
  ACCESS_TYPE_NOBODY = 1,
  ACCESS_TYPE_ONLY_ADDRESS = 2,
  ACCESS_TYPE_EVERYBODY = 3,
  ACCESS_TYPE_ANY_OF_ADDRESSES = 4,
  UNRECOGNIZED = -1,
}

export interface AccessConfig {
  permission: AccessType;
  address: BechAddr;
  addresses?: BechAddr[];
}

export interface MsgStoreCode {
  sender: BechAddr;
  wasmByteCode: Uint8Array;
  instantiatePermission?: AccessConfig;
}

export interface MsgInstantiateContract {
  sender: BechAddr;
  admin: BechAddr;
  codeId: Long;
  label: string;
  msg: Uint8Array;
  funds: Coin[];
}

export interface MsgExecuteContract {
  sender: BechAddr;
  contract: BechAddr32;
  msg: Uint8Array;
  funds: Coin[];
}

export interface MsgMigrateContract {
  sender: BechAddr;
  contract: BechAddr32;
  codeId: Long;
  msg: Uint8Array;
}
export interface MsgUpdateAdmin {
  sender: BechAddr;
  newAdmin: BechAddr;
  contract: BechAddr32;
}

export type TxMessage =
  | MsgStoreCode
  | MsgInstantiateContract
  | MsgExecuteContract
  | MsgMigrateContract
  | MsgUpdateAdmin
  | MsgSubmitProposal;

export interface ComposedMsg {
  typeUrl: string;
  value: TxMessage;
}

export interface DetailExecute extends MsgExecuteContract {
  msgJSON: string;
}

export interface DetailInstantiate extends MsgInstantiateContract {
  contractAddress: BechAddr32;
}

export interface DetailSend {
  amount: Coin[];
  fromAddress: BechAddr;
  toAddress: BechAddr;
}
export interface DetailStoreCode {
  id: number;
  sender: BechAddr;
}

export interface DetailClearAdmin {
  contract: BechAddr32;
  sender: BechAddr;
}

export interface DetailUpdateAdmin {
  contract: BechAddr32;
  newAdmin: BechAddr;
  sender: BechAddr;
}

export interface DetailMigrate {
  codeId: number;
  contract: BechAddr32;
  msg: object;
  sender: BechAddr;
}
