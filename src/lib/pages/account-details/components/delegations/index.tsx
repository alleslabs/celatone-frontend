import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import type Big from "big.js";
import big from "big.js";

import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { useUserDelegationInfos } from "lib/pages/account-details/data";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type {
  HumanAddr,
  Option,
  Token,
  TokenWithValue,
  U,
  USD,
} from "lib/types";
import { getTokenLabel } from "lib/utils";

import { DelegationsBody } from "./DelegationsBody";
import { RedelegationsSection } from "./RedelegationsSection";
import { TotalCard } from "./TotalCard";

interface DelegationsSectionProps {
  walletAddress: HumanAddr;
  onViewMore?: () => void;
}

const getTotalBondDenom = (
  totals: Option<Record<string, TokenWithValue>>[],
  bondDenom: string,
  defaultToken: TokenWithValue
) =>
  totals.map((total) => (total ? total[bondDenom] ?? defaultToken : undefined));

export const DelegationsSection = ({
  walletAddress,
  onViewMore,
}: DelegationsSectionProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const {
    stakingParams,
    isValidator,
    isLoading,
    totalBonded,
    isLoadingTotalBonded,
    totalDelegations,
    delegations,
    isLoadingDelegations,
    totalUnbondings,
    unbondings,
    isLoadingUnbondings,
    totalRewards,
    rewards,
    isLoadingRewards,
    redelegations,
    isLoadingRedelegations,
    totalCommission,
    isLoadingTotalCommission,
  } = useUserDelegationInfos(walletAddress);

  if (isLoading) return <Loading />;
  if (!stakingParams)
    return <EmptyState message="Error fetching delegation data" withBorder />;

  const bondDenomLabel = getTokenLabel(stakingParams.bondDenom);
  // TODO: support more than one Asset?
  const defaultToken: TokenWithValue = {
    denom: stakingParams.bondDenom,
    amount: big(0) as U<Token<Big>>,
    symbol: stakingParams.symbol,
    logo: stakingParams.logo,
    precision: stakingParams.precision,
    value: stakingParams.logo ? (big(0) as USD<Big>) : undefined,
  };

  const [totalBondedBondDenom, totalRewardBondDenom, totalCommissionBondDenom] =
    getTotalBondDenom(
      [totalBonded, totalRewards, totalCommission],
      stakingParams.bondDenom,
      defaultToken
    );

  const redelegationCount = redelegations?.length ?? 0;

  return (
    <Flex mt={8} pb={8} position="relative" overflow="hidden" width="full">
      <Flex
        direction="column"
        gap={8}
        w="full"
        position={isOpen ? "absolute" : "relative"}
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
              isLoading={isLoadingTotalBonded}
            />
            <TotalCard
              title="Reward"
              message={`Total rewards earned from delegated ${bondDenomLabel} across all validators`}
              token={totalRewardBondDenom}
              isLoading={isLoadingRewards}
            />
            {isValidator && (
              <TotalCard
                title="Commission"
                message="Total commission reward earned by your validator"
                token={totalCommissionBondDenom}
                isLoading={isLoadingTotalCommission}
              />
            )}
          </Flex>
          {onViewMore ? (
            <Button
              variant="ghost-gray"
              minW="fit-content"
              rightIcon={<CustomIcon name="chevron-right" />}
              onClick={() => {
                AmpTrack(AmpEvent.USE_VIEW_MORE);
                onViewMore();
              }}
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
              onClick={() => {
                AmpTrack(AmpEvent.USE_SEE_REDELEGATIONS);
                onToggle();
              }}
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
            isLoadingDelegations={isLoadingDelegations}
            isLoadingUnbondings={isLoadingUnbondings}
            defaultToken={defaultToken}
          />
        )}
      </Flex>
      <RedelegationsSection
        stakingParams={stakingParams}
        redelegations={redelegations ?? []}
        isLoading={isLoadingRedelegations}
        onBack={onToggle}
        w="full"
        position={isOpen ? "relative" : "absolute"}
        opacity={isOpen ? 1 : 0}
        left={isOpen ? "0" : "100%"}
        transition="all 0.25s"
      />
    </Flex>
  );
};
