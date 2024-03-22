import { Flex, Heading, Text } from "@chakra-ui/react";
import type Big from "big.js";

import type { HistoricalPowersResponse } from "lib/services/validator";
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

  const currentPrice = isHistoricalPowersContainsData
    ? formatUTokenWithPrecision(
        historicalPowers.items[historicalPowers.items.length - 1]
          .votingPower as U<Token<Big>>,
        assetInfo?.precision ?? 0,
        true,
        2
      )
    : "";

  const compareVotingPower = isHistoricalPowersContainsData
    ? historicalPowers.items[
        historicalPowers.items.length - 1
      ].votingPower.minus(historicalPowers.items[0].votingPower)
    : big(0);

  const formattedVotingPower = `${formatArithmetic(compareVotingPower)}${formatUTokenWithPrecision(
    compareVotingPower.abs() as U<Token<Big>>,
    assetInfo?.precision ?? 0,
    true,
    2
  )}`;

  return (
    <Flex gap={2} direction="column">
      <Heading variant="h6">
        {singleStakingDenom ? "Current Bonded Token" : "Current Voting Powers"}
      </Heading>
      <Heading variant="h5" fontWeight={600}>
        {currentPrice} {currency}
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
