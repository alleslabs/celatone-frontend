import { Divider, Flex, Text } from "@chakra-ui/react";
import { Fragment } from "react";

import { LegendText } from "lib/components/LegendText";
import type { ProposalVotesInfo } from "lib/types";
import { d0Formatter, formatPrettyPercent } from "lib/utils";

import { VpPercentCard } from "./VpPercentCard";
import { normalizeVotesInfo } from "../utils";

interface VpPercentThresholdProps {
  votesInfo: ProposalVotesInfo;
  isCompact: boolean;
}

export const VpPercentThreshold = ({
  votesInfo,
  isCompact,
}: VpPercentThresholdProps) => {
  const { yesNonRatio, noNonRatio, noWithVetoNonRatio } =
    normalizeVotesInfo(votesInfo);

  const options = [
    {
      option: "Yes",
      ratio: yesNonRatio,
      votingPower: votesInfo.yes,
      color: "success.main",
    },
    {
      option: "No",
      ratio: noNonRatio,
      votingPower: votesInfo.no,
      color: "error.main",
    },
    {
      option: "No with veto",
      ratio: noWithVetoNonRatio,
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
          <LegendText
            label={option}
            legendColor={color}
            variant="body2"
            color="text.main"
            fontWeight={700}
          />
          <Flex direction="column" align="end">
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
