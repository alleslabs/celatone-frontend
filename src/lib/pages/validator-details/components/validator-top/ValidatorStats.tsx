import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { DotSeparator } from "lib/components/DotSeparator";
import {
  useValidatorDelegators,
  useValidatorStakingProvisions,
} from "lib/services/validatorService";
import type { ValidatorData } from "lib/types";

const StatWithLabel = ({
  label,
  value,
}: {
  label: string;
  value: string | ReactNode;
}) => (
  <Flex gap={{ md: 1 }} direction={{ base: "column", md: "row" }}>
    <Text variant="body2" fontWeight={600} color="text.dark">
      {label}
    </Text>
    <Text variant="body2" fontWeight={600} color="text.main">
      {value}
    </Text>
  </Flex>
);

interface ValidatorStatsProps {
  info: ValidatorData;
  totalVotingPower: Big;
}

export const ValidatorStats = ({
  info,
  totalVotingPower,
}: ValidatorStatsProps) => {
  const { data: stakingProvisions } = useValidatorStakingProvisions();
  const { data: delegations, isLoading: isDelegationsLoading } =
    useValidatorDelegators(info.validatorAddress);
  const {
    chainConfig: {
      extra: { singleStakingDenom },
    },
  } = useCelatoneApp();

  if (!stakingProvisions) return <Spinner size="sm" />;

  const estimatedApr = singleStakingDenom
    ? stakingProvisions.stakingProvisions.div(
        totalVotingPower.mul(1 - info.commissionRate)
      )
    : undefined;

  const delegationsValue =
    !isDelegationsLoading && delegations ? (
      String(delegations.total)
    ) : (
      <Spinner size="sm" />
    );

  return (
    <Box
      display={{ base: "grid", md: "flex" }}
      alignItems="center"
      gap={2}
      gridTemplateColumns={`repeat(${singleStakingDenom ? 3 : 2}, 1fr)`}
      border={{ base: "1px solid", md: "0px" }}
      borderColor="gray.700"
      borderRadius={4}
      mt={{ base: 2, md: 1 }}
      mb={{ base: 0, md: 1 }}
      px={{ base: 3, md: 0 }}
      py={{ base: 1, md: 0 }}
    >
      <StatWithLabel label="Commission" value={`${info.commissionRate}%`} />
      {estimatedApr && (
        <>
          <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
          <StatWithLabel
            label="Estimated APR"
            value={`${String(estimatedApr.toNumber())}%`}
          />
        </>
      )}
      <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
      <StatWithLabel label="Delegators" value={delegationsValue} />
    </Box>
  );
};
