import type { ProposalData } from "lib/types";

import { Flex, Spacer, Text } from "@chakra-ui/react";

import { ProgressBadge } from "../ProgressBadge";
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
  <Flex align="start" direction="column" gap={1} w="full">
    <Flex alignItems="center" gap={2} w="full">
      <StepIcon proposalData={proposalData} step={step} />
      <Text fontWeight={700} textAlign="start" variant="body1">
        {step === 1 ? "Deposit period" : "Voting period"}
      </Text>
      <Spacer />
      <ProgressBadge {...getProgressBadgeProps(step, proposalData)} />
    </Flex>
    {!isOverview && (
      <StepperHelperText proposalData={proposalData} step={step} />
    )}
  </Flex>
);
