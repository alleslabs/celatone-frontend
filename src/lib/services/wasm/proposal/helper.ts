import { capitalize } from "lodash";

import type { ProposalStatus, ProposalStatusLcd } from "lib/types";

export const mapProposalStatusLcdToProposalStatus = (
  status: ProposalStatusLcd
): ProposalStatus =>
  status
    .replace("PROPOSAL_STATUS_", "")
    .split("_")
    .map((term: string) => capitalize(term.toLowerCase()))
    .join("") as ProposalStatus;
