import type { Coin } from "@cosmjs/amino";
import type Big from "big.js";
import { z } from "zod";

import type {
  BechAddr,
  Nullable,
  Option,
  Ratio,
  TokenWithValue,
  Validator,
} from "lib/types";

export enum ProposalStatus {
  CANCELLED = "Cancelled",
  DEPOSIT_FAILED = "Inactive",
  DEPOSIT_PERIOD = "DepositPeriod",
  FAILED = "Failed",
  PASSED = "Passed",
  REJECTED = "Rejected",
  VOTING_PERIOD = "VotingPeriod",
}
export const zProposalStatus = z.nativeEnum(ProposalStatus);

export enum ProposalTypeCosmos {
  CANCEL_SOFTWARE_UPGRADE = "CancelSoftwareUpgrade",
  COMMNUNITY_POOL_SPEND = "CommunityPoolSpend",
  IBC_CLIENT_UPDATE = "ClientUpdate",
  IBC_UPGRADE = "Upgrade",
  PARAMETER = "ParameterChange",
  SOFTWARE_UPGRADE = "SoftwareUpgrade",
  TEXT = "Text",
}

enum ProposalTypeCosmWasm {
  CLEAR_ADMIN = "ClearAdmin",
  EXECUTE_CONTRACT = "ExecuteContract",
  INSTANTIATE_CONTRACT = "InstantiateContract",
  MIGRATE_CONTRACT = "MigrateContract",
  PIN_CODES = "PinCodes",
  STORE_AND_INSTANTIATE_CONTRACT = "StoreAndInstantiateContract",
  STORE_CODE = "StoreCode",
  SUDO_CONTRACT = "SudoContract",
  UNPIN_CODES = "UnpinCodes",
  UPDATE_ADMIN = "UpdateAdmin",
  UPDATE_INSTANTIATE_CONFIG = "UpdateInstantiateConfig",
}

enum ProposalTypeOsmosis {
  REMOVE_SUPERFLUID_ASSETS = "RemoveSuperfluidAssets",
  REPLACE_POOL_INCENTIVES = "ReplacePoolIncentives",
  SET_PROTOREV_ADMIN_ACCOUNT = "SetProtoRevAdminAccount",
  SET_PROTOREV_ENABLED = "SetProtoRevEnabled",
  SET_SUPERFLUID_ASSETS = "SetSuperfluidAssets",
  UPDATE_FEE_TOKEN = "UpdateFeeToken",
  UPDATE_POOL_INCENTIVES = "UpdatePoolIncentives",
  UPDATE_UNPOOL_WHITELIST = "UpdateUnpoolWhiteList",
}

export const zProposalType = z.union([
  z.nativeEnum(ProposalTypeCosmos),
  z.nativeEnum(ProposalTypeCosmWasm),
  z.nativeEnum(ProposalTypeOsmosis),
  // Msg types e.g. /cosmos.distribution.v1beta1.MsgCommunityPoolSpend
  z.string(),
]);
export enum ProposalVoteType {
  ABSTAIN = "abstain",
  ALL = "all",
  DID_NOT_VOTE = "did_not_vote", // only for validator votes
  NO = "no",
  NO_WITH_VETO = "no_with_veto",
  WEIGHTED = "weighted",
  YES = "yes",
}

export interface Proposal {
  depositEndTime: Date;
  id: number;
  isExpedited: boolean;
  proposer: Option<BechAddr>;
  resolvedHeight: Nullable<number>;
  status: ProposalStatus;
  title: string;
  types: ProposalType[];
  votingEndTime: Nullable<Date>;
}

export interface ProposalData<T extends Coin | TokenWithValue = TokenWithValue>
  extends Proposal {
  createdHeight: Nullable<number>;
  createdTimestamp: Nullable<Date>;
  createdTxHash: Nullable<string>;
  description: string;
  failedReason: string;
  finalTallyResult: ProposalVotesInfo;
  messages: Nullable<Message[]>;
  metadata: string;
  proposalDeposits: ProposalDeposit<T>[];
  resolvedTimestamp: Nullable<Date>;
  submitTime: Date;
  totalDeposit: T[];
  votingTime: Nullable<Date>;
}

export interface ProposalDeposit<
  T extends Coin | TokenWithValue = TokenWithValue,
> {
  amount: T[];
  depositor: BechAddr;
  timestamp?: Date;
  txHash?: string;
}

export interface ProposalParams<
  T extends Coin | TokenWithValue = TokenWithValue,
> {
  // emergency - only in initia
  emergencyMinDeposit?: T[];
  emergencyTallyInterval?: string;
  expeditedMinDeposit?: T[];
  expeditedQuorum?: Ratio<number>; // only in sei
  expeditedThreshold?: Ratio<number>;
  // expedited
  expeditedVotingPeriod?: string;
  maxDepositPeriod: string;
  minDeposit: T[];
  minInitialDepositRatio: number;
  quorum: Ratio<number>;
  threshold: Ratio<number>;
  vetoThreshold: Ratio<number>;
  votingPeriod: string;
}

export type ProposalType = z.infer<typeof zProposalType>;

export interface ProposalValidatorVote extends ProposalVote {
  rank: number;
}

export interface ProposalVote {
  abstain: number;
  isVoteWeighted: boolean;
  no: number;
  noWithVeto: number;
  proposalId: number;
  timestamp: Nullable<Date>;
  txHash: Nullable<string>;
  validator: Nullable<Validator>;
  voter: Nullable<BechAddr>;
  yes: number;
}

export interface ProposalVotesInfo {
  abstain: Big;
  no: Big;
  noWithVeto: Big;
  totalVotingPower: Nullable<Big>;
  yes: Big;
}

// TODO: combine with MsgBody in services/tx.ts
interface Message {
  "@type": string;
  [key: string]: unknown;
}
