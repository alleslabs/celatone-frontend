import { useInitia } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { indexValidatorsRest } from "lib/pages/validators/utils";
import { useAssetInfos } from "lib/services/assetService";
import {
  useDelegationsByAddressRest,
  useStakingParamsRest,
} from "lib/services/staking";
import { useValidatorsRest } from "lib/services/validator";
import { big } from "lib/types";
import { valoperToAddr } from "lib/utils";
import { useMemo } from "react";

import type { ValidatorDetailsQueryParams } from "../../types";

import { ValidatorOverview } from "../validator-overview";
import { ValidatorTop } from "../validator-top";

export const ValidatorDetailsBodyLite = ({
  validatorAddress,
}: Pick<ValidatorDetailsQueryParams, "validatorAddress">) => {
  const isInitia = useInitia();
  const { data, isLoading } = useValidatorsRest();
  const indexedData = useMemo(() => indexValidatorsRest(data), [data]);
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
    useStakingParamsRest(!isInitia);
  const { data: delegations, isLoading: isDelegationsLoading } =
    useDelegationsByAddressRest(valoperToAddr(validatorAddress));

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
        <CelatoneSeo
          pageName={
            foundValidator.moniker
              ? `${foundValidator.moniker} (Validator)`
              : "Validator detail"
          }
        />
        <ValidatorTop
          info={foundValidator}
          singleStakingDenom={stakingParams?.bondDenom}
          totalVotingPower={totalVotingPower}
        />
      </PageHeaderContainer>
      <PageContainer>
        <ValidatorOverview
          assetInfos={assetInfos}
          details={foundValidator.details}
          isActive={foundValidator.isActive}
          isJailed={foundValidator.isJailed}
          selfVotingPower={
            delegations?.length ? big(delegations[0].balance.amount) : big(0)
          }
          singleStakingDenom={stakingParams?.bondDenom}
          totalVotingPower={totalVotingPower}
          validatorAddress={validatorAddress}
          votingPower={foundValidator.votingPower}
          onSelectBondedTokenChanges={undefined}
          onSelectPerformance={undefined}
          onSelectVotes={undefined}
        />
        <UserDocsLink
          cta="Read more about Validator Details"
          href="general/validators/detail-page"
          title="What is a Validator?"
        />
      </PageContainer>
    </>
  );
};
