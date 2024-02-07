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

export const normalizeVotesInfo = (votesInfo: ProposalVotesInfo) => {
  const yes = votesInfo.yes.div(votesInfo.totalVotingPower);
  const abstain = votesInfo.abstain.div(votesInfo.totalVotingPower);
  const no = votesInfo.no.div(votesInfo.totalVotingPower);
  const noWithVeto = votesInfo.noWithVeto.div(votesInfo.totalVotingPower);

  return {
    yes,
    abstain,
    no,
    noWithVeto,
    currentTotalVotes: yes.add(abstain).add(no).add(noWithVeto),
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
