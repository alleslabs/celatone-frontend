import type { Meta, StoryObj } from "@storybook/react";

import { ProposalStatus } from "lib/types";

import { StatusChip } from "../StatusChip";

const meta: Meta<typeof StatusChip> = {
  component: StatusChip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusChip>;

export const NormalChip: Story = {
  args: {
    status: ProposalStatus.DEPOSIT_PERIOD,
  },
};

export const TransparentChip: Story = {
  args: {
    status: ProposalStatus.DEPOSIT_PERIOD,
    isTransparent: true,
  },
};

export const FilterChip: Story = {
  args: {
    status: ProposalStatus.DEPOSIT_PERIOD,
    hasCloseBtn: true,
  },
};
