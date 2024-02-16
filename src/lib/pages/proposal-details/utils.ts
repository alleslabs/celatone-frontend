import type Big from "big.js";
import big from "big.js";

import type {
  Nullable,
  ProposalParams,
  ProposalVotesInfo,
  Token,
  TokenWithValue,
  U,
} from "lib/types";
import { divWithDefault } from "lib/utils";

export const normalizeVotesInfo = (votesInfo: ProposalVotesInfo) => {
  if (votesInfo.totalVotingPower.eq(0))
    return {
      yes: big(0),
      abstain: big(0),
      no: big(0),
      noWithVeto: big(0),
      nonAbstainVotes: big(0),
      totalVotes: big(0),
    };

  const yes = votesInfo.yes.div(votesInfo.totalVotingPower);
  const abstain = votesInfo.abstain.div(votesInfo.totalVotingPower);
  const no = votesInfo.no.div(votesInfo.totalVotingPower);
  const noWithVeto = votesInfo.noWithVeto.div(votesInfo.totalVotingPower);
  const nonAbstainVotes = yes.add(no).add(noWithVeto);

  return {
    yes,
    abstain,
    no,
    noWithVeto,
    nonAbstainVotes,
    totalVotes: nonAbstainVotes.add(abstain),
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
