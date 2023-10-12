import { Flex, useDisclosure } from "@chakra-ui/react";

import { AmpEvent, useTrack } from "lib/amplitude";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { useUserDelegationInfos } from "lib/pages/account-details/data";
import type { HumanAddr } from "lib/types";
import { getTokenLabel } from "lib/utils";

import { DelegationInfo } from "./DelegationInfo";
import { DelegationsBody } from "./DelegationsBody";
import { RedelegationsSection } from "./RedelegationsSection";
import { TotalCard } from "./total-card";

interface DelegationsSectionProps {
  walletAddress: HumanAddr;
  onViewMore?: () => void;
}

export const DelegationsSection = ({
  walletAddress,
  onViewMore,
}: DelegationsSectionProps) => {
  const { track } = useTrack();
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

  if (isLoading) return <Loading withBorder />;
  if (!stakingParams)
    return <EmptyState message="Error fetching delegation data" />;

  const redelegationCount = redelegations?.length ?? 0;

  return (
    <Flex
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      position="relative"
      overflow="hidden"
      width="full"
    >
      <Flex
        direction="column"
        gap={4}
        w="full"
        position={isOpen ? "absolute" : "relative"}
        opacity={isOpen ? 0 : 1}
        left={isOpen ? "-100%" : "0"}
        transition="all 0.25s"
      >
        <DelegationInfo
          totalBondedCard={
            <TotalCard
              title="Total Bonded"
              message={`Total delegated and unbonding ${
                stakingParams.bondDenoms.length === 1
                  ? getTokenLabel(
                      stakingParams.bondDenoms[0].denom,
                      stakingParams.bondDenoms[0].symbol
                    )
                  : "tokens"
              }, including those delegated through vesting`}
              address={walletAddress}
              bondDenoms={stakingParams.bondDenoms}
              tokens={totalBonded}
              isLoading={isLoadingTotalBonded}
            />
          }
          otherInfoCards={
            <>
              <TotalCard
                title="Reward"
                message={`Total rewards earned from delegated ${
                  stakingParams.bondDenoms.length === 1
                    ? stakingParams.bondDenoms[0]
                    : "tokens"
                } across all validators`}
                address={walletAddress}
                bondDenoms={stakingParams.bondDenoms}
                tokens={totalRewards}
                isLoading={isLoadingRewards}
              />
              {isValidator && (
                <TotalCard
                  title="Commission"
                  message="Total commission reward earned by validator"
                  address={walletAddress}
                  bondDenoms={stakingParams.bondDenoms}
                  tokens={totalCommission}
                  isLoading={isLoadingTotalCommission}
                />
              )}
            </>
          }
          redelegationCount={redelegationCount}
          onClickToggle={() => {
            track(AmpEvent.USE_SEE_REDELEGATIONS);
            onToggle();
          }}
          onViewMore={onViewMore}
        />
        {!onViewMore && (
          <DelegationsBody
            totalDelegations={totalDelegations}
            delegations={delegations}
            totalUnbondings={totalUnbondings}
            unbondings={unbondings}
            rewards={rewards}
            isLoadingDelegations={isLoadingDelegations || isLoadingRewards}
            isLoadingUnbondings={isLoadingUnbondings}
            bondDenoms={stakingParams.bondDenoms}
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
