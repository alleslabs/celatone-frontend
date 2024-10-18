import { Box, Button, Flex } from "@chakra-ui/react";
import type { BigSource } from "big.js";
import type { ScriptableContext, TooltipModel } from "chart.js";

import { trackUseViewMore } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { LineChart } from "lib/components/chart/LineChart";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useValidatorHistoricalPowers } from "lib/services/validator";
import type { AssetInfos, Option, Token, U, ValidatorAddr } from "lib/types";
import {
  formatMMMDD,
  formatUTC,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

import { VotingPowerChartDetails } from "./VotingPowerChartDetails";

interface VotingPowerChartProps {
  validatorAddress: ValidatorAddr;
  singleStakingDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
  onViewMore?: () => void;
}

export const VotingPowerChart = ({
  validatorAddress,
  singleStakingDenom,
  assetInfos,
  onViewMore,
}: VotingPowerChartProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;

  const { data: rawHistoricalPowers, isLoading } =
    useValidatorHistoricalPowers(validatorAddress);

  if (isLoading) return <Loading />;
  if (!rawHistoricalPowers)
    return <ErrorFetching dataName="historical powers" />;

  // NOTE: Divided by 1e6 in case of initial case
  const historicalPowers = {
    ...rawHistoricalPowers,
    items: rawHistoricalPowers.items.map((item) => ({
      ...item,
      votingPower: singleStakingDenom
        ? item.votingPower
        : item.votingPower.div(1e6), // Initia case
    })),
  };

  const assetInfo = singleStakingDenom
    ? assetInfos?.[singleStakingDenom]
    : undefined;

  const currency = singleStakingDenom
    ? `${getTokenLabel(singleStakingDenom, assetInfo?.symbol)}`
    : "";

  const labels = historicalPowers.items.map((item) => {
    return formatMMMDD(item.hourRoundedTimestamp as Date);
  });

  const dataset = {
    data: historicalPowers.items.map((item) => item.votingPower.toNumber()),
    borderColor: "#4CE2F7",
    backgroundColor: (context: ScriptableContext<"line">) => {
      const { ctx } = context.chart;

      const gradient = ctx.createLinearGradient(0, 0, 0, 300);

      gradient.addColorStop(0, "rgba(76, 226, 247, 1)");
      gradient.addColorStop(0.8, "rgba(14, 49, 57, 0)");

      return gradient;
    },
    pointHoverBackgroundColor: "#F5F5F5",
    pointHoverBorderColor: "#4CE2F7",
  };

  const customizeTooltip = (tooltip: TooltipModel<"line">) => {
    const { raw, dataIndex } = tooltip.dataPoints[0];

    const formattedAmount = formatUTokenWithPrecision(
      raw as U<Token<BigSource>>,
      assetInfo?.precision ?? 0,
      false,
      2
    );

    const formattedDate = formatUTC(
      historicalPowers.items[dataIndex].hourRoundedTimestamp
    );

    return `
      <div style="padding: 8px 12px;">
        <div style="font-weight: 700;">
          <h1 style="font-size: 12px; color: #D1D9E0;">${
            singleStakingDenom ? "Bonded Token" : "Voting Powers"
          }</h1>
          <p style="font-size: 16px; color: #4CE2F7; white-space: nowrap;">${formattedAmount} ${currency}</p>
        </div>
        <hr style="margin-top: 8px; color: #757C82;"/>
        <p style="margin-top: 8px; font-size: 12px; color: #F5F5F5; white-space: nowrap;">${formattedDate}</p>
      </div>
    `;
  };

  return isMobileOverview ? (
    <Flex
      backgroundColor="gray.900"
      p={4}
      rounded={8}
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      onClick={() => {
        trackUseViewMore();
        onViewMore();
      }}
    >
      <VotingPowerChartDetails
        historicalPowers={historicalPowers}
        singleStakingDenom={singleStakingDenom}
        assetInfo={assetInfo}
      />
      <CustomIcon boxSize={6} m={0} name="chevron-right" color="gray.600" />
    </Flex>
  ) : (
    <Flex
      direction={{
        lg: "row",
        base: "column",
      }}
      gap={8}
      backgroundColor="gray.900"
      py={6}
      px={4}
      rounded={8}
      w="100%"
    >
      <Flex gap={6} direction="column" w={280} minW={280}>
        <VotingPowerChartDetails
          historicalPowers={historicalPowers}
          singleStakingDenom={singleStakingDenom}
          assetInfo={assetInfo}
        />
        {onViewMore && (
          <Button
            variant="ghost-primary"
            p="unset"
            size="md"
            pl={2}
            w="fit-content"
            onClick={() => {
              trackUseViewMore();
              onViewMore();
            }}
          >
            See all related transactions
            <CustomIcon name="chevron-right" boxSize={3} />
          </Button>
        )}
      </Flex>
      <Box w="100%" h="272px" id="voting-power-chart-container">
        <LineChart
          labels={labels}
          dataset={dataset}
          customizeTooltip={customizeTooltip}
          customizeYAxisTicks={(value) =>
            formatUTokenWithPrecision(
              value as U<Token<BigSource>>,
              assetInfo?.precision ?? 0,
              false,
              2
            )
          }
        />
      </Box>
    </Flex>
  );
};
