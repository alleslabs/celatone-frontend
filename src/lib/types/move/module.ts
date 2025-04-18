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
  // NOTE: can also be an ica or a contract
  address: HexAddr;
  moduleName: string;
  abi: string;
  rawBytes: string;
  digest: string;
  upgradePolicy: UpgradePolicy;
  parsedAbi: ModuleAbi;
  viewFunctions: ExposedFunction[];
  executeFunctions: ExposedFunction[];
}

export interface ModuleInfo
  extends Pick<IndexedModule, "address" | "moduleName" | "digest">,
    Partial<Pick<IndexedModule, "viewFunctions" | "executeFunctions">> {
  height?: number;
  latestUpdated?: Date;
  isRepublished?: boolean;
  isVerified?: boolean;
}

export interface ModulePublishInfo {
  recentPublishTransaction: Nullable<string>;
  recentPublishProposal?: Nullable<Pick<Proposal, "id" | "title">>;
  recentPublishBlockHeight: number;
  recentPublishBlockTimestamp: Date;
  isRepublished: boolean;
}

export enum MoveVerifyStatus {
  Verified = "VERIFIED",
  NotVerified = "NOT_VERIFIED",
  Outdated = "OUTDATED",
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
