import { Flex, Heading, useDisclosure } from "@chakra-ui/react";
import type { Big } from "big.js";
import big from "big.js";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { useUserDelegationInfos } from "lib/pages/account-details/data";
import type { HumanAddr, USD } from "lib/types";
import {
  formatPrice,
  getTokenLabel,
  totalValueTokenWithValue,
} from "lib/utils";

import { DelegationInfo } from "./DelegationInfo";
import { DelegationsBody } from "./DelegationsBody";
import { RedelegationsSection } from "./RedelegationsSection";
import type { TotalCardProps } from "./total-card";
import { TotalCard } from "./total-card";
import { TotalCardTop } from "./total-card/TotalCardTop";

interface DelegationsSectionProps {
  walletAddress: HumanAddr;
  onViewMore?: () => void;
}

interface DisplayCardProps extends TotalCardProps {
  isViewMore: boolean;
}

export const DisplayCard = ({
  isViewMore,
  ...totalCardProps
}: DisplayCardProps) =>
  isViewMore ? (
    <Flex direction="column" gap={1} minW="233px">
      <TotalCardTop
        title={totalCardProps.title}
        message={totalCardProps.message}
        fontWeight={600}
      />
      {!totalCardProps.tokens ? (
        <Heading variant="h6" as="h6">
          N/A
        </Heading>
      ) : (
        <Heading variant="h6" as="h6">
          {formatPrice(
            totalValueTokenWithValue(totalCardProps.tokens, big(0) as USD<Big>)
          )}
        </Heading>
      )}
    </Flex>
  ) : (
    <TotalCard {...totalCardProps} />
  );

export const DelegationsSection = ({
  walletAddress,
  onViewMore,
}: DelegationsSectionProps) => {
  const { track } = useTrack();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
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

  useEffect(() => {
    onClose();
  }, [onClose, router.query.accountAddress]);

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
        gap={8}
        w="full"
        position={isOpen ? "absolute" : "relative"}
        opacity={isOpen ? 0 : 1}
        left={isOpen ? "-100%" : "0"}
        transition="all 0.25s"
      >
        <DelegationInfo
          totalBondedCard={
            <DisplayCard
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
              isViewMore={Boolean(onViewMore)}
            />
          }
          otherInfoCards={
            <>
              <DisplayCard
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
                isViewMore={Boolean(onViewMore)}
              />
              {isValidator && (
                <DisplayCard
                  title="Commission"
                  message="Total commission reward earned by validator"
                  address={walletAddress}
                  bondDenoms={stakingParams.bondDenoms}
                  tokens={totalCommission}
                  isLoading={isLoadingTotalCommission}
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
