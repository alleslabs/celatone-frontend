import type { Meta, StoryObj } from "@storybook/react";

import { ProposalInfo } from "../ProposalInfo";
import type { BechAddr } from "lib/types";
import { ProposalStatus } from "lib/types";

const meta: Meta<typeof ProposalInfo> = {
  component: ProposalInfo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProposalInfo>;

export const DEPOSIT_PERIOD: Story = {
  args: {
    data: {
      status: ProposalStatus.DEPOSIT_PERIOD,
      createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
      proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
      depositStart: new Date(),
      depositEnd: new Date(),
    },
  },
};

export const DEPOSIT_FAILED: Story = {
  args: {
    data: {
      status: ProposalStatus.DEPOSIT_FAILED,
      createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
      proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
      resolvedHeight: 123456,
      resolvedDate: new Date(),
    },
  },
};

export const VOTING_PERIOD: Story = {
  args: {
    data: {
      status: ProposalStatus.VOTING_PERIOD,
      createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
      proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
      voteStart: new Date(),
      voteEnd: new Date(),
    },
  },
};

export const PASSED: Story = {
  args: {
    data: {
      status: ProposalStatus.PASSED,
      createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
      proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
      resolvedHeight: 123456,
      resolvedDate: new Date(),
    },
  },
};

export const REJECTED: Story = {
  args: {
    data: {
      status: ProposalStatus.REJECTED,
      createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
      proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
      resolvedHeight: 123456,
      resolvedDate: new Date(),
    },
  },
};

export const FAILED: Story = {
  args: {
    data: {
      status: ProposalStatus.FAILED,
      createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
      proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
      resolvedHeight: 123456,
      resolvedDate: new Date(),
    },
  },
};
