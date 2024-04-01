import type { Meta, StoryObj } from "@storybook/react";
import type Big from "big.js";
import dayjs from "dayjs";

import { StatusSummary } from "../status-summary";
import { big, ProposalStatus } from "lib/types";
import type { ProposalData, ProposalParams, Ratio, Token, U } from "lib/types";

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
  "status" | "depositEndTime" | "votingEndTime" | "resolvedTimestamp"
> = {
  id: 999,
  title: "storybook",
  resolvedHeight: null,
  types: [],
  proposer: undefined,
  isExpedited: false,
  createdHeight: null,
  createdTimestamp: null,
  createdTxHash: null,
  description: "This is a description.",
  messages: null,
  metadata: "metadata",
  proposalDeposits: [],
  submitTime: dayjs("01 Jan 1970 00:00:00 UTC").toDate(),
  totalDeposit: [
    {
      isLPToken: false,
      denom: "denom",
      amount: big(1000000) as U<Token<Big>>,
      precision: 10,
      symbol: "CLTN",
      logo: undefined,
      price: undefined,
      value: undefined,
    },
  ],
  version: "v1",
  votingTime: null,
};

const params: ProposalParams = {
  minDeposit: [
    {
      isLPToken: false,
      denom: "denom",
      amount: big(10000000) as U<Token<Big>>,
      precision: 10,
      symbol: "CLTN",
      logo: undefined,
      price: undefined,
      value: undefined,
    },
  ],
  minInitialDepositRatio: 0.2,
  maxDepositPeriod: "",
  votingPeriod: "",
  vetoThreshold: 0.3 as Ratio<number>,
  quorum: 0.3 as Ratio<number>,
  threshold: 0.5 as Ratio<number>,
};

export const DepositPeriod: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.DEPOSIT_PERIOD,
      depositEndTime: dayjs().utc().add(2, "days").toDate(),
      votingEndTime: null,
      resolvedTimestamp: null,
    },
    params,
    votesInfo: {
      yes: big(0),
      abstain: big(0),
      no: big(0),
      noWithVeto: big(0),
      totalVotingPower: big(0),
    },
  },
};

export const VotingPeriodRejectedQuorum: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.VOTING_PERIOD,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().add(2, "days").toDate(),
      resolvedTimestamp: null,
    },
    params,
    votesInfo: {
      yes: big(1),
      abstain: big(1),
      no: big(0),
      noWithVeto: big(0),
      totalVotingPower: big(10),
    },
  },
};

export const VotingPeriodRejectedNoWithVeto: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.VOTING_PERIOD,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().add(2, "days").toDate(),
      resolvedTimestamp: null,
    },
    params,
    votesInfo: {
      yes: big(1),
      abstain: big(1),
      no: big(1),
      noWithVeto: big(4),
      totalVotingPower: big(10),
    },
  },
};

export const VotingPeriodRejectedNotPassed: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.VOTING_PERIOD,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().add(2, "days").toDate(),
      resolvedTimestamp: null,
    },
    params,
    votesInfo: {
      yes: big(2),
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
    },
  },
};

export const VotingPeriodPassed: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.VOTING_PERIOD,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().add(2, "days").toDate(),
      resolvedTimestamp: null,
    },
    params,
    votesInfo: {
      yes: big(3),
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
    },
  },
};

export const Failed: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.FAILED,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().toDate(),
      resolvedTimestamp: dayjs().utc().toDate(),
    },
    params,
    votesInfo: {
      yes: big(2),
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
    },
  },
};

export const RejectedQuorum: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.REJECTED,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().toDate(),
      resolvedTimestamp: dayjs().utc().toDate(),
    },
    params,
    votesInfo: {
      yes: big(1),
      abstain: big(1),
      no: big(0),
      noWithVeto: big(0),
      totalVotingPower: big(10),
    },
  },
};

export const RejectedNoWithVeto: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.REJECTED,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().toDate(),
      resolvedTimestamp: dayjs().utc().toDate(),
    },
    params,
    votesInfo: {
      yes: big(1),
      abstain: big(1),
      no: big(1),
      noWithVeto: big(4),
      totalVotingPower: big(10),
    },
  },
};

export const RejectedNotPassed: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.REJECTED,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().toDate(),
      resolvedTimestamp: dayjs().utc().toDate(),
    },
    params,
    votesInfo: {
      yes: big(2),
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
    },
  },
};

export const Passed: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.PASSED,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().toDate(),
      resolvedTimestamp: dayjs().utc().toDate(),
    },
    params,
    votesInfo: {
      yes: big(3),
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
    },
  },
};

export const Cancelled: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.CANCELLED,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: dayjs().utc().toDate(),
      resolvedTimestamp: dayjs().utc().toDate(),
    },
    params,
    votesInfo: {
      yes: big(3),
      abstain: big(1),
      no: big(1),
      noWithVeto: big(1),
      totalVotingPower: big(10),
    },
  },
};

export const DepositFailed: Story = {
  args: {
    proposalData: {
      ...data,
      status: ProposalStatus.DEPOSIT_FAILED,
      depositEndTime: dayjs().utc().toDate(),
      votingEndTime: null,
      resolvedTimestamp: dayjs().utc().toDate(),
    },
    params,
    votesInfo: {
      yes: big(0),
      abstain: big(0),
      no: big(0),
      noWithVeto: big(0),
      totalVotingPower: big(0),
    },
  },
};
