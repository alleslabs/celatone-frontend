import type { Coin } from "@cosmjs/amino";
import type Big from "big.js";
import type {
  BechAddr,
  Nullable,
  Option,
  Ratio,
  TokenWithValue,
  Validator,
} from "lib/types";

import { z } from "zod";

export enum ProposalStatus {
  DEPOSIT_PERIOD = "DepositPeriod",
  VOTING_PERIOD = "VotingPeriod",
  PASSED = "Passed",
  REJECTED = "Rejected",
  FAILED = "Failed",
  DEPOSIT_FAILED = "Inactive",
  CANCELLED = "Cancelled",
}
export const zProposalStatus = z.nativeEnum(ProposalStatus);

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
  // Msg types e.g. /cosmos.distribution.v1beta1.MsgCommunityPoolSpend
  z.string(),
]);
export type ProposalType = z.infer<typeof zProposalType>;

export interface Proposal {
  id: number;
  title: string;
  status: ProposalStatus;
  votingEndTime: Nullable<Date>;
  depositEndTime: Date;
  resolvedHeight: Nullable<number>;
  types: ProposalType[];
  proposer: Option<BechAddr>;
  isExpedited: boolean;
}

export interface ProposalParams<
  T extends Coin | TokenWithValue = TokenWithValue,
> {
  minDeposit: T[];
  minInitialDepositRatio: number;
  maxDepositPeriod: string;
  votingPeriod: string;
  vetoThreshold: Ratio<number>;
  quorum: Ratio<number>;
  threshold: Ratio<number>;
  // expedited
  expeditedVotingPeriod?: string;
  expeditedThreshold?: Ratio<number>;
  expeditedMinDeposit?: T[];
  expeditedQuorum?: Ratio<number>; // only in sei
  // emergency - only in initia
  emergencyMinDeposit?: T[];
  emergencyTallyInterval?: string;
}

export interface ProposalDeposit<
  T extends Coin | TokenWithValue = TokenWithValue,
> {
  amount: T[];
  depositor: BechAddr;
  timestamp?: Date;
  txHash?: string;
}

// TODO: combine with MsgBody in services/tx.ts
interface Message {
  "@type": string;
  [key: string]: unknown;
}

export interface ProposalVotesInfo {
  yes: Big;
  abstain: Big;
  no: Big;
  noWithVeto: Big;
  totalVotingPower: Nullable<Big>;
}

export interface ProposalData<T extends Coin | TokenWithValue = TokenWithValue>
  extends Proposal {
  failedReason: string;
  createdHeight: Nullable<number>;
  createdTimestamp: Nullable<Date>;
  createdTxHash: Nullable<string>;
  description: string;
  messages: Nullable<Message[]>;
  metadata: string;
  proposalDeposits: ProposalDeposit<T>[];
  resolvedTimestamp: Nullable<Date>;
  submitTime: Date;
  totalDeposit: T[];
  votingTime: Nullable<Date>;
  finalTallyResult: ProposalVotesInfo;
}

export interface ProposalVote {
  proposalId: number;
  abstain: number;
  no: number;
  noWithVeto: number;
  yes: number;
  isVoteWeighted: boolean;
  validator: Nullable<Validator>;
  voter: Nullable<BechAddr>;
  timestamp: Nullable<Date>;
  txHash: Nullable<string>;
}

export interface ProposalValidatorVote extends ProposalVote {
  rank: number;
}

export enum ProposalVoteType {
  ALL = "all",
  YES = "yes",
  NO = "no",
  NO_WITH_VETO = "no_with_veto",
  ABSTAIN = "abstain",
  WEIGHTED = "weighted",
  DID_NOT_VOTE = "did_not_vote", // only for validator votes
}
