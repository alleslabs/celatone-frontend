import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

import { DotSeparator } from "lib/components/DotSeparator";
import {
  useValidatorDelegators,
  useValidatorStakingProvisions,
} from "lib/services/validatorService";
import type { Option, Ratio, ValidatorAddr } from "lib/types";
import { divWithDefault, formatPrettyPercent } from "lib/utils";

const StatWithLabel = ({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: Option<string>;
  isLoading: boolean;
}) => (
  <Flex gap={{ md: 1 }} direction={{ base: "column", md: "row" }}>
    <Text variant="body2" fontWeight={600} color="text.dark">
      {label}
    </Text>
    {isLoading ? (
      <Spinner size="sm" />
    ) : (
      <Text
        variant="body2"
        fontWeight={600}
        color={value ? "text.main" : "text.dark"}
      >
        {value ?? "N/A"}
      </Text>
    )}
  </Flex>
);

interface ValidatorStatsProps {
  validatorAddress: ValidatorAddr;
  commissionRate: Ratio<number>;
  totalVotingPower: Big;
  singleStakingDenom: Option<string>;
}

export const ValidatorStats = ({
  validatorAddress,
  commissionRate,
  totalVotingPower,
  singleStakingDenom,
}: ValidatorStatsProps) => {
  const { data: stakingProvisions, isLoading: isStakingProvisionsLoading } =
    useValidatorStakingProvisions(!!singleStakingDenom);
  const { data: delegations, isLoading: isDelegationsLoading } =
    useValidatorDelegators(validatorAddress);

  const estimatedApr = stakingProvisions
    ? formatPrettyPercent(
        divWithDefault(
          stakingProvisions.stakingProvisions,
          totalVotingPower.mul(1 - commissionRate),
          0
        ).toNumber() as Ratio<number>,
        2,
        true
      )
    : undefined;

  const delegatorsCount = delegations ? String(delegations.total) : undefined;

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
      <StatWithLabel
        label="Commission"
        value={formatPrettyPercent(commissionRate, 2, true)}
        isLoading={false}
      />
      {singleStakingDenom && (
        <>
          <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
          <StatWithLabel
            label="Estimated APR"
            value={estimatedApr}
            isLoading={isStakingProvisionsLoading}
          />
        </>
      )}
      <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
      <StatWithLabel
        label="Delegators"
        value={delegatorsCount}
        isLoading={isDelegationsLoading}
      />
    </Box>
  );
};
