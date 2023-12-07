import { z } from "zod";

export const zHumanAddr = z.string().brand("HumanAddr");
export type HumanAddr = z.infer<typeof zHumanAddr>;

export const zContractAddr = z.string().brand("ContractAddr");
export type ContractAddr = z.infer<typeof zContractAddr>;

export const zHexAddr = z.string().brand("HexAddr");
export type HexAddr = z.infer<typeof zHexAddr>;

export const zValidatorAddr = z.string().brand("ValidatorAddr");
export type ValidatorAddr = z.infer<typeof zValidatorAddr>;

export const zMoveAccountAddr = z.union([zHumanAddr, zHexAddr]);
export type MoveAccountAddr = z.infer<typeof zMoveAccountAddr>;
export const zAddr = z.union([zMoveAccountAddr, zContractAddr]);
export type Addr = z.infer<typeof zAddr>;
