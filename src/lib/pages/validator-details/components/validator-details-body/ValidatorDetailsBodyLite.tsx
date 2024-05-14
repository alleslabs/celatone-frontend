import { useMemo } from "react";

import type { ValidatorDetailsQueryParams } from "../../types";
import { ValidatorOverview } from "../validator-overview";
import { ValidatorTop } from "../validator-top";
import { useInitia } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { indexValidatorsLcd } from "lib/pages/validators/utils";
import { useAssetInfos } from "lib/services/assetService";
import {
  useDelegationsByAddressLcd,
  useStakingParamsLcd,
} from "lib/services/staking";
import { useValidatorsLcd } from "lib/services/validator";
import { big } from "lib/types";
import { valoperToAddr } from "lib/utils";

export const ValidatorDetailsBodyLite = ({
  validatorAddress,
}: Pick<ValidatorDetailsQueryParams, "validatorAddress">) => {
  const isInitia = useInitia();
  const { data, isLoading } = useValidatorsLcd();
  const indexedData = useMemo(() => indexValidatorsLcd(data), [data]);
  const totalVotingPower =
    indexedData?.active.reduce(
      (prev, validator) => prev.add(validator.votingPower),
      big(0)
    ) ?? big(0);
  const foundValidator = useMemo(() => {
    if (!indexedData) return undefined;

    const findActive = indexedData.active.find(
      (validator) => validator.validatorAddress === validatorAddress
    );

    if (findActive) return findActive;

    return indexedData.inactive.find(
      (validator) => validator.validatorAddress === validatorAddress
    );
  }, [indexedData, validatorAddress]);

  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: true,
  });
  const { data: stakingParams, isFetching: isStakingParamsLoading } =
    useStakingParamsLcd(!isInitia);
  const { data: delegations, isLoading: isDelegationsLoading } =
    useDelegationsByAddressLcd(valoperToAddr(validatorAddress));

  if (
    isLoading ||
    isAssetInfosLoading ||
    isStakingParamsLoading ||
    isDelegationsLoading
  )
    return <Loading />;
  if (!data) return <ErrorFetching dataName="validator information" />;
  if (!foundValidator) return <InvalidState title="Validator does not exist" />;

  return (
    <>
      <PageHeaderContainer bgColor="transparent">
        <ValidatorTop
          info={foundValidator}
          totalVotingPower={totalVotingPower}
          singleStakingDenom={stakingParams?.bondDenom}
        />
      </PageHeaderContainer>
      <PageContainer>
        <ValidatorOverview
          validatorAddress={validatorAddress}
          onSelectVotes={undefined}
          onSelectPerformance={undefined}
          onSelectBondedTokenChanges={undefined}
          isActive={foundValidator.isActive}
          isJailed={foundValidator.isJailed}
          details={foundValidator.details}
          singleStakingDenom={stakingParams?.bondDenom}
          assetInfos={assetInfos}
          votingPower={foundValidator.votingPower}
          totalVotingPower={totalVotingPower}
          selfVotingPower={
            delegations?.length ? big(delegations[0].balance.amount) : big(0)
          }
        />
        <UserDocsLink
          title="What is a Validator?"
          cta="Read more about Validator Details"
          href="general/validators/detail-page"
        />
      </PageContainer>
    </>
  );
};
