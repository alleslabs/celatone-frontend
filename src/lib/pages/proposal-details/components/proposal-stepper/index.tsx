import { Flex, Spacer, Text } from "@chakra-ui/react";

import { ProgressBadge } from "../ProgressBadge";
import type { ProposalData } from "lib/types";

import { StepperHelperText } from "./StepHelperText";
import { StepIcon } from "./StepIcon";
import { getProgressBadgeProps } from "./utils";

export interface ProposalStepperProps {
  isOverview?: boolean;
  proposalData: ProposalData;
  step: number;
}

export const ProposalStepper = ({
  isOverview = false,
  proposalData,
  step,
}: ProposalStepperProps) => (
  <Flex align="start" gap={1} w="full" direction="column">
    <Flex alignItems="center" gap={2} w="full">
      <StepIcon step={step} proposalData={proposalData} />
      <Text textAlign="start" variant="body1" fontWeight={700}>
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
