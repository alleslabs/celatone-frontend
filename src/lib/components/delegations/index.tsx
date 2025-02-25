import { Flex, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
import { TableTitle } from "../table";

interface DelegationsSectionProps {
  address: BechAddr;
  onViewMore?: () => void;
}

export const DelegationsSection = ({
  address,
  onViewMore,
}: DelegationsSectionProps) => {
  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const {
    isLoading,
    stakingParams,
    isValidator,
    isTotalBondedLoading,
    totalBonded,
    isDelegationsLoading,
    totalDelegations,
    delegations,
    isUnbondingsLoading,
    totalUnbondings,
    unbondings,
    isRewardsLoading,
    totalRewards,
    rewards,
    isRedelegationsLoading,
    redelegations,
    isCommissionsLoading,
    totalCommissions,
  } = useAccountDelegationInfos(address);

  useEffect(() => {
    onClose();
  }, [onClose, router.query.accountAddress]);

  if (isLoading) return <Loading />;
  if (!stakingParams)
    return (
      <Flex direction="column">
        <TableTitle title="Delegations" mb={2} showCount={false} />
        <ErrorFetching
          dataName="delegation data"
          withBorder
          my={2}
          hasBorderTop={false}
        />
      </Flex>
    );

  const redelegationCount = redelegations?.length ?? 0;

  return (
    <Flex
      mb={{ base: 0, md: 8 }}
      position="relative"
      overflow="hidden"
      width="full"
    >
      <Flex
        direction="column"
        gap={8}
        w="full"
        position={isOpen ? "absolute" : "relative"}
        opacity={isOpen ? 0 : 1}
        left={isOpen ? "-100%" : "0"}
        transition="all 0.25s ease-in-out"
      >
        <DelegationInfo
          hasTotalBonded={totalBonded && Object.keys(totalBonded).length > 0}
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
              address={address}
              bondDenoms={stakingParams.bondDenoms}
              tokens={totalBonded}
              isLoading={isTotalBondedLoading}
              isViewMore={Boolean(onViewMore)}
            />
          }
          otherInfoCards={
            <>
              <TotalCard
                title="Reward"
                message={`Total rewards earned from delegated ${
                  stakingParams.bondDenoms.length === 1
                    ? getTokenLabel(
                        stakingParams.bondDenoms[0].denom,
                        stakingParams.bondDenoms[0].symbol
                      )
                    : "tokens"
                } across all validators`}
                address={address}
                bondDenoms={stakingParams.bondDenoms}
                tokens={totalRewards}
                isLoading={isRewardsLoading}
                isViewMore={Boolean(onViewMore)}
              />
              {isValidator && (
                <TotalCard
                  title="Commission"
                  message="Total commission reward earned by validator"
                  address={address}
                  bondDenoms={stakingParams.bondDenoms}
                  tokens={totalCommissions}
                  isLoading={isCommissionsLoading}
                  isViewMore={Boolean(onViewMore)}
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
            isDelegationsLoading={isDelegationsLoading || isRewardsLoading}
            isUnbondingsLoading={isUnbondingsLoading}
            bondDenoms={stakingParams.bondDenoms}
          />
        )}
      </Flex>
      <RedelegationsSection
        stakingParams={stakingParams}
        redelegations={redelegations ?? []}
        isLoading={isRedelegationsLoading}
        onBack={onToggle}
        w="full"
        position={isOpen ? "relative" : "absolute"}
        opacity={isOpen ? 1 : 0}
        left={isOpen ? "0" : "100%"}
        transition="all 0.25s ease-in-out"
      />
    </Flex>
  );
};
