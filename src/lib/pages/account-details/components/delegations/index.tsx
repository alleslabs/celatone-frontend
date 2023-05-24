import { Flex, useDisclosure } from "@chakra-ui/react";
import type Big from "big.js";
import big from "big.js";

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

import { DelegationInfo } from "./DelegationInfo";
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
    return <EmptyState message="Error fetching delegation data" />;

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

  const TotalBondedCard = (
    <TotalCard
      title="Total Bonded"
      message={`Total delegated and unbonding ${bondDenomLabel}, including those delegated through vesting`}
      token={totalBondedBondDenom}
      isLoading={isLoadingTotalBonded}
    />
  );

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
          TotalBondedCard={TotalBondedCard}
          infoCards={
            <>
              {TotalBondedCard}
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
            </>
          }
          onViewMore={onViewMore}
          redelegationCount={redelegationCount}
          onClickToggle={() => {
            AmpTrack(AmpEvent.USE_SEE_REDELEGATIONS);
            onToggle();
          }}
        />
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
