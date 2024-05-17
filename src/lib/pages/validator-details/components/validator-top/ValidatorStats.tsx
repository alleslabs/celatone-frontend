import { Flex, Spinner, Text } from "@chakra-ui/react";

import { DotSeparator } from "lib/components/DotSeparator";
import { TooltipInfo } from "lib/components/Tooltip";
import {
  useValidatorDelegators,
  useValidatorStakingProvisions,
} from "lib/services/validator";
import type { Option, Ratio, ValidatorAddr } from "lib/types";
import { divWithDefault, formatPrettyPercent } from "lib/utils";

const StatWithLabel = ({
  label,
  value,
  isLoading,
  tooltipLabel,
}: {
  label: string;
  value: Option<string>;
  isLoading: boolean;
  tooltipLabel?: string;
}) => (
  <Flex
    gap={{ md: 2 }}
    align={{ md: "center" }}
    direction={{ base: "column", md: "row" }}
    flexGrow={{ base: 1, md: 0 }}
  >
    <Text variant="body2" fontWeight={600} color="text.dark">
      {label} {tooltipLabel && <TooltipInfo label={tooltipLabel} />}
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
    <Flex
      alignItems="center"
      gap={2}
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
            tooltipLabel="APR calculated only from the network inflation, not including transaction fees."
          />
        </>
      )}
      <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
      <StatWithLabel
        label="Delegators"
        value={delegatorsCount}
        isLoading={isDelegationsLoading}
      />
    </Flex>
  );
};
