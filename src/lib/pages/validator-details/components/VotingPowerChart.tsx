import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { ScriptableContext, TooltipModel } from "chart.js";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { LineChart } from "lib/components/chart/LineChart";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useAssetInfos } from "lib/services/assetService";
import type {
  HistoricalPowersItem,
  HistoricalPowersResponse,
} from "lib/services/validator";
import { zValidatorQueryParams } from "lib/services/validator";
import { useValidatorHistoricalPowers } from "lib/services/validatorService";
import type { AssetInfo, Token, U } from "lib/types";
import { zValidatorAddr } from "lib/types";
import { formatHHmm, formatUTokenWithPrecision } from "lib/utils";

export const VotingPowerChart = () => {
  const router = useRouter();
  const validated = zValidatorQueryParams.safeParse(router.query);
  const [asset, setAsset] = useState<AssetInfo | undefined>();
  const [historicalPowers, setHistoricalPowers] = useState<
    Omit<HistoricalPowersResponse, "items"> & {
      items: (HistoricalPowersItem & {
        value: string;
      })[];
    }
  >();

  const {
    chainConfig: {
      extra: { singleStakingDenom },
    },
  } = useCelatoneApp();
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  const { data, isLoading, error } = useValidatorHistoricalPowers(
    zValidatorAddr.parse(
      router.isReady && validated.success ? validated.data.validatorAddress : ""
    )
  );

  useEffect(() => {
    if (!singleStakingDenom || !assetInfos) {
      return;
    }

    setAsset(assetInfos[singleStakingDenom]);
  }, [singleStakingDenom, assetInfos]);

  useEffect(() => {
    if (isLoading || !asset || !data) return;

    const items = data.items.map((item: HistoricalPowersItem) => ({
      ...item,
      value: formatUTokenWithPrecision(
        item.votingPower as U<Token<Big>>,
        asset.precision,
        false,
        2
      ),
    }));

    setHistoricalPowers({
      ...data,
      items,
    });
  }, [isLoading, asset, data]);

  const convertValueStringToNumber = (value: string) => {
    const numberWithoutCommas = value.replace(/,/g, "");
    return parseFloat(numberWithoutCommas);
  };

  const labels = useMemo(
    () =>
      historicalPowers?.items.map((item) =>
        formatHHmm(item.hourRoundedTimestamp as Date)
      ) ?? [],
    [historicalPowers]
  );

  const dateLabels = useMemo(
    () =>
      labels.map((label) => {
        const [hours, minutes] = label.split(":");
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        date.setSeconds(0);

        return date.toString().replace(" GMT", "<br>GMT");
      }),
    [labels]
  );

  const dataset = useMemo(
    () => ({
      data:
        historicalPowers?.items.map((item) =>
          convertValueStringToNumber(item.value)
        ) || [],
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
    }),
    [historicalPowers]
  );

  if (isLoading || !dataset.data) return <Loading />;

  if (error) return <ErrorFetching dataName="Historical Powers" />;

  const isDatasetContainsData = dataset && dataset.data.length > 0;

  const currentPrice = isDatasetContainsData
    ? dataset.data[dataset.data.length - 1].toFixed(1)
    : "";
  const currency = asset?.symbol ?? "";
  const diffInLast24Hr = isDatasetContainsData
    ? dataset.data[dataset.data.length - 1] - dataset.data[0]
    : 0;

  const customizeTooltip = (tooltip: TooltipModel<"line">) => {
    const { raw, dataIndex } = tooltip.dataPoints[0];

    return `
      <div style="padding: 8px 12px;">
        <div style="font-weight: 700;">
          <h1 style="font-size: 12px; color: #ADADC2;">Bonded Tokens</h1>
          <p style="font-size: 16px; color: #F7F2FE; white-space: nowrap;">${Number(raw).toFixed(1)} ${currency}</p>
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
      <Flex gap={2} direction="column" w={250} minW={250}>
        <Heading variant="h6">
          {asset ? "Current Bonded Token" : "Voting Powers"}
        </Heading>
        <Heading variant="h5" fontWeight={600}>
          {currentPrice} {currency}
        </Heading>
        <Text variant="body1">
          <Text
            as="span"
            fontWeight={700}
            color={diffInLast24Hr >= 0 ? "success.main" : "error.main"}
          >
            {diffInLast24Hr >= 0 ? `+${diffInLast24Hr}` : `-${diffInLast24Hr}`}
          </Text>{" "}
          {currency} in last 24 hr
        </Text>
      </Flex>
      <Box w="100%" h="272px" id="voting-power-chart-container">
        <LineChart
          labels={labels}
          dataset={dataset}
          customizeTooltip={customizeTooltip}
        />
      </Box>
    </Flex>
  );
};
