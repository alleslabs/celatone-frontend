// TODO -  Revisit type later to prevent dependency cycling
import type { ContractCw2Info, InstantiateInfo } from "lib/services/contract";
import type { CodeLocalInfo } from "lib/stores/code";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  Addr,
  BalanceWithAssetInfo,
  Option,
  PublicDetail,
  PublicInfo,
} from "lib/types";

export enum RemarkOperation {
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS",
}

type RemarkType = "governance" | "transaction";

export interface ContractHistoryRemark {
  operation: RemarkOperation;
  type: RemarkType;
  value: string | number;
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

export interface ContractData {
  chainId: string;
  codeInfo: Option<CodeLocalInfo>;
  contractLocalInfo: Option<ContractLocalInfo>;
  contractCw2Info: Option<ContractCw2Info>;
  instantiateInfo: Option<InstantiateInfo>;
  publicProject: {
    publicInfo: Option<PublicInfo>;
    publicDetail: Option<PublicDetail>;
  };
  balances: Option<BalanceWithAssetInfo[]>;
  initMsg: Option<string>;
  initTxHash: Option<string>;
  initProposalId: Option<number>;
  initProposalTitle: Option<string>;
}
