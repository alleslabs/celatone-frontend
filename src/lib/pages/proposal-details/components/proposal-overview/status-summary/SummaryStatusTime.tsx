import { Text } from "@chakra-ui/react";

import type { ProposalData } from "lib/types";
import { ProposalStatus } from "lib/types";
import { formatUTC } from "lib/utils";

import { Countdown } from "./Countdown";

interface StatusTimeProps {
  proposalData: ProposalData;
}

const getResolvedPrefix = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.DEPOSIT_FAILED:
      return "Failed on";
    case ProposalStatus.CANCELLED:
      return "Cancelled on";
    default:
      return "Voting ended on";
  }
};

export const SummaryStatusTime = ({ proposalData }: StatusTimeProps) => {
  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return (
      <Text variant="body2">
        Deposit ends in <Countdown endTime={proposalData.depositEndTime} />
      </Text>
    );

  if (proposalData.status === ProposalStatus.VOTING_PERIOD)
    return (
      <Text variant="body2">
        Voting ends in{" "}
        {proposalData.votingEndTime ? (
          <Countdown endTime={proposalData.votingEndTime} />
        ) : (
          "N/A"
        )}
      </Text>
    );

  return (
    <Text variant="body2" color="text.dark">
      {getResolvedPrefix(proposalData.status)}{" "}
      {proposalData.resolvedTimestamp
        ? formatUTC(proposalData.resolvedTimestamp)
        : "N/A"}
    </Text>
  );
};
