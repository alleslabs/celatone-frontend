import { getMaxLengthError } from "./constant";

export const MAX_PROPOSAL_TITLE_LENGTH = 255;
export const getMaxProposalTitleLengthError = (currentLength: number) =>
  getMaxLengthError("Proposal Title", currentLength, MAX_PROPOSAL_TITLE_LENGTH);
