import type { HexAddr } from "../addrs";
import type { Nullable } from "../common";
import type { Proposal } from "../proposal";

import type { ExposedFunction, ModuleAbi } from "./abi";

export enum MoveVerifyStatus {
  NotVerified = "NOT_VERIFIED",
  Outdated = "OUTDATED",
  Verified = "VERIFIED",
}

export enum UpgradePolicy {
  COMPATIBLE = "COMPATIBLE",
  IMMUTABLE = "IMMUTABLE",
  UNSPECIFIED = "UNSPECIFIED",
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
