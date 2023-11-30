import { z } from "zod";

import type { NominalType } from "./common";

export type HumanAddr = string & NominalType<"HumanAddr">;
export type HexAddr = string & NominalType<"HexAddr">;
export type ContractAddr = string & NominalType<"ContractAddr">;

export const ValidatorAddrSchema = z.string().brand("ValidatorAddr");
export type ValidatorAddr = z.infer<typeof ValidatorAddrSchema>;

export type MoveAccountAddr = HumanAddr | HexAddr;
export type Addr = MoveAccountAddr | ContractAddr;
