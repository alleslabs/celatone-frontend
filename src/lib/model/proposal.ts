import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import { useProposalParams } from "lib/services/proposal";
import { big } from "lib/types";
import type { Coin, Option, ProposalParams, Token, U } from "lib/types";
import {
  coinToTokenWithValue,
  compareTokenWithValues,
  deexponentify,
  formatTokenWithValue,
  getTokenLabel,
} from "lib/utils";

// TODO: remove and use `useDerivedProposalParams` instead
export interface GovParams {
  depositParams: {
    minDeposit: {
      amount: U<Token<Big>>;
      denom: string;
      formattedAmount: Token;
      formattedDenom: string;
      formattedToken: string;
      precision: number;
    };
    minInitialDeposit: Token;
    maxDepositPeriod: string;
    minExpeditedDeposit: Option<Coin[]>;
    minInitialDepositRatio: Option<string>;
  };
  votingParams: {
    votingPeriod: string;
    expeditedVotingPeriod: Option<string>;
  };
}

export const useGovParamsDeprecated = (): {
  data: Option<GovParams>;
  isLoading: boolean;
} => {
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const { data: movePoolInfos } = useMovePoolInfos({ withPrices: false });

  const { data, isLoading } = useProposalParams();

  if (!data) return { data: undefined, isLoading };

  const minDepositParam = data.minDeposit[0];
  const minDepositToken = coinToTokenWithValue(
    minDepositParam.denom,
    minDepositParam.amount,
    assetInfos,
    movePoolInfos
  );
  const minDepositAmount = deexponentify(
    minDepositToken.amount,
    minDepositToken.precision
  ).toFixed() as Token;
  return {
    data: {
      depositParams: {
        minDeposit: {
          ...minDepositParam,
          amount: minDepositToken.amount,
          formattedAmount: minDepositAmount,
          formattedDenom: getTokenLabel(
            minDepositToken.denom,
            minDepositToken.symbol
          ),
          formattedToken: formatTokenWithValue(minDepositToken),
          precision: minDepositToken.precision ?? 0,
        },
        minInitialDeposit: big(data.minInitialDepositRatio)
          .times(minDepositAmount)
          .toFixed(2) as Token,
        maxDepositPeriod: data.maxDepositPeriod,
        minInitialDepositRatio: data.minInitialDepositRatio.toString(),
        minExpeditedDeposit: data.expeditedMinDeposit,
      },
      votingParams: {
        votingPeriod: data.votingPeriod,
        expeditedVotingPeriod: data.expeditedVotingPeriod,
      },
    },
    isLoading,
  };
};

export const useDerivedProposalParams = (
  withPrices = false
): {
  data: Option<ProposalParams>;
  isLoading: boolean;
} => {
  const { data, isLoading } = useProposalParams();
  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices,
  });
  const { data: movePoolInfos, isLoading: isMovePoolInfosLoading } =
    useMovePoolInfos({ withPrices });

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
