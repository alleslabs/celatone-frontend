import { Box, Button, Flex } from "@chakra-ui/react";
import type { BigSource } from "big.js";
import type { ScriptableContext, TooltipModel } from "chart.js";

import { useMobile } from "lib/app-provider";
import { LineChart } from "lib/components/chart/LineChart";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useValidatorHistoricalPowers } from "lib/services/validatorService";
import type { AssetInfos, Option, Token, U, ValidatorAddr } from "lib/types";
import {
  formatHHmm,
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

  const { data: historicalPowers, isLoading } =
    useValidatorHistoricalPowers(validatorAddress);

  if (isLoading) return <Loading />;
  if (!historicalPowers) return <ErrorFetching dataName="historical powers" />;

  const assetInfo = singleStakingDenom
    ? assetInfos?.[singleStakingDenom]
    : undefined;

  if (isMobileOverview)
    return (
      <Flex
        backgroundColor="gray.900"
        p={4}
        rounded={8}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        onClick={onViewMore}
      >
        <VotingPowerChartDetails
          historicalPowers={historicalPowers}
          singleStakingDenom={singleStakingDenom}
          assetInfo={assetInfo}
        />
        <CustomIcon boxSize={6} m={0} name="chevron-right" color="gray.600" />
      </Flex>
    );

  const labels = historicalPowers.items.map((item) =>
    formatHHmm(item.hourRoundedTimestamp as Date)
  );

  const dateLabels = labels.map((label) => {
    const [hours, minutes] = label.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);

    return date.toString().replace(" GMT", "<br>GMT");
  });

  const dataset = {
    data: historicalPowers.items.map((item) => item.votingPower.toNumber()),
    borderColor: "#D8BEFC",
    backgroundColor: (context: ScriptableContext<"line">) => {
      const { ctx } = context.chart;

      const gradient = ctx.createLinearGradient(0, 0, 0, 300);

      gradient.addColorStop(0, "rgba(216, 190, 252, 1)");
      gradient.addColorStop(0.8, "rgba(115, 85, 156, 0)");

      return gradient;
    },
    pointHoverBackgroundColor: "#F4F9D9",
    pointHoverBorderColor: "#D8BEFC",
  };

  const currency = singleStakingDenom
    ? `${getTokenLabel(singleStakingDenom, assetInfo?.symbol)}`
    : "";

  const customizeTooltip = (tooltip: TooltipModel<"line">) => {
    const { raw, dataIndex } = tooltip.dataPoints[0];

    const formattedAmount = formatUTokenWithPrecision(
      raw as U<Token<BigSource>>,
      assetInfo?.precision ?? 0,
      false,
      2
    );

    return `
      <div style="padding: 8px 12px;">
        <div style="font-weight: 700;">
          <h1 style="font-size: 12px; color: #ADADC2;">${
            singleStakingDenom ? "Bonded Token" : "Voting Powers"
          }</h1>
          <p style="font-size: 16px; color: #F7F2FE; white-space: nowrap;">${formattedAmount} ${currency}</p>
        </div>
        <hr style="margin-top: 8px; color: #68688A;"/>
        <p style="margin-top: 8px; font-size: 12px; color: #F7F2FE; white-space: nowrap;">${dateLabels[dataIndex]}</p>
      </div>
    `;
  };

  return (
    <Flex
      direction={{
        lg: "row",
        base: "column",
      }}
      gap={8}
      backgroundColor="gray.900"
      p={6}
      rounded={8}
      w="100%"
    >
      <Flex gap={6} direction="column" w={250} minW={250}>
        <VotingPowerChartDetails
          historicalPowers={historicalPowers}
          singleStakingDenom={singleStakingDenom}
          assetInfo={assetInfo}
        />
        {onViewMore && (
          <Button
            variant="ghost-secondary"
            p="unset"
            size="md"
            pl={2}
            onClick={onViewMore}
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
