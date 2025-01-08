import type { Coin } from "@cosmjs/stargate";
import type { MsgSubmitProposal } from "cosmjs-types/cosmos/gov/v1beta1/tx";

import type { BechAddr, BechAddr32 } from "../addrs";

export enum AccessType {
  ACCESS_TYPE_ANY_OF_ADDRESSES = 4,
  ACCESS_TYPE_EVERYBODY = 3,
  ACCESS_TYPE_NOBODY = 1,
  ACCESS_TYPE_ONLY_ADDRESS = 2,
  ACCESS_TYPE_UNSPECIFIED = 0,
  UNRECOGNIZED = -1,
}

export enum MsgType {
  EXECUTE = "EXECUTE",
  INSTANTIATE = "INSTANTIATE",
  MIGRATE = "MIGRATE",
  STORE_CODE = "STORE_CODE",
  SUBMIT_PROPOSAL = "SUBMIT_PROPOSAL",
  UPDATE_ADMIN = "UPDATE_ADMIN",
}

export interface AccessConfig {
  address: BechAddr;
  addresses?: BechAddr[];
  permission: AccessType;
}

export interface ComposedMsg {
  typeUrl: string;
  value: TxMessage;
}

export interface DetailClearAdmin {
  contract: BechAddr32;
  sender: BechAddr;
}

export interface DetailExecute extends MsgExecuteContract {
  msgJSON: string;
}

export interface DetailInstantiate extends MsgInstantiateContract {
  contractAddress: BechAddr32;
}
export interface DetailMigrate {
  codeId: number;
  contract: BechAddr32;
  msg: object;
  sender: BechAddr;
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

export interface DetailUpdateAdmin {
  contract: BechAddr32;
  newAdmin: BechAddr;
  sender: BechAddr;
}

export interface MsgExecuteContract {
  contract: BechAddr32;
  funds: Coin[];
  msg: Uint8Array;
  sender: BechAddr;
}

export interface MsgInstantiateContract {
  admin: BechAddr;
  codeId: Long;
  funds: Coin[];
  label: string;
  msg: Uint8Array;
  sender: BechAddr;
}
export interface MsgMigrateContract {
  codeId: Long;
  contract: BechAddr32;
  msg: Uint8Array;
  sender: BechAddr;
}

export interface MsgStoreCode {
  instantiatePermission?: AccessConfig;
  sender: BechAddr;
  wasmByteCode: Uint8Array;
}

export interface MsgUpdateAdmin {
  contract: BechAddr32;
  newAdmin: BechAddr;
  sender: BechAddr;
}

export type TxMessage =
  | MsgExecuteContract
  | MsgInstantiateContract
  | MsgMigrateContract
  | MsgStoreCode
  | MsgSubmitProposal
  | MsgUpdateAdmin;
