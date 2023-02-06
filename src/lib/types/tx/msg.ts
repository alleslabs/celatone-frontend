import type { Coin } from "@cosmjs/stargate";

import type { ContractAddr, HumanAddr } from "../currency/addrs";

type Addresses = HumanAddr | ContractAddr;

export enum MsgType {
  STORE_CODE = "STORE_CODE",
  INSTANTIATE = "INSTANTIATE",
  EXECUTE = "EXECUTE",
  MIGRATE = "MIGRATE",
  UPDATE_ADMIN = "UPDATE_ADMIN",
}

export enum AccessType {
  ACCESS_TYPE_UNSPECIFIED = 0,
  ACCESS_TYPE_NOBODY = 1,
  ACCESS_TYPE_ONLY_ADDRESS = 2,
  ACCESS_TYPE_EVERYBODY = 3,
  UNRECOGNIZED = -1,
}

export interface AccessConfig {
  permission: AccessType;
  address: HumanAddr;
}

export interface MsgStoreCode {
  sender: Addresses;
  wasmByteCode: Uint8Array;
  instantiatePermission?: AccessConfig;
}

export interface MsgInstantiateContract {
  sender: Addresses;
  admin: Addresses;
  codeId: Long;
  label: string;
  msg: Uint8Array;
  funds: Coin[];
}

export interface MsgExecuteContract {
  sender: Addresses;
  contract: ContractAddr;
  msg: Uint8Array;
  funds: Coin[];
}

export interface MsgMigrateContract {
  sender: Addresses;
  contract: Addresses;
  codeId: Long;
  msg: Uint8Array;
}
export interface MsgUpdateAdmin {
  sender: Addresses;
  newAdmin: Addresses;
  contract: ContractAddr;
}

export type TxMessage =
  | MsgStoreCode
  | MsgInstantiateContract
  | MsgExecuteContract
  | MsgMigrateContract
  | MsgUpdateAdmin;

export interface ComposedMsg {
  typeUrl: string;
  value: TxMessage;
}

export interface DetailExecute extends MsgExecuteContract {
  msgJSON: string;
}

export interface DetailInstantiate extends MsgInstantiateContract {
  contractAddress: ContractAddr;
}

export interface DetailSend {
  amount: Coin[];
  fromAddress: Addresses;
  toAddress: Addresses;
}
export interface DetailUpload {
  id: number;
  sender: Addresses;
}

export interface DetailClearAdmin {
  contract: ContractAddr;
  sender: Addresses;
}

export interface DetailUpdateAdmin {
  contract: ContractAddr;
  newAdmin: Addresses;
  sender: Addresses;
}

export interface DetailMigrate {
  codeId: number;
  contract: ContractAddr;
  msg: object;
  sender: Addresses;
}
