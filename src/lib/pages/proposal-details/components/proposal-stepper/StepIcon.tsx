import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { ProposalData } from "lib/types";
import { ProposalStatus } from "lib/types";

import type { ProposalStepperProps } from ".";

enum StepIconState {
  ONGOING,
  FAILED,
  COMPLETE,
}

const getStepIconState = (step: number, proposalData: ProposalData) => {
  // Deposit Period
  if (step === 1) {
    if (
      proposalData.status === ProposalStatus.DEPOSIT_FAILED ||
      (proposalData.status === ProposalStatus.CANCELLED &&
        proposalData.votingEndTime === null)
    )
      return StepIconState.FAILED;

    if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
      return StepIconState.ONGOING;

    return StepIconState.COMPLETE;
  }

  // Voting Period
  if (
    proposalData.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposalData.status === ProposalStatus.DEPOSIT_FAILED ||
    proposalData.status === ProposalStatus.CANCELLED
  )
    return StepIconState.FAILED;

  if (proposalData.status === ProposalStatus.VOTING_PERIOD)
    return StepIconState.ONGOING;

  return StepIconState.COMPLETE;
};

export const StepIcon = ({ step, proposalData }: ProposalStepperProps) => {
  const state = getStepIconState(step, proposalData);
  const isFailed = state === StepIconState.FAILED;
  return (
    <Flex
      boxSize={6}
      borderRadius="50%"
      alignItems="center"
      justifyContent="center"
      background={isFailed ? "gray.500" : "primary.main"}
    >
      {state !== StepIconState.COMPLETE ? (
        <Text
          variant="body3"
          fontWeight={700}
          color={isFailed ? "background.main" : "text.main"}
        >
          {step}
        </Text>
      ) : (
        <CustomIcon name="check" boxSize={3} />
      )}
    </Flex>
  );
};
