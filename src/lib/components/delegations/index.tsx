import { Flex, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { TableTitle } from "../table";
import { AmpEvent, track } from "lib/amplitude";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useAccountDelegationInfos } from "lib/model/account";
import type { BechAddr } from "lib/types";
import { getTokenLabel } from "lib/utils";

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
        <TableTitle mb={2} title="Delegations" showCount={false} />
        <ErrorFetching
          dataName="delegation data"
          my={2}
          hasBorderTop={false}
          withBorder
        />
      </Flex>
    );

  const redelegationCount = redelegations?.length ?? 0;

  return (
    <Flex
      width="full"
      mb={{ base: 0, md: 8 }}
      overflow="hidden"
      position="relative"
    >
      <Flex
        gap={8}
        left={isOpen ? "-100%" : "0"}
        w="full"
        direction="column"
        opacity={isOpen ? 0 : 1}
        position={isOpen ? "absolute" : "relative"}
        transition="all 0.25s ease-in-out"
      >
        <DelegationInfo
          hasTotalBonded={totalBonded && Object.keys(totalBonded).length > 0}
          onClickToggle={() => {
            track(AmpEvent.USE_SEE_REDELEGATIONS);
            onToggle();
          }}
          onViewMore={onViewMore}
          otherInfoCards={
            <>
              <TotalCard
                address={address}
                message={`Total rewards earned from delegated ${
                  stakingParams.bondDenoms.length === 1
                    ? getTokenLabel(
                        stakingParams.bondDenoms[0].denom,
                        stakingParams.bondDenoms[0].symbol
                      )
                    : "tokens"
                } across all validators`}
                title="Reward"
                bondDenoms={stakingParams.bondDenoms}
                isLoading={isRewardsLoading}
                isViewMore={Boolean(onViewMore)}
                tokens={totalRewards}
              />
              {isValidator && (
                <TotalCard
                  address={address}
                  message="Total commission reward earned by validator"
                  title="Commission"
                  bondDenoms={stakingParams.bondDenoms}
                  isLoading={isCommissionsLoading}
                  isViewMore={Boolean(onViewMore)}
                  tokens={totalCommissions}
                />
              )}
            </>
          }
          redelegationCount={redelegationCount}
          totalBondedCard={
            <TotalCard
              address={address}
              message={`Total delegated and unbonding ${
                stakingParams.bondDenoms.length === 1
                  ? getTokenLabel(
                      stakingParams.bondDenoms[0].denom,
                      stakingParams.bondDenoms[0].symbol
                    )
                  : "tokens"
              }, including those delegated through vesting`}
              title="Total Bonded"
              bondDenoms={stakingParams.bondDenoms}
              isLoading={isTotalBondedLoading}
              isViewMore={Boolean(onViewMore)}
              tokens={totalBonded}
            />
          }
        />
        {!onViewMore && (
          <DelegationsBody
            rewards={rewards}
            bondDenoms={stakingParams.bondDenoms}
            delegations={delegations}
            isDelegationsLoading={isDelegationsLoading || isRewardsLoading}
            isUnbondingsLoading={isUnbondingsLoading}
            totalDelegations={totalDelegations}
            totalUnbondings={totalUnbondings}
            unbondings={unbondings}
          />
        )}
      </Flex>
      <RedelegationsSection
        left={isOpen ? "0" : "100%"}
        stakingParams={stakingParams}
        w="full"
        isLoading={isRedelegationsLoading}
        onBack={onToggle}
        opacity={isOpen ? 1 : 0}
        position={isOpen ? "relative" : "absolute"}
        redelegations={redelegations ?? []}
        transition="all 0.25s ease-in-out"
      />
    </Flex>
  );
};
