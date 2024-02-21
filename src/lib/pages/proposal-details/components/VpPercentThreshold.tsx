import { Divider, Flex, Text } from "@chakra-ui/react";
import { Fragment } from "react";

import { normalizeVotesInfo } from "../utils";
import { CustomIcon } from "lib/components/icon";
import type { ProposalVotesInfo } from "lib/types";
import { d0Formatter, divWithDefault, formatPrettyPercent } from "lib/utils";

import { VpPercentCard } from "./VpPercentCard";

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
      ratio: divWithDefault(yes, nonAbstainVotes, 0),
      votingPower: votesInfo.yes,
      color: "success.main",
    },
    {
      option: "No",
      ratio: divWithDefault(no, nonAbstainVotes, 0),
      votingPower: votesInfo.no,
      color: "error.main",
    },
    {
      option: "No with veto",
      ratio: divWithDefault(noWithVeto, nonAbstainVotes, 0),
      votingPower: votesInfo.noWithVeto,
      color: "error.dark",
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
      {options.map(({ option, ratio, votingPower, color }) => (
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
              {formatPrettyPercent(ratio.toNumber(), 2, true)}
            </Text>
            <Text variant="body3" color="text.dark">
              ({d0Formatter(votingPower, "0")})
            </Text>
          </Flex>
        </Flex>
      ))}
    </div>
  ) : (
    <Flex direction="row" gap={6}>
      {options.map(({ option, ratio, votingPower, color }, idx) => (
        <Fragment key={option}>
          <VpPercentCard
            name={option}
            ratio={ratio}
            power={votingPower}
            color={color}
            isCompact={false}
          />
          {idx === 0 && (
            <Divider
              orientation="vertical"
              h="auto"
              color="gray.700"
              display={{ base: "none", lg: "flex" }}
            />
          )}
        </Fragment>
      ))}
    </Flex>
  );
};
