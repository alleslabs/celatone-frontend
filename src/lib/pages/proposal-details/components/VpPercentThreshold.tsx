import { Flex, Text } from "@chakra-ui/react";

import { normalizeVotesInfo } from "../utils";
import { CustomIcon } from "lib/components/icon";
import type { ProposalVotesInfo } from "lib/types";
import { d0Formatter, divWithDefault, formatPrettyPercent } from "lib/utils";

interface VpPercentThresholdProps {
  votesInfo: ProposalVotesInfo;
  isCompact: boolean;
}

export const VpPercentThreshold = ({
  votesInfo,
  isCompact,
}: VpPercentThresholdProps) => {
  const { yes, no, noWithVeto, nonAbstainVotes } =
    normalizeVotesInfo(votesInfo);

  const options = [
    {
      option: "Yes",
      color: "success.main",
      percent: formatPrettyPercent(
        divWithDefault(yes, nonAbstainVotes, 0).toNumber(),
        2,
        true
      ),
      votingPower: d0Formatter(votesInfo.yes, "0"),
    },
    {
      option: "No",
      color: "error.main",
      percent: formatPrettyPercent(
        divWithDefault(no, nonAbstainVotes, 0).toNumber(),
        2,
        true
      ),
      votingPower: d0Formatter(votesInfo.no, "0"),
    },
    {
      option: "No with veto",
      color: "error.dark",
      percent: formatPrettyPercent(
        divWithDefault(noWithVeto, nonAbstainVotes, 0).toNumber(),
        2,
        true
      ),
      votingPower: d0Formatter(votesInfo.noWithVeto, "0"),
    },
  ];

  return isCompact ? (
    <div>
      <Flex justifyContent="space-between">
        <Text variant="body2" color="text.dark" fontWeight={500}>
          Options
        </Text>
        <Text variant="body2" color="text.dark" fontWeight={500}>
          % (Voting Power)
        </Text>
      </Flex>
      {options.map(({ option, color, percent, votingPower }) => (
        <Flex
          key={option}
          justifyContent="space-between"
          borderBottom="1px solid"
          borderBottomColor="gray.700"
          py={2}
        >
          <Flex gap={2} alignItems="center">
            <CustomIcon name="circle" boxSize="14px" color={color} />
            <Text variant="body2" color="text.main" fontWeight={700}>
              {option}
            </Text>
          </Flex>
          <Flex direction="column" align="end">
            <Text variant="body2" color="text.main">
              {percent}
            </Text>
            <Text variant="body3" color="text.dark">
              ({votingPower})
            </Text>
          </Flex>
        </Flex>
      ))}
    </div>
  ) : null; // TODO: will handle the vote detail desktop case here using `VpPercentCard`
};
