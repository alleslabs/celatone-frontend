export const voteOption = {
  VOTE_OPTION_UNSPECIFIED: "Empty",
  VOTE_OPTION_YES: "Yes",
  VOTE_OPTION_NO: "No",
  VOTE_OPTION_NO_WITH_VETO: "NoWithVeto",
  VOTE_OPTION_ABSTAIN: "Abstain",
};

export type VoteOption = keyof typeof voteOption;
