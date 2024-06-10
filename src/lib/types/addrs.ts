import { z } from "zod";

export const zBechAddr20 = z.string().brand("BechAddr20");
export type BechAddr20 = z.infer<typeof zBechAddr20>;

export const zBechAddr32 = z.string().brand("BechAddr32");
export type BechAddr32 = z.infer<typeof zBechAddr32>;

export const zHexAddr20 = z.string().brand("HexAddr20");
export type HexAddr20 = z.infer<typeof zHexAddr20>;

export const zHexAddr32 = z.string().brand("HexAddr32");
export type HexAddr32 = z.infer<typeof zHexAddr32>;

export const zBechAddr = z.union([zBechAddr20, zBechAddr32]);
export type BechAddr = z.infer<typeof zBechAddr>;

export const zHexAddr = z.union([zHexAddr20, zHexAddr32]);
export type HexAddr = z.infer<typeof zHexAddr>;

export const zAddr20 = z.union([zBechAddr20, zHexAddr20]);
export type Addr20 = z.infer<typeof zAddr20>;

export const zAddr32 = z.union([zBechAddr32, zHexAddr32]);
export type Addr32 = z.infer<typeof zAddr32>;

export const zAddr = z.union([
  zBechAddr20,
  zBechAddr32,
  zHexAddr20,
  zHexAddr32,
]);
export type Addr = z.infer<typeof zAddr>;

export const zValidatorAddr = z.string().brand("ValidatorAddr");
export type ValidatorAddr = z.infer<typeof zValidatorAddr>;

export const zConsensusAddr = z.string().brand("ConsensusAddr");
export type ConsensusAddr = z.infer<typeof zConsensusAddr>;
