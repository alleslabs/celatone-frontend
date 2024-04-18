import { Flex, Text } from "@chakra-ui/react";
import { isNull } from "lodash";

import { CustomIcon } from "lib/components/icon";
import { PeriodState } from "lib/pages/proposal-details/types";
import type { ProposalData } from "lib/types";
import { ProposalStatus } from "lib/types";

import type { ProposalStepperProps } from ".";

const getStepIconState = (step: number, proposalData: ProposalData) => {
  // Deposit Period
  if (step === 1) {
    if (
      proposalData.status === ProposalStatus.DEPOSIT_FAILED ||
      (proposalData.status === ProposalStatus.CANCELLED &&
        isNull(proposalData.votingTime))
    )
      return PeriodState.FAILED;

    if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
      return PeriodState.ONGOING;

    return PeriodState.COMPLETE;
  }

  // Voting Period
  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return PeriodState.WAITING;
  if (
    proposalData.status === ProposalStatus.DEPOSIT_FAILED ||
    proposalData.status === ProposalStatus.CANCELLED
  )
    return PeriodState.FAILED;

  if (proposalData.status === ProposalStatus.VOTING_PERIOD)
    return PeriodState.ONGOING;

  return PeriodState.COMPLETE;
};

export const StepIcon = ({ step, proposalData }: ProposalStepperProps) => {
  const state = getStepIconState(step, proposalData);
  const isGray = state === PeriodState.WAITING || state === PeriodState.FAILED;
  return (
    <Flex
      boxSize={6}
      borderRadius="50%"
      alignItems="center"
      justifyContent="center"
      background={isGray ? "gray.500" : "primary.main"}
    >
      {state !== PeriodState.COMPLETE ? (
        <Text
          variant="body3"
          fontWeight={700}
          color={isGray ? "background.main" : "text.main"}
        >
          {step}
        </Text>
      ) : (
        <CustomIcon name="check" boxSize={3} />
      )}
    </Flex>
  );
};
