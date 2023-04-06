import { ProposalStatus } from "lib/types";

export const parseProposalStatus = (status: string): ProposalStatus =>
  status === "Inactive"
    ? ProposalStatus.DEPOSIT_FAILED
    : (status as ProposalStatus);
