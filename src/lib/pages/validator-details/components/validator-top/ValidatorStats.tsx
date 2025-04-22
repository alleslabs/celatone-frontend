import type { Option, Ratio, ValidatorAddr } from "lib/types";

import { Flex, Spinner, Text } from "@chakra-ui/react";
import { DotSeparator } from "lib/components/DotSeparator";
import { TooltipInfo } from "lib/components/Tooltip";
import {
  useValidatorDelegators,
  useValidatorStakingProvisions,
} from "lib/services/validator";
import { divWithDefault, formatPrettyPercent } from "lib/utils";

const StatWithLabel = ({
  isLoading,
  label,
  tooltipLabel,
  value,
}: {
  isLoading: boolean;
  label: string;
  tooltipLabel?: string;
  value: Option<string>;
}) => (
  <Flex
    align={{ md: "center" }}
    direction={{ base: "column", md: "row" }}
    flexGrow={{ base: 1, md: 0 }}
    gap={{ md: 2 }}
  >
    <Text color="text.dark" fontWeight={600} variant="body2">
      {label} {tooltipLabel && <TooltipInfo label={tooltipLabel} />}
    </Text>
    {isLoading ? (
      <Spinner size="sm" />
    ) : (
      <Text
        color={value ? "text.main" : "text.dark"}
        fontWeight={600}
        variant="body2"
      >
        {value ?? "N/A"}
      </Text>
    )}
  </Flex>
);

interface ValidatorStatsProps {
  commissionRate: Ratio<number>;
  singleStakingDenom: Option<string>;
  totalVotingPower: Big;
  validatorAddress: ValidatorAddr;
}

export const ValidatorStats = ({
  commissionRate,
  singleStakingDenom,
  totalVotingPower,
  validatorAddress,
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
      border={{ base: "1px solid", md: "0px" }}
      borderColor="gray.700"
      borderRadius={4}
      gap={2}
      mb={{ base: 0, md: 1 }}
      mt={{ base: 2, md: 1 }}
      px={{ base: 3, md: 0 }}
      py={{ base: 1, md: 0 }}
    >
      <StatWithLabel
        isLoading={false}
        label="Commission"
        value={formatPrettyPercent(commissionRate, 2, true)}
      />
      {singleStakingDenom && (
        <>
          <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
          <StatWithLabel
            isLoading={isStakingProvisionsLoading}
            label="Estimated APR"
            tooltipLabel="APR calculated only from the network inflation, not including transaction fees."
            value={estimatedApr}
          />
        </>
      )}
      <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
      <StatWithLabel
        isLoading={isDelegationsLoading}
        label="Delegators"
        value={delegatorsCount}
      />
    </Flex>
  );
};
