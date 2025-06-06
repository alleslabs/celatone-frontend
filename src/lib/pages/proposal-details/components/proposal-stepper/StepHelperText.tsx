import type { ProposalData } from "lib/types";

import { Text } from "@chakra-ui/react";
import { ProposalStatus } from "lib/types";
import { formatUTC } from "lib/utils";
import { isNull } from "lodash";

import { Countdown } from "../proposal-overview/status-summary/Countdown";

interface StepperHelperTextProps {
  proposalData: ProposalData;
  step: number;
}

const StepperHelperTextBody = ({
  proposalData,
  step,
}: StepperHelperTextProps) => {
  // Deposit Period
  if (step === 1) {
    if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
      return "The proposal is rejected as it did not meet the required deposit";

    if (
      proposalData.status === ProposalStatus.CANCELLED &&
      isNull(proposalData.votingTime)
    )
      return `The proposal is cancelled at ${proposalData.resolvedTimestamp ? formatUTC(proposalData.resolvedTimestamp) : "N/A"}`;

    if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
      return (
        <>
          Deposit ends in{" "}
          <Countdown endTime={proposalData.depositEndTime} isString />
        </>
      );

    return `The proposal passed the deposit period at ${proposalData.votingTime ? formatUTC(proposalData.votingTime) : "N/A"}`;
  }

  // Voting Period
  if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
    return "The proposal is rejected as it did not meet the required deposit";

  if (proposalData.status === ProposalStatus.CANCELLED)
    return `The proposal is cancelled during the ${proposalData.votingTime ? "voting" : "deposit"}  period`;

  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return "Proposal proceeds to voting period after meeting deposit requirement";

  if (proposalData.status === ProposalStatus.VOTING_PERIOD)
    return (
      <>
        Voting ends in{" "}
        {proposalData.votingEndTime ? (
          <Countdown endTime={proposalData.votingEndTime} isString />
        ) : (
          "N/A"
        )}
      </>
    );

  return `The proposal ended with the "${proposalData.status.replace(/([A-Z])/g, " $1").trim()}" result`;
};

export const StepperHelperText = (props: StepperHelperTextProps) => (
  <Text color="text.dark" ml={8} textAlign="start" variant="body3">
    <StepperHelperTextBody {...props} />
  </Text>
);
