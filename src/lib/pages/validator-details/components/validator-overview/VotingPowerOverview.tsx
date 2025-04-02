import type {
  AssetInfo,
  AssetInfos,
  Option,
  Ratio,
  Token,
  U,
  USD,
} from "lib/types";

import { Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useMobile, useTierConfig } from "lib/app-provider";
import { TokenImageRender } from "lib/components/token";
import { ValueWithIcon } from "lib/components/ValueWithIcon";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
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
      <Text color="text.dark" mb={2} variant="body2">
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
        <Text color="text.dark" variant="body3">
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
      backgroundColor="gray.900"
      direction="column"
      gap={4}
      p={{ base: 4, md: 6 }}
      rounded={8}
      w="100%"
    >
      <Grid
        alignItems="center"
        gap={4}
        gridTemplateColumns={
          isFullTier
            ? "1fr"
            : "minmax(300px, 300px) minmax(200px, 200px) minmax(200px, 200px)"
        }
      >
        <Flex direction="column" gap={1}>
          <Flex alignItems="center" minH="36px">
            <Heading as="h6" color="text.main" variant="h6">
              Voting Power
            </Heading>
          </Flex>
          <ValueWithIcon icon="vote" value={votingPowerPercent} />
          <Flex alignItems="center" gap={2} mt={1}>
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
                <Text color="text.dark" variant="body2">
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
              amount={selfVotingPower as U<Token<Big>>}
              assetInfo={assetInfo}
              denom={singleStakingDenom}
              label="Self-Bonded"
              ratio={selfVotingPowerRatio}
            />
            <VotingPowerDetail
              amount={votingPower.minus(selfVotingPower) as U<Token<Big>>}
              assetInfo={assetInfo}
              denom={singleStakingDenom}
              label="From Delegators"
              ratio={(1 - selfVotingPowerRatio) as Ratio<number>}
            />
          </>
        )}
      </Grid>
      <Grid
        borderStyle="solid"
        borderTopColor="gray.700"
        borderTopWidth="1px"
        display={{
          base: isFullTier ? "none" : "grid",
          md: isFullTier ? "grid" : "none",
        }}
        gap={4}
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
        pt={4}
      >
        <VotingPowerDetail
          amount={selfVotingPower as U<Token<Big>>}
          assetInfo={assetInfo}
          denom={singleStakingDenom}
          label="Self-Bonded"
          ratio={selfVotingPowerRatio}
        />
        <VotingPowerDetail
          amount={votingPower.minus(selfVotingPower) as U<Token<Big>>}
          assetInfo={assetInfo}
          denom={singleStakingDenom}
          label="From Delegators"
          ratio={(1 - selfVotingPowerRatio) as Ratio<number>}
        />
      </Grid>
    </Flex>
  );
};
