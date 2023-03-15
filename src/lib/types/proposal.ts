import type { Addr, Option } from "lib/types";

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

export interface Proposal {
  proposalId: number;
  title: string;
  status: ProposalStatus;
  votingEndTime: Date;
  depositEndTime: Date;
  resolvedHeight: Option<number | null>;
  type: ProposalType;
  proposer: Option<Addr>;
}
