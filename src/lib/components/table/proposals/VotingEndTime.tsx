import { Flex, Text } from "@chakra-ui/react";

import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

export const VotingEndTime = ({
  votingEndTime,
  depositEndTime,
  status,
}: {
  votingEndTime: Proposal["votingEndTime"];
  depositEndTime: Proposal["depositEndTime"];
  status: Proposal["status"];
}) => {
  if (status === ProposalStatus.DEPOSIT_FAILED) {
    return <Text color="text.dark">N/A</Text>;
  }

  const isDepositPeriod = status === ProposalStatus.DEPOSIT_PERIOD;
  return (
    <Flex
      direction="column"
      sx={{
        "& > p:first-of-type": {
          color: isDepositPeriod ? "text.dark" : "text.main",
          mb: "2px",
        },
        "& > p:last-of-type": {
          color: "text.dark",
          fontSize: "12px",
        },
      }}
      onClick={(e) => e.stopPropagation()}
      cursor="initial"
    >
      <Text variant={{ base: "body3", md: "body2" }}>
        {isDepositPeriod ? "Voting not started" : formatUTC(votingEndTime)}
      </Text>
      <Text variant={{ base: "body3", md: "body2" }}>
        (
        {isDepositPeriod
          ? `Deposit Period ends ${dateFromNow(depositEndTime)}`
          : dateFromNow(votingEndTime)}
        )
      </Text>
    </Flex>
  );
};
