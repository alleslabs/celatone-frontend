import { Flex, Grid, Heading, Text } from "@chakra-ui/react";
import type { BigSource } from "big.js";
import type Big from "big.js";

import { TokenImageRender } from "lib/components/token";
import { ValueWithIcon } from "lib/components/ValueWithIcon";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type { AssetInfos, Option, Token, U, USD } from "lib/types";
import {
  calculateAssetValue,
  divWithDefault,
  formatPrettyPercent,
  formatPrice,
  formatUTokenWithPrecision,
  toToken,
} from "lib/utils";

const VotingPowerDetail = ({
  label,
  percent,
  amount,
  denom = "",
  value,
}: {
  label: string;
  percent: string;
  amount: string;
  denom: Option<string>;
  value: Option<string>;
}) => (
  <Flex direction="column" w="full">
    <Text variant="body2" color="text.dark" mb={2}>
      {label}
    </Text>
    <Text fontWeight={700} variant="body1">
      {percent}
    </Text>
    <Text fontWeight={700} variant="body2">
      {amount}{" "}
      <span
        style={{
          fontWeight: "400",
        }}
      >
        {denom}
      </span>
    </Text>
    {value && (
      <Text variant="body3" color="text.dark">
        ({value})
      </Text>
    )}
  </Flex>
);

interface VotingPowerOverviewProps {
  singleStakingDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
  votingPower: Big;
  totalVotingPower: Big;
  selfVotingPower: Big;
}

export const VotingPowerOverview = ({
  singleStakingDenom,
  assetInfos,
  votingPower,
  totalVotingPower,
  selfVotingPower,
}: VotingPowerOverviewProps) => {
  const assetInfo = singleStakingDenom
    ? assetInfos?.[singleStakingDenom]
    : undefined;

  /**
   * ---------------------------------------------
   * Voting power overview
   * ---------------------------------------------
   */
  const votingPowerPercent = formatPrettyPercent(
    divWithDefault(votingPower, totalVotingPower, 0).toNumber(),
    2,
    true
  );
  const votingPowerAmount = formatUTokenWithPrecision(
    votingPower as U<Token<BigSource>>,
    assetInfo?.precision ?? 0,
    false,
    2
  );
  const votingPowerValueFormatted = assetInfo
    ? formatPrice(
        calculateAssetValue(
          toToken(votingPower as U<Token<BigSource>>, assetInfo.precision),
          assetInfo?.price as USD<number>
        )
      )
    : undefined;

  /**
   * ---------------------------------------------
   * Self-bonded
   * ---------------------------------------------
   */
  const selfBondedDivWithDefault = divWithDefault(
    selfVotingPower,
    votingPower,
    0
  );
  const selfBondedPercent = formatPrettyPercent(
    selfBondedDivWithDefault.toNumber(),
    2,
    true
  );

  const selfBondedAmount = formatUTokenWithPrecision(
    selfVotingPower as U<Token<BigSource>>,
    assetInfo?.precision ?? 0,
    true,
    2
  );

  const selfBondedValueFormatted = assetInfo
    ? formatPrice(
        calculateAssetValue(
          toToken(selfVotingPower as U<Token<BigSource>>, assetInfo.precision),
          assetInfo?.price as USD<number>
        )
      )
    : undefined;

  /**
   * ---------------------------------------------
   * From delegators
   * ---------------------------------------------
   */
  const fromDelegatorsPercent = formatPrettyPercent(
    selfBondedDivWithDefault.minus(1).abs().toNumber(),
    2,
    true
  );
  const fromDelagatorsAmount = formatUTokenWithPrecision(
    selfVotingPower.minus(1).abs() as U<Token<BigSource>>,
    assetInfo?.precision ?? 0,
    true,
    2
  );
  const fromDelegatorsValueFormatted = assetInfo
    ? formatPrice(
        calculateAssetValue(
          toToken(
            selfVotingPower.minus(1).abs() as U<Token<BigSource>>,
            assetInfo.precision
          ),
          assetInfo?.price as USD<number>
        )
      )
    : undefined;

  return (
    <Flex
      direction="column"
      gap={4}
      backgroundColor="gray.900"
      p={{ base: 4, md: 6 }}
      rounded={8}
      w="100%"
    >
      <Flex direction="column" gap={1}>
        <Flex minH="36px" alignItems="center">
          <Heading variant="h6" as="h6" color="text.main">
            Voting Power
          </Heading>
        </Flex>
        <ValueWithIcon icon="vote" value={votingPowerPercent} />
        <Flex gap={2} alignItems="center" mt={1}>
          <Flex direction="column">
            <Text fontWeight={700} variant="body1">
              {votingPowerAmount}{" "}
              <span
                style={{
                  fontWeight: "400",
                }}
              >
                {assetInfo?.symbol}
              </span>
            </Text>
            {singleStakingDenom && (
              <Text variant="body2" color="text.dark">
                ({votingPowerValueFormatted})
              </Text>
            )}
          </Flex>
          {assetInfo && (
            <TokenImageRender
              boxSize={7}
              logo={assetInfo.logo ?? getUndefinedTokenIcon(assetInfo.symbol)}
            />
          )}
        </Flex>
      </Flex>
      <Grid
        borderTop="1px solid"
        borderTopColor="gray.700"
        pt={4}
        display={{ base: "none", md: "grid" }}
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={4}
      >
        <VotingPowerDetail
          label="Self-Bonded"
          percent={selfBondedPercent}
          amount={selfBondedAmount}
          denom={assetInfo?.symbol}
          value={selfBondedValueFormatted}
        />
        <VotingPowerDetail
          label="From Delegators"
          percent={fromDelegatorsPercent}
          amount={fromDelagatorsAmount}
          denom={assetInfo?.symbol}
          value={fromDelegatorsValueFormatted}
        />
      </Grid>
    </Flex>
  );
};
