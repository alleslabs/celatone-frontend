import { Flex, Heading, Text } from "@chakra-ui/react";
import type Big from "big.js";
import { useMemo } from "react";

import type { HistoricalPowersResponse } from "lib/services/types";
import { big } from "lib/types";
import type { AssetInfo, Option, Token, U } from "lib/types";
import { formatUTokenWithPrecision, getTokenLabel } from "lib/utils";

const formatArithmetic = (value: Big) => {
  if (value.gt(0)) return "+";
  if (value.lt(0)) return "-";
  return "";
};

const formatColor = (value: Big) => {
  if (value.gt(0)) return "success.main";
  if (value.lt(0)) return "error.main";
  return "text.dark";
};

interface VotingPowerChartDetailsProps {
  historicalPowers: HistoricalPowersResponse;
  singleStakingDenom: Option<string>;
  assetInfo: Option<AssetInfo>;
}

export const VotingPowerChartDetails = ({
  historicalPowers,
  singleStakingDenom,
  assetInfo,
}: VotingPowerChartDetailsProps) => {
  const currency = singleStakingDenom
    ? `${getTokenLabel(singleStakingDenom, assetInfo?.symbol)}`
    : "";

  const isHistoricalPowersContainsData =
    historicalPowers && historicalPowers.items.length > 0;

  const currentVotingPower = isHistoricalPowersContainsData
    ? formatUTokenWithPrecision(
        historicalPowers.items[historicalPowers.items.length - 1]
          .votingPower as U<Token<Big>>,
        assetInfo?.precision ?? 0,
        true,
        2
      )
    : "";

  // NOTE: compute 24 hrs voting power change
  const compareVotingPower = useMemo(() => {
    try {
      return isHistoricalPowersContainsData
        ? historicalPowers.items[
            historicalPowers.items.length - 1
          ].votingPower.minus(
            historicalPowers.items[historicalPowers.items.length - 25]
              .votingPower
          )
        : big(0);
    } catch {
      return big(0);
    }
  }, [historicalPowers.items, isHistoricalPowersContainsData]);

  const formattedVotingPower = `${formatArithmetic(compareVotingPower)}${formatUTokenWithPrecision(
    compareVotingPower.abs() as U<Token<Big>>,
    assetInfo?.precision ?? 0,
    true,
    2
  )}`;

  return (
    <Flex gap={2} direction="column" px={{ base: 0, md: 2 }}>
      <Heading variant="h6">
        {singleStakingDenom ? "Current Bonded Token" : "Current Voting Powers"}
      </Heading>
      <Heading variant="h5" fontWeight={600}>
        {currentVotingPower} {currency}
      </Heading>
      <Text variant="body1">
        <Text
          as="span"
          fontWeight={700}
          color={formatColor(compareVotingPower)}
        >
          {formattedVotingPower}
        </Text>
        {` ${currency}`} in last 24 hrs
      </Text>
    </Flex>
  );
};
