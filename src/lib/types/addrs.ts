import { z } from "zod";

import type { NominalType } from "./common";

export type HumanAddr = string & NominalType<"HumanAddr">;
export const HexAddrSchema = z.string().brand("HexAddr");
export type HexAddr = z.infer<typeof HexAddrSchema>;
export type ContractAddr = string & NominalType<"ContractAddr">;
export type ValidatorAddr = string & NominalType<"ValidatorAddr">;

export type MoveAccountAddr = HumanAddr | HexAddr;
export type Addr = MoveAccountAddr | ContractAddr;
