import type Big from "big.js";
import type {
  ProposalParams,
  ProposalVotesInfo,
  Ratio,
  Token,
  TokenWithValue,
  U,
} from "lib/types";

import { big } from "lib/types";
import { divWithDefault } from "lib/utils";

export const normalizeVotesInfo = ({
  yes,
  abstain,
  no,
  noWithVeto,
  totalVotingPower,
}: ProposalVotesInfo) => {
  const nonAbstainVotes = yes.add(no).add(noWithVeto);
  const totalVotes = nonAbstainVotes.add(abstain);
  return {
    abstainRatio: totalVotingPower
      ? (divWithDefault(
          abstain,
          totalVotingPower,
          0
        ).toNumber() as Ratio<number>)
      : null,
    nonAbstainRatio: totalVotingPower
      ? (divWithDefault(
          nonAbstainVotes,
          totalVotingPower,
          0
        ).toNumber() as Ratio<number>)
      : null,
    totalRatio: totalVotingPower
      ? (divWithDefault(
          totalVotes,
          totalVotingPower,
          0
        ).toNumber() as Ratio<number>)
      : null,
    yesNonRatio: divWithDefault(
      yes,
      nonAbstainVotes,
      0
    ).toNumber() as Ratio<number>,
    noNonRatio: divWithDefault(
      no,
      nonAbstainVotes,
      0
    ).toNumber() as Ratio<number>,
    noWithVetoNonRatio: divWithDefault(
      noWithVeto,
      nonAbstainVotes,
      0
    ).toNumber() as Ratio<number>,
    noWithVetoTotalRatio: divWithDefault(
      noWithVeto,
      totalVotes,
      0
    ).toNumber() as Ratio<number>,
  };
};

export const extractParams = (
  params: ProposalParams,
  isExpedited: boolean
) => ({
  minDeposit: (isExpedited && params.expeditedMinDeposit) || params.minDeposit,
  quorum: (isExpedited && params.expeditedQuorum) || params.quorum,
  threshold: (isExpedited && params.expeditedThreshold) || params.threshold,
  vetoThreshold: params.vetoThreshold,
});

export const mapDeposit = (
  deposit: TokenWithValue[],
  minDeposit: TokenWithValue[]
) =>
  deposit.map((current) => {
    const min: TokenWithValue = minDeposit.find(
      (token) => token.denom === current.denom
    ) ?? {
      ...current,
      amount: big(0) as U<Token<Big>>,
    };

    return {
      current,
      min,
    };
  });

export const getVoteResult = (
  threshold: number,
  vetoThreshold: number,
  votesInfo: ProposalVotesInfo
) => {
  const { yesNonRatio, noWithVetoTotalRatio } = normalizeVotesInfo(votesInfo);

  if (noWithVetoTotalRatio >= vetoThreshold)
    return {
      result: "No with veto",
      resultColor: "error.dark",
    };
  if (yesNonRatio >= threshold)
    return {
      result: "Yes",
      resultColor: "success.main",
    };
  return {
    result: "No",
    resultColor: "error.main",
  };
};
