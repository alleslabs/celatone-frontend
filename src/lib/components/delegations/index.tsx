import type { BechAddr } from "lib/types";

import { Flex, useDisclosure } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useAccountDelegationInfos } from "lib/model/account";
import { getTokenLabel } from "lib/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { TableTitle } from "../table";
import { DelegationInfo } from "./DelegationInfo";
import { DelegationsBody } from "./DelegationsBody";
import { RedelegationsSection } from "./RedelegationsSection";
import { TotalCard } from "./total-card";

interface DelegationsSectionProps {
  address: BechAddr;
  onViewMore?: () => void;
}

export const DelegationsSection = ({
  address,
  onViewMore,
}: DelegationsSectionProps) => {
  const router = useRouter();
  const { isOpen, onClose, onToggle } = useDisclosure();

  const {
    delegations,
    isCommissionsLoading,
    isDelegationsLoading,
    isLoading,
    isRedelegationsLoading,
    isRewardsLoading,
    isTotalBondedLoading,
    isUnbondingsLoading,
    isValidator,
    redelegations,
    rewards,
    stakingParams,
    totalBonded,
    totalCommissions,
    totalDelegations,
    totalRewards,
    totalUnbondings,
    unbondings,
  } = useAccountDelegationInfos(address);

  useEffect(() => {
    onClose();
  }, [onClose, router.query.accountAddress]);

  if (isLoading) return <Loading />;
  if (!stakingParams)
    return (
      <Flex direction="column">
        <TableTitle mb={2} showCount={false} title="Delegations" />
        <ErrorFetching
          dataName="delegation data"
          hasBorderTop={false}
          my={2}
          withBorder
        />
      </Flex>
    );

  const redelegationCount = redelegations?.length ?? 0;

  return (
    <Flex
      mb={{ base: 0, md: 8 }}
      overflow="hidden"
      position="relative"
      width="full"
    >
      <Flex
        direction="column"
        gap={8}
        left={isOpen ? "-100%" : "0"}
        opacity={isOpen ? 0 : 1}
        position={isOpen ? "absolute" : "relative"}
        transition="all 0.25s ease-in-out"
        w="full"
      >
        <DelegationInfo
          hasTotalBonded={totalBonded && Object.keys(totalBonded).length > 0}
          otherInfoCards={
            <>
              <TotalCard
                address={address}
                bondDenoms={stakingParams.bondDenoms}
                isLoading={isRewardsLoading}
                isViewMore={Boolean(onViewMore)}
                message={`Total rewards earned from delegated ${
                  stakingParams.bondDenoms.length === 1
                    ? getTokenLabel(
                        stakingParams.bondDenoms[0].denom,
                        stakingParams.bondDenoms[0].symbol
                      )
                    : "tokens"
                } across all validators`}
                title="Reward"
                tokens={totalRewards}
              />
              {isValidator && (
                <TotalCard
                  address={address}
                  bondDenoms={stakingParams.bondDenoms}
                  isLoading={isCommissionsLoading}
                  isViewMore={Boolean(onViewMore)}
                  message="Total commission reward earned by validator"
                  title="Commission"
                  tokens={totalCommissions}
                />
              )}
            </>
          }
          redelegationCount={redelegationCount}
          totalBondedCard={
            <TotalCard
              address={address}
              bondDenoms={stakingParams.bondDenoms}
              isLoading={isTotalBondedLoading}
              isViewMore={Boolean(onViewMore)}
              message={`Total delegated and unbonding ${
                stakingParams.bondDenoms.length === 1
                  ? getTokenLabel(
                      stakingParams.bondDenoms[0].denom,
                      stakingParams.bondDenoms[0].symbol
                    )
                  : "tokens"
              }, including those delegated through vesting`}
              title="Total bonded"
              tokens={totalBonded}
            />
          }
          onClickToggle={() => {
            track(AmpEvent.USE_SEE_REDELEGATIONS);
            onToggle();
          }}
          onViewMore={onViewMore}
        />
        {!onViewMore && (
          <DelegationsBody
            bondDenoms={stakingParams.bondDenoms}
            delegations={delegations}
            isDelegationsLoading={isDelegationsLoading || isRewardsLoading}
            isUnbondingsLoading={isUnbondingsLoading}
            rewards={rewards}
            totalDelegations={totalDelegations}
            totalUnbondings={totalUnbondings}
            unbondings={unbondings}
          />
        )}
      </Flex>
      <RedelegationsSection
        isLoading={isRedelegationsLoading}
        left={isOpen ? "0" : "100%"}
        opacity={isOpen ? 1 : 0}
        position={isOpen ? "relative" : "absolute"}
        redelegations={redelegations ?? []}
        stakingParams={stakingParams}
        transition="all 0.25s ease-in-out"
        w="full"
        onBack={onToggle}
      />
    </Flex>
  );
};
