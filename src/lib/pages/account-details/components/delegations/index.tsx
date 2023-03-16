import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import type Big from "big.js";
import big from "big.js";

import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { useUserDelegationInfos } from "lib/pages/account-details/data";
import type { TokenWithValue } from "lib/pages/account-details/type";
import type { HumanAddr, Option, Token, U, USD } from "lib/types";
import { getTokenLabel } from "lib/utils";

import { DelegationsBody } from "./DelegationsBody";
import { RedelegationsSection } from "./RedelegationsSection";
import { TotalCard } from "./TotalCard";

interface DelegationsSectionProps {
  walletAddress: HumanAddr;
  onViewMore?: () => void;
}

const getTotalBondDenom = (
  total: Option<Record<string, TokenWithValue>>,
  bondDenom: string,
  defaultToken: TokenWithValue
) => (total ? total[bondDenom] ?? defaultToken : undefined);

export const DelegationsSection = ({
  walletAddress,
  onViewMore,
}: DelegationsSectionProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const data = useUserDelegationInfos(walletAddress);

  if (!data) return <Loading />;

  const {
    stakingParams,
    isValidator,
    totalBonded,
    totalDelegations,
    delegations,
    totalUnbondings,
    unbondings,
    totalRewards,
    rewards,
    redelegations,
    totalCommission,
  } = data;

  const bondDenomLabel = getTokenLabel(stakingParams.bondDenom);
  // TODO: support more than one Asset?
  const defaultToken: TokenWithValue = {
    denom: stakingParams.bondDenom,
    amount: big(0) as U<Token<Big>>,
    logo: stakingParams.logo,
    precision: stakingParams.precision,
    value: stakingParams.logo ? (big(0) as USD<Big>) : undefined,
  };

  const totalBondedBondDenom = getTotalBondDenom(
    totalBonded,
    stakingParams.bondDenom,
    defaultToken
  );
  const totalRewardBondDenom = getTotalBondDenom(
    totalRewards,
    stakingParams.bondDenom,
    defaultToken
  );
  const totalCommissionBondDenom = getTotalBondDenom(
    totalCommission,
    stakingParams.bondDenom,
    defaultToken
  );

  const redelegationCount = redelegations?.length ?? 0;

  return (
    <Flex mt={12} position="relative" overflow="hidden">
      <Flex
        direction="column"
        gap={8}
        position={isOpen ? "absolute" : "relative"}
        w="full"
        opacity={isOpen ? 0 : 1}
        left={isOpen ? "-100%" : "0"}
        transition="all 0.25s"
      >
        {onViewMore && (
          <Heading variant="h6" as="h6">
            Delegations
          </Heading>
        )}
        <Flex justify="space-between" alignItems="center" overflowX="scroll">
          <Flex gap={8}>
            <TotalCard
              title="Total Bonded"
              message={`Total delegated and unbonding ${bondDenomLabel}, including those delegated through vesting`}
              token={totalBondedBondDenom}
            />
            <TotalCard
              title="Reward"
              message={`Total rewards earned from delegated ${bondDenomLabel} across all validators`}
              token={totalRewardBondDenom}
            />
            {isValidator && (
              <TotalCard
                title="Commission"
                message="Total commission reward earned by your validator"
                token={totalCommissionBondDenom}
              />
            )}
          </Flex>
          {onViewMore ? (
            <Button
              variant="ghost-gray"
              minW="fit-content"
              rightIcon={<CustomIcon name="chevron-right" />}
              onClick={onViewMore}
            >
              View Delegation Info
            </Button>
          ) : (
            <Button
              variant="ghost-gray"
              minW="fit-content"
              leftIcon={<CustomIcon name="history" color="pebble.400" />}
              rightIcon={<CustomIcon name="chevron-right" color="pebble.400" />}
              isDisabled={!redelegationCount}
              onClick={onToggle}
            >
              See Active Redelegations ({redelegationCount})
            </Button>
          )}
        </Flex>
        {!onViewMore && (
          <DelegationsBody
            totalDelegations={totalDelegations}
            delegations={delegations}
            totalUnbondings={totalUnbondings}
            unbondings={unbondings}
            rewards={rewards}
            defaultToken={defaultToken}
          />
        )}
      </Flex>
      <RedelegationsSection
        stakingParams={stakingParams}
        redelegations={redelegations ?? []}
        onBack={onToggle}
        position={isOpen ? "relative" : "absolute"}
        opacity={isOpen ? 1 : 0}
        left={isOpen ? "0" : "100%"}
        transition="all 0.25s"
      />
    </Flex>
  );
};
