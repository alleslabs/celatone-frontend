import type { ExposedFunction, ModuleAbi } from "./abi";
import type { HexAddr } from "../addrs";
import type { Nullable } from "../common";
import type { Proposal } from "../proposal";

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
