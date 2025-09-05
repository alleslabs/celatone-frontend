import type { BigSource } from "big.js";
import type { ScriptableContext, TooltipModel } from "chart.js";
import type { AssetInfos, Option, Token, U, ValidatorAddr } from "lib/types";

import { Box, Button, Flex } from "@chakra-ui/react";
import { trackUseViewMore } from "lib/amplitude";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { LineChart } from "lib/components/chart/LineChart";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useValidatorHistoricalPowers } from "lib/services/validator";
import {
  formatMMMDD,
  formatUTC,
  formatUTokenWithPrecision,
  getStakingAssetInfo,
  getTokenLabel,
} from "lib/utils";

import { VotingPowerChartDetails } from "./VotingPowerChartDetails";

interface VotingPowerChartProps {
  assetInfos: Option<AssetInfos>;
  onViewMore?: () => void;
  singleStakingDenom: Option<string>;
  validatorAddress: ValidatorAddr;
}

export const VotingPowerChart = ({
  assetInfos,
  onViewMore,
  singleStakingDenom,
  validatorAddress,
}: VotingPowerChartProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
  const evm = useEvmConfig({ shouldRedirect: false });

  const { data: historicalPowers, isLoading } =
    useValidatorHistoricalPowers(validatorAddress);

  if (isLoading) return <Loading />;
  if (!historicalPowers) return <ErrorFetching dataName="historical powers" />;

  const assetInfo = getStakingAssetInfo(singleStakingDenom, assetInfos);

  const currency = singleStakingDenom
    ? `${getTokenLabel(singleStakingDenom, assetInfo?.symbol)}`
    : "";

  const labels = historicalPowers.items.map((item) => {
    return formatMMMDD(item.hourRoundedTimestamp as Date);
  });

  const dataset = {
    backgroundColor: (context: ScriptableContext<"line">) => {
      const { ctx } = context.chart;

      const gradient = ctx.createLinearGradient(0, 0, 0, 300);

      gradient.addColorStop(0, "rgba(76, 226, 247, 1)");
      gradient.addColorStop(0.8, "rgba(14, 49, 57, 0)");

      return gradient;
    },
    borderColor: "#4CE2F7",
    data: historicalPowers.items.map((item) => item.votingPower.toNumber()),
    pointHoverBackgroundColor: "#F5F5F5",
    pointHoverBorderColor: "#4CE2F7",
  };

  const customizeTooltip = (tooltip: TooltipModel<"line">) => {
    const { dataIndex, raw } = tooltip.dataPoints[0];

    const formattedAmount = formatUTokenWithPrecision({
      amount: raw as U<Token<BigSource>>,
      decimalPoints: 2,
      isEvm: evm.enabled,
      isSuffix: false,
      precision: assetInfo?.precision ?? 0,
    });

    const formattedDate = formatUTC(
      historicalPowers.items[dataIndex].hourRoundedTimestamp
    );

    return `
      <div style="padding: 8px 12px;">
        <div style="font-weight: 700;">
          <h1 style="font-size: 12px; color: #D1D9E0;">${
            singleStakingDenom ? "Bonded token" : "Voting powers"
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
      alignItems="center"
      backgroundColor="gray.900"
      justifyContent="space-between"
      p={4}
      rounded={8}
      w="100%"
      onClick={() => {
        trackUseViewMore();
        onViewMore();
      }}
    >
      <VotingPowerChartDetails
        assetInfo={assetInfo}
        historicalPowers={historicalPowers}
        singleStakingDenom={singleStakingDenom}
      />
      <CustomIcon boxSize={6} color="gray.600" m={0} name="chevron-right" />
    </Flex>
  ) : (
    <Flex
      backgroundColor="gray.900"
      direction={{
        base: "column",
        lg: "row",
      }}
      gap={8}
      px={4}
      py={6}
      rounded={8}
      w="100%"
    >
      <Flex direction="column" gap={6} minW={280} w={280}>
        <VotingPowerChartDetails
          assetInfo={assetInfo}
          historicalPowers={historicalPowers}
          singleStakingDenom={singleStakingDenom}
        />
        {onViewMore && (
          <Button
            p="unset"
            pl={2}
            size="md"
            variant="ghost-primary"
            w="fit-content"
            onClick={() => {
              trackUseViewMore();
              onViewMore();
            }}
          >
            See all related transactions
            <CustomIcon boxSize={3} name="chevron-right" />
          </Button>
        )}
      </Flex>
      <Box id="voting-power-chart-container" h="272px" w="100%">
        <LineChart
          customizeTooltip={customizeTooltip}
          customizeYAxisTicks={(value) =>
            formatUTokenWithPrecision({
              amount: value as U<Token<BigSource>>,
              decimalPoints: 2,
              isEvm: evm.enabled,
              isSuffix: false,
              precision: assetInfo?.precision ?? 0,
            })
          }
          dataset={dataset}
          labels={labels}
        />
      </Box>
    </Flex>
  );
};
