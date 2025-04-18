import type { ProposalData } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { PeriodState } from "lib/pages/proposal-details/types";
import { ProposalStatus } from "lib/types";
import { isNull } from "lodash";

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

export const StepIcon = ({ proposalData, step }: ProposalStepperProps) => {
  const state = getStepIconState(step, proposalData);
  const isGray = state === PeriodState.WAITING || state === PeriodState.FAILED;
  return (
    <Flex
      alignItems="center"
      background={isGray ? "stepper.disabled.bg" : "stepper.active.bg"}
      borderRadius="50%"
      boxSize={6}
      justifyContent="center"
    >
      {state !== PeriodState.COMPLETE ? (
        <Text
          color={isGray ? "stepper.disabled.color" : "stepper.active.color"}
          fontWeight={700}
          variant="body3"
        >
          {step}
        </Text>
      ) : (
        <CustomIcon
          boxSize={3}
          color={isGray ? "stepper.disabled.color" : "stepper.active.color"}
          name="check"
        />
      )}
    </Flex>
  );
};
