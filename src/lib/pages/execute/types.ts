import type { ContractAddr } from "lib/types";

export interface ExecutePageState {
  contractAddress: ContractAddr;
  initialMsg: string;
  assets: { denom: string; amount: string }[];
}
