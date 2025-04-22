import type Big from "big.js";
import type { HistoricalPowersResponse } from "lib/services/types";
import type { AssetInfo, Option, Token, U } from "lib/types";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { big } from "lib/types";
import { formatUTokenWithPrecision, getTokenLabel } from "lib/utils";
import { useMemo } from "react";

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
  assetInfo: Option<AssetInfo>;
  historicalPowers: HistoricalPowersResponse;
  singleStakingDenom: Option<string>;
}

export const VotingPowerChartDetails = ({
  assetInfo,
  historicalPowers,
  singleStakingDenom,
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
    if (isHistoricalPowersContainsData) {
      const presentVotingPower =
        historicalPowers.items[historicalPowers.items.length - 1].votingPower;
      const yesterdayVotingPower =
        historicalPowers.items[historicalPowers.items.length - 25]
          ?.votingPower ?? big(0);
      return presentVotingPower.minus(yesterdayVotingPower);
    }
    return big(0);
  }, [historicalPowers.items, isHistoricalPowersContainsData]);

  const formattedVotingPower = `${formatArithmetic(compareVotingPower)}${formatUTokenWithPrecision(
    compareVotingPower.abs() as U<Token<Big>>,
    assetInfo?.precision ?? 0,
    true,
    2
  )}`;

  return (
    <Flex direction="column" gap={2} px={{ base: 0, md: 2 }}>
      <Heading variant="h6">
        {singleStakingDenom ? "Current bonded token" : "Current voting powers"}
      </Heading>
      <Heading fontWeight={600} variant="h5">
        {currentVotingPower} {currency}
      </Heading>
      <Text variant="body1">
        <Text
          as="span"
          color={formatColor(compareVotingPower)}
          fontWeight={700}
        >
          {formattedVotingPower}
        </Text>
        {` ${currency}`} in last 24 hrs
      </Text>
    </Flex>
  );
};
