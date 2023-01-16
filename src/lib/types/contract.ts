import type { ContractLocalInfo } from "lib/stores/contract";
import type { ContractAddr, HumanAddr, Option } from "lib/types";

export interface ContractInfo extends ContractLocalInfo {
  instantiated: Date;
  latestUpdator?: string;
  latestUpdated: Date;
}

export interface ContractInstances {
  contractList: Option<ContractLocalInfo[]>;
  count: number;
}

export enum RemarkOperation {
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS",
}

type RemarkType = "governance" | "transaction";

export interface MigrationRemark {
  operation: RemarkOperation;
  type: RemarkType;
  value: string;
}

export interface ContractMigrationHistory {
  codeId: number;
  codeDescription?: string;
  sender: HumanAddr | ContractAddr;
  height: number;
  timestamp: Date;
  remark: MigrationRemark;
}

export enum ProposalStatus {
  DEPOSIT_PERIOD = "DepositPeriod",
  VOTING_PERIOD = "VotingPeriod",
  PASSED = "Passed",
  REJECTED = "Rejected",
  FAILED = "Failed",
  INACTIVE = "Inactive",
}

export enum ProposalType {
  STORE_CODE = "StoreCode",
  INSTANTIATE_CONTRACT = "InstantiateContract",
  MIGRATE_CONTRACT = "MigrateContract",
  UPDATE_ADMIN = "UpdateAdmin",
  CLEAR_ADMIN = "ClearAdmin",
  EXECUTE_CONTRACT = "ExecuteContract",
}

export interface ContractRelatedProposals {
  proposalId: number;
  title: string;
  status: ProposalStatus;
  votingEndTime: Date;
  depositEndTime: Date;
  resolvedHeight: number | null | undefined;
  type: ProposalType;
  proposer: HumanAddr | ContractAddr | undefined;
}
