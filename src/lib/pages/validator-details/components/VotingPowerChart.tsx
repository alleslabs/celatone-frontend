import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { ScriptableContext, TooltipModel } from "chart.js";

import { LineChart } from "../../../components/chart/LineChart";

interface VotingPowerChartProps {
  currency: string;
}

export const VotingPowerChart = ({ currency }: VotingPowerChartProps) => {
  const labels = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
  ];

  const dataset = {
    data: [
      2000, 2500, 1800, 2100, 1200, 1500, 1800, 2000, 2500, 1800, 2100, 1200,
      1500,
    ],
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

  const currentPrice = dataset.data[dataset.data.length - 1].toFixed(1);

  const customizeTooltip = (tooltip: TooltipModel<"line">) => {
    const { label, raw } = tooltip.dataPoints[0];

    return `
      <div style="padding: 8px 12px;">
        <div style="font-weight: 700;">
          <h1 style="font-size: 12px; color: #ADADC2;">Bonded Tokens</h1>
          <p style="font-size: 16px; color: #F7F2FE; white-space: nowrap;">${Number(raw).toFixed(1)} ${currency}</p>
        </div>
        <hr style="margin-top: 8px; color: #68688A;"/>
        <p style="margin-top: 8px; font-size: 12px; color: #F7F2FE;">Oct 10th, 2023 ${label}</p>
      </div>
    `;
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={{ base: 4, md: 6 }}
      mt={{ base: 0, md: 8 }}
    >
      <Flex gap={8} backgroundColor="gray.900" p={6} rounded={8} w="100%">
        <Flex gap={2} direction="column" w={250} minW={250}>
          <Heading variant="h6">Current Bonded Token</Heading>
          <Heading variant="h5" fontWeight={600}>
            {currentPrice} {currency}
          </Heading>
          <Text variant="body1">
            <Text as="span" fontWeight={700} color="success.main">
              +24.02
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
    </Flex>
  );
};
