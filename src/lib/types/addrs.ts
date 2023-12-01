import { z } from "zod";

export const HumanAddrSchema = z.string().brand("HumanAddr");
export type HumanAddr = z.infer<typeof HumanAddrSchema>;

export const ContractAddrSchema = z.string().brand("ContractAddr");
export type ContractAddr = z.infer<typeof ContractAddrSchema>;

export const HexAddrSchema = z.string().brand("HexAddr");
export type HexAddr = z.infer<typeof HexAddrSchema>;

export const ValidatorAddrSchema = z.string().brand("ValidatorAddr");
export type ValidatorAddr = z.infer<typeof ValidatorAddrSchema>;

export const MoveAccountAddrSchema = z.union([HumanAddrSchema, HexAddrSchema]);
export type MoveAccountAddr = z.infer<typeof MoveAccountAddrSchema>;
export const AddrSchema = z.union([MoveAccountAddrSchema, ContractAddrSchema]);
export type Addr = z.infer<typeof AddrSchema>;
