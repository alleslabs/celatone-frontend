import type { ProposalVotesInfo } from "lib/types";

import { Divider, Flex, Text } from "@chakra-ui/react";
import { LegendText } from "lib/components/LegendText";
import { d0Formatter, formatPrettyPercent } from "lib/utils";
import { Fragment } from "react";

import { normalizeVotesInfo } from "../utils";
import { VpPercentCard } from "./VpPercentCard";

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
        <Text color="text.dark" fontWeight={500} variant="body2">
          Options
        </Text>
        <Text color="text.dark" fontWeight={500} variant="body2">
          % (Voting Power)
        </Text>
      </Flex>
      {options.map(({ option, ratio, votingPower, color }) => (
        <Flex
          key={option}
          borderBottomColor="gray.700"
          borderBottomWidth="1px"
          justifyContent="space-between"
          py={2}
        >
          <LegendText
            color="text.main"
            fontWeight={700}
            label={option}
            legendColor={color}
            variant="body2"
          />
          <Flex align="end" direction="column">
            <Text color="text.main" variant="body2">
              {formatPrettyPercent(ratio, 2, true)}
            </Text>
            <Text color="text.dark" variant="body3">
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
            color={color}
            isCompact={false}
            name={option}
            power={votingPower}
            ratio={ratio}
          />
          {idx === 0 && (
            <Divider
              color="gray.700"
              display={{ base: "none", lg: "flex" }}
              h="auto"
              orientation="vertical"
            />
          )}
        </Fragment>
      ))}
    </Flex>
  );
};
