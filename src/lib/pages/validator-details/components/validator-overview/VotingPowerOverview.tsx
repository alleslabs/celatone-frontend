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
  label,
  ratio,
  amount,
  denom,
  assetInfo,
}: {
  label: string;
  ratio: Ratio<number>;
  amount: U<Token<Big>>;
  denom: Option<string>;
  assetInfo: Option<AssetInfo>;
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
    <Flex direction="column" w="full">
      <Text variant="body2" color="text.dark" mb={2}>
        {label}
      </Text>
      <Text fontWeight={700} variant="body1">
        {formattedPercent}
      </Text>
      <Text fontWeight={700} variant="body2">
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
      direction="column"
      gap={4}
      backgroundColor="gray.900"
      p={{ base: 4, md: 6 }}
      rounded={8}
      w="100%"
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
        <Flex direction="column" gap={1}>
          <Flex minH="36px" alignItems="center">
            <Heading variant="h6" as="h6" color="text.main">
              Voting power
            </Heading>
          </Flex>
          <ValueWithIcon icon="vote" value={votingPowerPercent} />
          <Flex gap={2} alignItems="center" mt={1}>
            <Flex direction="column">
              <Text fontWeight={700} variant="body1">
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
              label="Self-bonded"
              ratio={selfVotingPowerRatio}
              amount={selfVotingPower as U<Token<Big>>}
              denom={singleStakingDenom}
              assetInfo={assetInfo}
            />
            <VotingPowerDetail
              label="From delegators"
              ratio={(1 - selfVotingPowerRatio) as Ratio<number>}
              amount={votingPower.minus(selfVotingPower) as U<Token<Big>>}
              denom={singleStakingDenom}
              assetInfo={assetInfo}
            />
          </>
        )}
      </Grid>
      <Grid
        borderTop="1px solid"
        borderTopColor="gray.700"
        pt={4}
        display={{
          base: isFullTier ? "none" : "grid",
          md: isFullTier ? "grid" : "none",
        }}
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={4}
      >
        <VotingPowerDetail
          label="Self-bonded"
          ratio={selfVotingPowerRatio}
          amount={selfVotingPower as U<Token<Big>>}
          denom={singleStakingDenom}
          assetInfo={assetInfo}
        />
        <VotingPowerDetail
          label="From delegators"
          ratio={(1 - selfVotingPowerRatio) as Ratio<number>}
          amount={votingPower.minus(selfVotingPower) as U<Token<Big>>}
          denom={singleStakingDenom}
          assetInfo={assetInfo}
        />
      </Grid>
    </Flex>
  );
};
