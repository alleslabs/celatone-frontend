import { useGovConfig, useTierConfig } from "lib/app-provider";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import {
  useProposalData,
  useProposalDataRest,
  useProposalDepositsRest,
  useProposalVotesInfo,
} from "lib/services/proposal";
import type {
  Nullable,
  Option,
  ProposalData,
  ProposalVotesInfo,
} from "lib/types";
import { ProposalStatus } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

interface DerivedProposalDataResponse {
  data: Option<{
    info: Nullable<ProposalData>;
  }>;
  isLoading: boolean;
  isDepositsLoading: boolean;
}

export const useDerivedProposalData = (
  id: number
): DerivedProposalDataResponse => {
  const { isFullTier } = useTierConfig();
  const { data: dataApi, isLoading: isApiLoading } = useProposalData(
    id,
    isFullTier
  );
  const { data: dataRest, isLoading: isRestLoading } = useProposalDataRest(
    id,
    !isFullTier
  );
  const { data: dataDepositsRest, isLoading: isDepositsRestLoading } =
    useProposalDepositsRest(id, !isFullTier);

  const [data, isLoading, isDepositsLoading] = isFullTier
    ? [dataApi, isApiLoading, isApiLoading]
    : [
        dataRest
          ? {
              info: {
                ...dataRest,
                proposalDeposits: dataDepositsRest ?? [],
              },
            }
          : undefined,
        isRestLoading,
        isDepositsRestLoading,
      ];

  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: false,
  });
  const { data: movePoolInfos, isLoading: isMovePoolInfosLoading } =
    useMovePoolInfos({ withPrices: false });

  if (isLoading || isAssetInfosLoading || isMovePoolInfosLoading)
    return {
      data: undefined,
      isLoading: isLoading || isAssetInfosLoading || isMovePoolInfosLoading,
      isDepositsLoading:
        isDepositsLoading || isAssetInfosLoading || isMovePoolInfosLoading,
    };

  if (!data)
    return {
      data: undefined,
      isLoading: false,
      isDepositsLoading: false,
    };

  if (!data.info)
    return {
      data: {
        info: null,
      },
      isLoading: false,
      isDepositsLoading: false,
    };

  return {
    data: {
      info: {
        ...data.info,
        proposalDeposits: data.info.proposalDeposits.map((deposit) => ({
          ...deposit,
          amount: deposit.amount.map((coin) =>
            coinToTokenWithValue(
              coin.denom,
              coin.amount,
              assetInfos,
              movePoolInfos
            )
          ),
        })),
        totalDeposit:
          data.info.totalDeposit?.map((coin) =>
            coinToTokenWithValue(
              coin.denom,
              coin.amount,
              assetInfos,
              movePoolInfos
            )
          ) ?? null,
      },
    },
    isLoading: false,
    isDepositsLoading,
  };
};

interface DerivedProposalVotesInfoResponse {
  data: Option<ProposalVotesInfo>;
  isLoading: boolean;
}
export const useDerivedProposalVotesInfo = (
  id: number,
  proposalData: DerivedProposalDataResponse["data"],
  isProposalDataLoading: boolean
): DerivedProposalVotesInfoResponse => {
  const gov = useGovConfig({ shouldRedirect: false });
  const disableVotingPeriodTally = gov.enabled && gov.disableVotingPeriodTally;

  const isVotingPeriod =
    proposalData?.info?.status === ProposalStatus.VOTING_PERIOD;

  const { data, isFetching } = useProposalVotesInfo(
    id,
    isVotingPeriod && !disableVotingPeriodTally
  );

  if (!isVotingPeriod) {
    return {
      data: proposalData?.info?.finalTallyResult,
      isLoading: isProposalDataLoading,
    };
  }

  return {
    data,
    isLoading: isFetching,
  };
};
