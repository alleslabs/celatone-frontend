import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import { useProposalData } from "lib/services/proposal";
import type { Nullable, Option, ProposalData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

interface DerivedProposalDataResponse {
  data: Option<{
    info: Nullable<ProposalData>;
  }>;
  isLoading: boolean;
}

export const useDerivedProposalData = (
  id: number
): DerivedProposalDataResponse => {
  const { data, isLoading } = useProposalData(id);
  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: false,
  });
  const { data: movePoolInfos, isLoading: isMovePoolInfosLoading } =
    useMovePoolInfos({ withPrices: false });

  if (isLoading || isAssetInfosLoading || isMovePoolInfosLoading)
    return {
      data: undefined,
      isLoading: isLoading || isAssetInfosLoading || isMovePoolInfosLoading,
    };

  if (!data)
    return {
      data: undefined,
      isLoading: false,
    };

  if (!data.info)
    return {
      data: {
        info: null,
      },
      isLoading: false,
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
  };
};
