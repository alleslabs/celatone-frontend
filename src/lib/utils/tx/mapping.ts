export const voteOption = {
  VOTE_OPTION_ABSTAIN: "Abstain",
  VOTE_OPTION_NO: "No",
  VOTE_OPTION_NO_WITH_VETO: "NoWithVeto",
  VOTE_OPTION_UNSPECIFIED: "Empty",
  VOTE_OPTION_YES: "Yes",
};

export type VoteOption = keyof typeof voteOption;
