import type { NominalType } from "./currency/common";

export type HumanAddr = string & NominalType<"HumanAddr">;
export type ContractAddr = string & NominalType<"ContractAddr">;

export type Addr = HumanAddr | ContractAddr;
