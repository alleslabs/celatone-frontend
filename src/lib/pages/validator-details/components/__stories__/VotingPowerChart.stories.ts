import type { Meta, StoryObj } from "@storybook/react";

import { VotingPowerChart } from "../bonded-token-changes/VotingPowerChart";

const meta: Meta<typeof VotingPowerChart> = {
  component: VotingPowerChart,
  parameters: {
    //
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VotingPowerChart>;

export const DefaultVotingPowerChart: Story = {
  args: {},
};
