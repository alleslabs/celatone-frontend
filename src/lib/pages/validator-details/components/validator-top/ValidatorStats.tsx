import { Flex, Spinner, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

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

  if (!stakingProvisions) return <Spinner size="sm" />;

  const estimatedApr = stakingProvisions.stakingProvisions.div(
    totalVotingPower.mul(1 - info.commissionRate)
  );

  const delegationsValue =
    !isDelegationsLoading && delegations ? (
      String(delegations.total)
    ) : (
      <Spinner size="sm" />
    );

  return (
    <Flex
      alignItems="center"
      justifyContent={{ base: "space-between", md: "start" }}
      gap={{ base: 3, md: 2 }}
      mt={{ base: 2, md: 1 }}
      mb={{ base: 0, md: 1 }}
      px={{ base: 3, md: 0 }}
      py={{ base: 1, md: 0 }}
      border={{ base: "1px solid", md: "0px" }}
      borderColor="gray.700"
      borderRadius={4}
    >
      <StatWithLabel label="Commission" value={`${info.commissionRate}%`} />
      <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
      <StatWithLabel
        label="Estimated APR"
        value={`${String(estimatedApr.toNumber())}%`}
      />
      <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
      <StatWithLabel label="Delegators" value={delegationsValue} />
    </Flex>
  );
};
