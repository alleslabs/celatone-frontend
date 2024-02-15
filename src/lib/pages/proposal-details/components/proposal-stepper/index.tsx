import { Flex, Spacer, Text } from "@chakra-ui/react";

import { ProgressBadge } from "../ProgressBadge";
import type { ProposalData } from "lib/types";

import { StepperHelperText } from "./StepHelperText";
import { StepIcon } from "./StepIcon";
import { getProgressBadgeProps } from "./utils";

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
  <Flex direction="column" gap={1} w="full" align="start">
    <Flex w="full" gap={2} alignItems="center">
      <StepIcon step={step} proposalData={proposalData} />
      <Text variant="body1" fontWeight={700} textAlign="start">
        {step === 1 ? "Deposit Period" : "Voting Period"}
      </Text>
      <Spacer />
      <ProgressBadge {...getProgressBadgeProps(step, proposalData)} />
    </Flex>
    {!isOverview && (
      <StepperHelperText step={step} proposalData={proposalData} />
    )}
  </Flex>
);
