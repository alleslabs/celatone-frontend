import { Divider, Flex, Text } from "@chakra-ui/react";
import { Fragment } from "react";

import { normalizeVotesInfo } from "../utils";
import { LegendText } from "lib/components/LegendText";
import type { ProposalVotesInfo } from "lib/types";
import { d0Formatter, formatPrettyPercent } from "lib/utils";

import { VpPercentCard } from "./VpPercentCard";

interface VpPercentThresholdProps {
  isCompact: boolean;
  votesInfo: ProposalVotesInfo;
}

export const VpPercentThreshold = ({
  isCompact,
  votesInfo,
}: VpPercentThresholdProps) => {
  const { noNonRatio, noWithVetoNonRatio, yesNonRatio } =
    normalizeVotesInfo(votesInfo);

  const options = [
    {
      color: "success.main",
      option: "Yes",
      ratio: yesNonRatio,
      votingPower: votesInfo.yes,
    },
    {
      color: "error.main",
      option: "No",
      ratio: noNonRatio,
      votingPower: votesInfo.no,
    },
    {
      color: "error.dark",
      option: "No with veto",
      ratio: noWithVetoNonRatio,
      votingPower: votesInfo.noWithVeto,
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
      {options.map(({ color, option, ratio, votingPower }) => (
        <Flex
          key={option}
          py={2}
          borderBottom="1px solid"
          borderBottomColor="gray.700"
          justifyContent="space-between"
        >
          <LegendText
            label={option}
            variant="body2"
            color="text.main"
            fontWeight={700}
            legendColor={color}
          />
          <Flex align="end" direction="column">
            <Text variant="body2" color="text.main">
              {formatPrettyPercent(ratio, 2, true)}
            </Text>
            <Text variant="body3" color="text.dark">
              ({d0Formatter(votingPower, "0")})
            </Text>
          </Flex>
        </Flex>
      ))}
    </div>
  ) : (
    <Flex gap={6} direction="row">
      {options.map(({ color, option, ratio, votingPower }, idx) => (
        <Fragment key={option}>
          <VpPercentCard
            name={option}
            color={color}
            isCompact={false}
            power={votingPower}
            ratio={ratio}
          />
          {idx === 0 && (
            <Divider
              display={{ base: "none", lg: "flex" }}
              h="auto"
              color="gray.700"
              orientation="vertical"
            />
          )}
        </Fragment>
      ))}
    </Flex>
  );
};
