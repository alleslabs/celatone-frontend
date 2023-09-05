import type { NominalType } from "./currency/common";

export type HumanAddr = string & NominalType<"HumanAddr">;
export type HexAddr = string & NominalType<"HexAddr">;
export type ContractAddr = string & NominalType<"ContractAddr">;
export type ValidatorAddr = string & NominalType<"ValidatorAddr">;

export type AccountAddr = HumanAddr | HexAddr;
export type Addr = AccountAddr | ContractAddr;
