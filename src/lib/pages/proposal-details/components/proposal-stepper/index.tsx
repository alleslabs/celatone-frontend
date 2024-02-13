import { Flex, Spacer, Text } from "@chakra-ui/react";

import { ProgressBadge } from "../ProgressBadge";
import type { ProposalData } from "lib/types";

import { StepIcon } from "./StepIcon";
import { getProgressBadgeProps, getStepperDescription } from "./utils";

export interface ProposalStepperProps {
  step: number;
  proposalData: ProposalData;
  isOverview?: boolean;
}

export const ProposalStepper = ({
  step,
  proposalData,
  isOverview = false,
}: ProposalStepperProps) => (
  <Flex direction="column" gap={1}>
    <Flex w="full" gap={2} alignItems="center">
      <StepIcon step={step} proposalData={proposalData} />
      <Text variant="body1" fontWeight={700}>
        {step === 1 ? "Deposit Period" : "Voting Period"}
      </Text>
      <Spacer />
      <ProgressBadge {...getProgressBadgeProps(step, proposalData)} />
    </Flex>
    {!isOverview && (
      <Text variant="body3" color="text.dark" ml={8}>
        {getStepperDescription()}
      </Text>
    )}
  </Flex>
);
