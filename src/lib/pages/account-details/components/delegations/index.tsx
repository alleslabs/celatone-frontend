import { Flex, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
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
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
  const {
    isLoading,
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
  } = useUserDelegationInfos(walletAddress);

  useEffect(() => {
    onClose();
  }, [onClose, router.query.accountAddress]);

  if (isLoading) return <Loading />;
  if (!stakingParams)
    return (
      <ErrorFetching message="There is an error during fetching delegation data" />
    );

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
        gap={8}
        w="full"
        position={isOpen ? "absolute" : "relative"}
        opacity={isOpen ? 0 : 1}
        left={isOpen ? "-100%" : "0"}
        transition="all 0.25s ease-in-out"
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
              isLoading={isLoading}
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
                address={walletAddress}
                bondDenoms={stakingParams.bondDenoms}
                tokens={totalRewards}
                isLoading={isLoading}
                isViewMore={Boolean(onViewMore)}
              />
              {isValidator && (
                <TotalCard
                  title="Commission"
                  message="Total commission reward earned by validator"
                  address={walletAddress}
                  bondDenoms={stakingParams.bondDenoms}
                  tokens={totalCommission}
                  isLoading={isLoading}
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
            isLoading={isLoading}
            bondDenoms={stakingParams.bondDenoms}
          />
        )}
      </Flex>
      <RedelegationsSection
        stakingParams={stakingParams}
        redelegations={redelegations ?? []}
        isLoading={isLoading}
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
