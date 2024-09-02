import type { ProjectConstants } from "./types";

export * from "./types";

export const PROJECT_CONSTANTS: ProjectConstants = {
  maxAccountNameLength: 50,
  maxAccountDescriptionLength: 250,
  maxProposalTitleLength: 255,
  maxCodeNameLength: 50,
  maxContractNameLength: 50,
  maxContractDescriptionLength: 250,
  maxListNameLength: 50,
  maxMoveVerifyTaskRequestNoteLength: 50,
};
