import type { HexAddr } from "../addrs";
import type { Nullable } from "../common";
import type { Proposal } from "../proposal";

import type { ExposedFunction, InternalModule, ResponseABI } from "./abi";

export interface IndexedModule extends InternalModule {
  // NOTE: can also be an ica or a contract
  address: HexAddr;
  parsedAbi: ResponseABI;
  viewFunctions: ExposedFunction[];
  executeFunctions: ExposedFunction[];
}

export interface ModuleInfo
  extends Pick<IndexedModule, "address" | "moduleName">,
    Partial<Pick<IndexedModule, "viewFunctions" | "executeFunctions">> {
  height?: number;
  latestUpdated?: Date;
  isRepublished?: boolean;
  isVerified?: boolean;
}

export interface ModuleData extends IndexedModule {
  recentPublishTransaction: Nullable<string>;
  recentPublishProposal: Nullable<Pick<Proposal, "id" | "title">>;
  recentPublishBlockHeight: number;
  recentPublishBlockTimestamp: Date;
  isRepublished: boolean;
}
