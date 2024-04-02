import type Big from "big.js";

import { big } from "lib/types";
import type {
  Nullable,
  ProposalParams,
  ProposalVotesInfo,
  Ratio,
  Token,
  TokenWithValue,
  U,
} from "lib/types";
import { divWithDefault } from "lib/utils";

export const normalizeVotesInfo = (votesInfo: ProposalVotesInfo) => {
  if (votesInfo.totalVotingPower.eq(0))
    return {
      yes: 0 as Ratio<number>,
      abstain: 0 as Ratio<number>,
      no: 0 as Ratio<number>,
      noWithVeto: 0 as Ratio<number>,
      nonAbstainVotes: 0 as Ratio<number>,
      totalVotes: 0 as Ratio<number>,
      yesNonRatio: 0 as Ratio<number>,
      noNonRatio: 0 as Ratio<number>,
      noWithVetoNonRatio: 0 as Ratio<number>,
      noWithVetoRatio: 0 as Ratio<number>,
    };

  const yes = votesInfo.yes.div(votesInfo.totalVotingPower);
  const abstain = votesInfo.abstain.div(votesInfo.totalVotingPower);
  const no = votesInfo.no.div(votesInfo.totalVotingPower);
  const noWithVeto = votesInfo.noWithVeto.div(votesInfo.totalVotingPower);
  const nonAbstainVotes = yes.add(no).add(noWithVeto);
  const totalVotes = nonAbstainVotes.add(abstain);

  return {
    yes: yes.toNumber() as Ratio<number>,
    abstain: abstain.toNumber() as Ratio<number>,
    no: no.toNumber() as Ratio<number>,
    noWithVeto: noWithVeto.toNumber() as Ratio<number>,
    nonAbstainVotes: nonAbstainVotes.toNumber() as Ratio<number>,
    totalVotes: totalVotes.toNumber() as Ratio<number>,
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
    noWithVetoRatio: divWithDefault(
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
  deposit: Nullable<TokenWithValue[]>,
  minDeposit: TokenWithValue[]
) =>
  minDeposit.map((min) => {
    const current: TokenWithValue = deposit?.find(
      (token) => token.denom === min.denom
    ) ?? {
      ...min,
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
  const { yes, noWithVeto, nonAbstainVotes, totalVotes } =
    normalizeVotesInfo(votesInfo);

  if (divWithDefault(noWithVeto, totalVotes, 0).gte(vetoThreshold))
    return {
      result: "No with veto",
      resultColor: "error.dark",
    };
  if (divWithDefault(yes, nonAbstainVotes, 0).gte(threshold))
    return {
      result: "Yes",
      resultColor: "success.main",
    };
  return {
    result: "No",
    resultColor: "error.main",
  };
};
