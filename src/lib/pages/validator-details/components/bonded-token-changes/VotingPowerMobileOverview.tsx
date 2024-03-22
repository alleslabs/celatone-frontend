import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useValidatorHistoricalPowers } from "lib/services/validatorService";
import type { AssetInfos, Option, ValidatorAddr } from "lib/types";

import { VotingPowerDetails } from "./VotingPowerDetails";

interface VotingPowerMobileOverviewProps {
  validatorAddress: ValidatorAddr;
  singleStakingDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
  onViewMore: () => void;
}

export const VotingPowerMobileOverview = ({
  validatorAddress,
  singleStakingDenom,
  assetInfos,
  onViewMore,
}: VotingPowerMobileOverviewProps) => {
  const { data: historicalPowers, isLoading } =
    useValidatorHistoricalPowers(validatorAddress);

  if (isLoading) return <Loading />;
  if (!historicalPowers) return <ErrorFetching dataName="historical powers" />;

  const assetInfo = singleStakingDenom
    ? assetInfos?.[singleStakingDenom]
    : undefined;

  return (
    <Flex
      backgroundColor="gray.900"
      p={4}
      rounded={8}
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      onClick={onViewMore}
    >
      <VotingPowerDetails
        historicalPowers={historicalPowers}
        singleStakingDenom={singleStakingDenom}
        assetInfo={assetInfo}
      />
      <CustomIcon boxSize={6} m={0} name="chevron-right" color="gray.600" />
    </Flex>
  );
};
