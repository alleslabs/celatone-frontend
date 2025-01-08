import { Flex, Grid, Heading, Text } from "@chakra-ui/react";

import { useMobile, useTierConfig } from "lib/app-provider";
import { TokenImageRender } from "lib/components/token";
import { ValueWithIcon } from "lib/components/ValueWithIcon";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type {
  AssetInfo,
  AssetInfos,
  Option,
  Ratio,
  Token,
  U,
  USD,
} from "lib/types";
import {
  calculateAssetValue,
  divWithDefault,
  formatPrettyPercent,
  formatPrice,
  formatUTokenWithPrecision,
  getStakingAssetInfo,
  getTokenLabel,
  toToken,
} from "lib/utils";

const VotingPowerDetail = ({
  amount,
  assetInfo,
  denom,
  label,
  ratio,
}: {
  amount: U<Token<Big>>;
  assetInfo: Option<AssetInfo>;
  denom: Option<string>;
  label: string;
  ratio: Ratio<number>;
}) => {
  const formattedPercent = formatPrettyPercent(ratio, 2, true);
  const formattedAmount = formatUTokenWithPrecision(
    amount,
    assetInfo?.precision ?? 0,
    true,
    2
  );
  const formattedValue = assetInfo
    ? formatPrice(
        calculateAssetValue(
          toToken(amount as U<Token<Big>>, assetInfo.precision),
          assetInfo.price as USD<number>
        )
      )
    : undefined;

  return (
    <Flex w="full" direction="column">
      <Text mb={2} variant="body2" color="text.dark">
        {label}
      </Text>
      <Text variant="body1" fontWeight={700}>
        {formattedPercent}
      </Text>
      <Text variant="body2" fontWeight={700}>
        {formattedAmount}
        {denom && (
          <span
            style={{
              fontWeight: "400",
            }}
          >
            {` ${getTokenLabel(denom, assetInfo?.symbol)}`}
          </span>
        )}
      </Text>
      {formattedValue && (
        <Text variant="body3" color="text.dark">
          ({formattedValue})
        </Text>
      )}
    </Flex>
  );
};

interface VotingPowerOverviewProps {
  assetInfos: Option<AssetInfos>;
  selfVotingPower: Big;
  singleStakingDenom: Option<string>;
  totalVotingPower: Big;
  votingPower: Big;
}

export const VotingPowerOverview = ({
  assetInfos,
  selfVotingPower,
  singleStakingDenom,
  totalVotingPower,
  votingPower,
}: VotingPowerOverviewProps) => {
  const { isFullTier } = useTierConfig();
  const isMobile = useMobile();
  const assetInfo = getStakingAssetInfo(singleStakingDenom, assetInfos);

  const votingPowerPercent = formatPrettyPercent(
    divWithDefault(
      votingPower,
      totalVotingPower,
      0
    ).toNumber() as Ratio<number>,
    2,
    true
  );
  const votingPowerAmount = formatUTokenWithPrecision(
    votingPower as U<Token<Big>>,
    assetInfo?.precision ?? 0,
    false,
    2
  );
  const votingPowerValueFormatted = assetInfo
    ? formatPrice(
        calculateAssetValue(
          toToken(votingPower as U<Token<Big>>, assetInfo.precision),
          assetInfo.price as USD<number>
        )
      )
    : "N/A";

  const selfVotingPowerRatio = divWithDefault(
    selfVotingPower,
    votingPower,
    0
  ).toNumber() as Ratio<number>;

  return (
    <Flex
      gap={4}
      p={{ base: 4, md: 6 }}
      w="100%"
      backgroundColor="gray.900"
      direction="column"
      rounded={8}
    >
      <Grid
        gridTemplateColumns={
          isFullTier
            ? "1fr"
            : "minmax(300px, 300px) minmax(200px, 200px) minmax(200px, 200px)"
        }
        alignItems="center"
        gap={4}
      >
        <Flex gap={1} direction="column">
          <Flex alignItems="center" minH="36px">
            <Heading as="h6" variant="h6" color="text.main">
              Voting Power
            </Heading>
          </Flex>
          <ValueWithIcon value={votingPowerPercent} icon="vote" />
          <Flex alignItems="center" gap={2} mt={1}>
            <Flex direction="column">
              <Text variant="body1" fontWeight={700}>
                {votingPowerAmount}
                {singleStakingDenom && (
                  <span
                    style={{
                      fontWeight: "400",
                    }}
                  >
                    {` ${getTokenLabel(singleStakingDenom, assetInfo?.symbol)}`}
                  </span>
                )}
              </Text>
              {singleStakingDenom && (
                <Text variant="body2" color="text.dark">
                  ({votingPowerValueFormatted})
                </Text>
              )}
            </Flex>
            {singleStakingDenom && (
              <TokenImageRender
                boxSize={7}
                logo={
                  assetInfo?.logo ?? getUndefinedTokenIcon(singleStakingDenom)
                }
              />
            )}
          </Flex>
        </Flex>
        {!isFullTier && !isMobile && (
          <>
            <VotingPowerDetail
              label="Self-Bonded"
              amount={selfVotingPower as U<Token<Big>>}
              assetInfo={assetInfo}
              denom={singleStakingDenom}
              ratio={selfVotingPowerRatio}
            />
            <VotingPowerDetail
              label="From Delegators"
              amount={votingPower.minus(selfVotingPower) as U<Token<Big>>}
              assetInfo={assetInfo}
              denom={singleStakingDenom}
              ratio={(1 - selfVotingPowerRatio) as Ratio<number>}
            />
          </>
        )}
      </Grid>
      <Grid
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
        display={{
          base: isFullTier ? "none" : "grid",
          md: isFullTier ? "grid" : "none",
        }}
        gap={4}
        pt={4}
        borderTop="1px solid"
        borderTopColor="gray.700"
      >
        <VotingPowerDetail
          label="Self-Bonded"
          amount={selfVotingPower as U<Token<Big>>}
          assetInfo={assetInfo}
          denom={singleStakingDenom}
          ratio={selfVotingPowerRatio}
        />
        <VotingPowerDetail
          label="From Delegators"
          amount={votingPower.minus(selfVotingPower) as U<Token<Big>>}
          assetInfo={assetInfo}
          denom={singleStakingDenom}
          ratio={(1 - selfVotingPowerRatio) as Ratio<number>}
        />
      </Grid>
    </Flex>
  );
};
