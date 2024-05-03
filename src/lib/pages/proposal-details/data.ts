import { useMobile } from "lib/app-provider";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move";
import { useProposalData, useProposalParams } from "lib/services/wasm/proposal";
import type { Nullable, Option, ProposalData, ProposalParams } from "lib/types";
import { coinToTokenWithValue, compareTokenWithValues } from "lib/utils";

export const useDerivedProposalParams = (): {
  data: Option<ProposalParams>;
  isLoading: boolean;
} => {
  const isMobile = useMobile();
  const { data, isLoading } = useProposalParams();
  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: !isMobile,
  });
  const { data: movePoolInfos, isLoading: isMovePoolInfosLoading } =
    useMovePoolInfos({ withPrices: !isMobile });

  if (isLoading || isAssetInfosLoading || isMovePoolInfosLoading || !data)
    return {
      data: undefined,
      isLoading: isLoading || isAssetInfosLoading || isMovePoolInfosLoading,
    };

  return {
    data: {
      ...data,
      minDeposit: data.minDeposit
        .map((coin) =>
          coinToTokenWithValue(
            coin.denom,
            coin.amount,
            assetInfos,
            movePoolInfos
          )
        )
        .sort(compareTokenWithValues),
      expeditedMinDeposit: data.expeditedMinDeposit
        ?.map((coin) =>
          coinToTokenWithValue(
            coin.denom,
            coin.amount,
            assetInfos,
            movePoolInfos
          )
        )
        .sort(compareTokenWithValues),
      emergencyMinDeposit: data.emergencyMinDeposit
        ?.map((coin) =>
          coinToTokenWithValue(
            coin.denom,
            coin.amount,
            assetInfos,
            movePoolInfos
          )
        )
        .sort(compareTokenWithValues),
    },
    isLoading: false,
  };
};

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
