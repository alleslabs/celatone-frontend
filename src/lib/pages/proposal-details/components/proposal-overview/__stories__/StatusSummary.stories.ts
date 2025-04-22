import type { Meta, StoryObj } from "@storybook/react";
import type { ProposalData, ProposalParams, Ratio, Token, U } from "lib/types";

import Big from "big.js";
import dayjs from "dayjs";
import { big, ProposalStatus } from "lib/types";

import { StatusSummary } from "../status-summary";

const meta: Meta<typeof StatusSummary> = {
  component: StatusSummary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusSummary>;

const data: Omit<
  ProposalData,
  | "depositEndTime"
  | "failedReason"
  | "resolvedTimestamp"
  | "status"
  | "votingEndTime"
> = {
  createdHeight: null,
  createdTimestamp: null,
  createdTxHash: null,
  description: "This is a description.",
  finalTallyResult: {
    abstain: Big(0),
    no: Big(0),
    noWithVeto: Big(0),
    totalVotingPower: null,
    yes: Big(0),
  },
  id: 999,
  isExpedited: false,
  messages: null,
  metadata: "metadata",
  proposalDeposits: [],
  proposer: undefined,
  resolvedHeight: null,
  submitTime: dayjs("01 Jan 1970 00:00:00 UTC").toDate(),
  title: "storybook",
  totalDeposit: [
    {
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom",
      isLPToken: false,
      logo: undefined,
      precision: 10,
      price: undefined,
      symbol: "CLTN",
      value: undefined,
    },
  ],
  types: [],
  votingTime: null,
};

const params: ProposalParams = {
  maxDepositPeriod: "",
  minDeposit: [
    {
      amount: big(10000000) as U<Token<Big>>,
      denom: "denom",
      isLPToken: false,
      logo: undefined,
      precision: 10,
      price: undefined,
      symbol: "CLTN",
      value: undefined,
    },
  ],
  minInitialDepositRatio: 0.2,
  quorum: 0.3 as Ratio<number>,
  threshold: 0.5 as Ratio<number>,
  vetoThreshold: 0.3 as Ratio<number>,
  votingPeriod: "",
};

export const DepositPeriod: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().add(2, "days").toDate(),
      failedReason: "",
      resolvedTimestamp: null,
      status: ProposalStatus.DEPOSIT_PERIOD,
      votingEndTime: null,
    },
    votesInfo: {
      abstain: big(0),
      no: big(0),
      noWithVeto: big(0),
      totalVotingPower: big(0),
      yes: big(0),
    },
  },
};

export const VotingPeriodRejectedQuorum: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: null,
      status: ProposalStatus.VOTING_PERIOD,
      votingEndTime: dayjs().utc().add(2, "days").toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(0),
      noWithVeto: big(0),
      totalVotingPower: big(10),
      yes: big(1),
    },
  },
};

export const VotingPeriodRejectedNoWithVeto: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: null,
      status: ProposalStatus.VOTING_PERIOD,
      votingEndTime: dayjs().utc().add(2, "days").toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(1),
      noWithVeto: big(4),
      totalVotingPower: big(10),
      yes: big(1),
    },
  },
};

export const VotingPeriodRejectedNotPassed: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: null,
      status: ProposalStatus.VOTING_PERIOD,
      votingEndTime: dayjs().utc().add(2, "days").toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
      yes: big(2),
    },
  },
};

export const VotingPeriodPassed: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: null,
      status: ProposalStatus.VOTING_PERIOD,
      votingEndTime: dayjs().utc().add(2, "days").toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
      yes: big(3),
    },
  },
};

export const Failed: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason:
        "VM error: status BACKWARD_INCOMPATIBLE_MODULE_UPDATE of type Verification with message Module Update Failure: Public function/struct signature of new module differs from existing module in 0000000000000000000000000000000000000000000000000000000000000001::simple_json",
      resolvedTimestamp: dayjs().utc().toDate(),
      status: ProposalStatus.FAILED,
      votingEndTime: dayjs().utc().toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
      yes: big(2),
    },
  },
};

export const RejectedQuorum: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: dayjs().utc().toDate(),
      status: ProposalStatus.REJECTED,
      votingEndTime: dayjs().utc().toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(0),
      noWithVeto: big(0),
      totalVotingPower: big(10),
      yes: big(1),
    },
  },
};

export const RejectedNoWithVeto: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: dayjs().utc().toDate(),
      status: ProposalStatus.REJECTED,
      votingEndTime: dayjs().utc().toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(1),
      noWithVeto: big(4),
      totalVotingPower: big(10),
      yes: big(1),
    },
  },
};

export const RejectedNotPassed: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: dayjs().utc().toDate(),
      status: ProposalStatus.REJECTED,
      votingEndTime: dayjs().utc().toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
      yes: big(2),
    },
  },
};

export const Passed: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: dayjs().utc().toDate(),
      status: ProposalStatus.PASSED,
      votingEndTime: dayjs().utc().toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
      yes: big(3),
    },
  },
};

export const Cancelled: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: dayjs().utc().toDate(),
      status: ProposalStatus.CANCELLED,
      votingEndTime: dayjs().utc().toDate(),
    },
    votesInfo: {
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
      yes: big(3),
    },
  },
};

export const DepositFailed: Story = {
  args: {
    params,
    proposalData: {
      ...data,
      depositEndTime: dayjs().utc().toDate(),
      failedReason: "",
      resolvedTimestamp: dayjs().utc().toDate(),
      status: ProposalStatus.DEPOSIT_FAILED,
      votingEndTime: null,
    },
    votesInfo: {
      abstain: big(0),
      no: big(0),
      noWithVeto: big(0),
      totalVotingPower: big(0),
      yes: big(0),
    },
  },
};
