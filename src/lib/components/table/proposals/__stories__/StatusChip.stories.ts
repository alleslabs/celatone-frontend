import type { Meta, StoryObj } from "@storybook/react";

import { StatusChip } from "../StatusChip";
import { ProposalStatus } from "lib/types";

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
    isTransparent: true,
    status: ProposalStatus.DEPOSIT_PERIOD,
  },
};

export const FilterChip: Story = {
  args: {
    hasCloseBtn: true,
    status: ProposalStatus.DEPOSIT_PERIOD,
  },
};
