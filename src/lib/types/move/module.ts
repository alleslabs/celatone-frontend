import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { z } from "zod";

import type { HexAddr } from "../addrs";
import type { Nullable } from "../common";
import type { Proposal } from "../proposal";
import type { ExposedFunction, ModuleAbi } from "./abi";

export enum UpgradePolicy {
  UNSPECIFIED = "UNSPECIFIED",
  COMPATIBLE = "COMPATIBLE",
  IMMUTABLE = "IMMUTABLE",
}

export interface IndexedModule {
  abi: string;
  // NOTE: can also be an ica or a contract
  address: HexAddr;
  digest: string;
  executeFunctions: ExposedFunction[];
  moduleName: string;
  parsedAbi: ModuleAbi;
  rawBytes: string;
  upgradePolicy: UpgradePolicy;
  viewFunctions: ExposedFunction[];
}

export interface ModuleInfo
  extends Partial<Pick<IndexedModule, "executeFunctions" | "viewFunctions">>,
    Pick<IndexedModule, "address" | "digest" | "moduleName"> {
  height?: number;
  isRepublished?: boolean;
  isVerified?: boolean;
  latestUpdated?: Date;
}

export interface ModulePublishInfo {
  isRepublished: boolean;
  recentPublishBlockHeight: number;
  recentPublishBlockTimestamp: Date;
  recentPublishProposal?: Nullable<Pick<Proposal, "id" | "title">>;
  recentPublishTransaction: Nullable<string>;
}

export enum MoveVerifyStatus {
  NotVerified = "NOT_VERIFIED",
  Outdated = "OUTDATED",
  Verified = "VERIFIED",
}

export const zMoveVerifyConfig = z
  .object({
    default_bytecode_version: z.number(),
    default_compiler_version: z.string(),
    default_language_version: z.string(),
    enable_bytecode_versions: z.array(z.number()),
    enable_compiler_versions: z.array(z.string()),
    enable_language_versions: z.array(z.string()),
  })
  .transform((val) => snakeToCamel(val));
export type MoveVerifyConfig = z.infer<typeof zMoveVerifyConfig>;
