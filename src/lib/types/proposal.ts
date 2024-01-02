import { z } from "zod";

import type { BechAddr, Nullable, Option } from "lib/types";

export enum ProposalStatus {
  DEPOSIT_PERIOD = "DepositPeriod",
  VOTING_PERIOD = "VotingPeriod",
  PASSED = "Passed",
  REJECTED = "Rejected",
  FAILED = "Failed",
  DEPOSIT_FAILED = "DepositFailed",
}

export enum ProposalTypeCosmos {
  TEXT = "Text",
  PARAMETER = "ParameterChange",
  COMMNUNITY_POOL_SPEND = "CommunityPoolSpend",
  SOFTWARE_UPGRADE = "SoftwareUpgrade",
  CANCEL_SOFTWARE_UPGRADE = "CancelSoftwareUpgrade",
  IBC_CLIENT_UPDATE = "ClientUpdate",
  IBC_UPGRADE = "Upgrade",
}

enum ProposalTypeCosmWasm {
  STORE_CODE = "StoreCode",
  INSTANTIATE_CONTRACT = "InstantiateContract",
  MIGRATE_CONTRACT = "MigrateContract",
  UPDATE_ADMIN = "UpdateAdmin",
  CLEAR_ADMIN = "ClearAdmin",
  EXECUTE_CONTRACT = "ExecuteContract",
  SUDO_CONTRACT = "SudoContract",
  PIN_CODES = "PinCodes",
  UNPIN_CODES = "UnpinCodes",
  UPDATE_INSTANTIATE_CONFIG = "UpdateInstantiateConfig",
  STORE_AND_INSTANTIATE_CONTRACT = "StoreAndInstantiateContract",
}

enum ProposalTypeOsmosis {
  UPDATE_POOL_INCENTIVES = "UpdatePoolIncentives",
  REPLACE_POOL_INCENTIVES = "ReplacePoolIncentives",
  SET_SUPERFLUID_ASSETS = "SetSuperfluidAssets",
  REMOVE_SUPERFLUID_ASSETS = "RemoveSuperfluidAssets",
  UPDATE_UNPOOL_WHITELIST = "UpdateUnpoolWhiteList",
  UPDATE_FEE_TOKEN = "UpdateFeeToken",
  SET_PROTOREV_ENABLED = "SetProtoRevEnabled",
  SET_PROTOREV_ADMIN_ACCOUNT = "SetProtoRevAdminAccount",
}

export const zProposalType = z.union([
  z.nativeEnum(ProposalTypeCosmos),
  z.nativeEnum(ProposalTypeCosmWasm),
  z.nativeEnum(ProposalTypeOsmosis),
]);
export type ProposalType = z.infer<typeof zProposalType>;

export interface Proposal {
  proposalId: number;
  title: string;
  status: ProposalStatus;
  votingEndTime: Date;
  depositEndTime: Date;
  resolvedHeight: Option<Nullable<number>>;
  type: ProposalType;
  proposer: Option<BechAddr>;
  isExpedited: boolean;
}
