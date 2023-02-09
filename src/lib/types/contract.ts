import type { ContractLocalInfo } from "lib/stores/contract";
import type { Addr, Option } from "lib/types";

export enum RemarkOperation {
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS",
}

type RemarkType = "governance" | "transaction";

export interface ContractHistoryRemark {
  operation: RemarkOperation;
  type: RemarkType;
  value: string;
}

export interface ContractInfo extends ContractLocalInfo {
  admin: Option<Addr>;
  latestUpdater: Option<Addr>;
  latestUpdated: Option<Date>;
  remark: Option<ContractHistoryRemark>;
}

export interface ContractInstances {
  contractList: Option<ContractLocalInfo[]>;
  count: Option<number>;
}

export interface ContractMigrationHistory {
  codeId: number;
  codeName?: string;
  sender: Addr;
  height: number;
  timestamp: Date;
  remark: ContractHistoryRemark;
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
  SUDO_CONTRACT = "SudoContract",
}

export interface ContractRelatedProposals {
  proposalId: number;
  title: string;
  status: ProposalStatus;
  votingEndTime: Date;
  depositEndTime: Date;
  resolvedHeight: Option<number | null>;
  type: ProposalType;
  proposer: Option<Addr>;
}
