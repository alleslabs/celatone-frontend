import type { Coin } from "@cosmjs/stargate";

import type { Addr, ContractAddr, HumanAddr } from "../addrs";

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
  sender: Addr;
  wasmByteCode: Uint8Array;
  instantiatePermission?: AccessConfig;
}

export interface MsgInstantiateContract {
  sender: Addr;
  admin: Addr;
  codeId: Long;
  label: string;
  msg: Uint8Array;
  funds: Coin[];
}

export interface MsgExecuteContract {
  sender: Addr;
  contract: ContractAddr;
  msg: Uint8Array;
  funds: Coin[];
}

export interface MsgMigrateContract {
  sender: Addr;
  contract: ContractAddr;
  codeId: Long;
  msg: Uint8Array;
}
export interface MsgUpdateAdmin {
  sender: Addr;
  newAdmin: Addr;
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
  fromAddress: Addr;
  toAddress: Addr;
}
export interface DetailUpload {
  id: number;
  sender: Addr;
}

export interface DetailClearAdmin {
  contract: ContractAddr;
  sender: Addr;
}

export interface DetailUpdateAdmin {
  contract: ContractAddr;
  newAdmin: Addr;
  sender: Addr;
}

export interface DetailMigrate {
  codeId: number;
  contract: ContractAddr;
  msg: object;
  sender: Addr;
}
