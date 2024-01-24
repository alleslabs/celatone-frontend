import { z } from "zod";

export enum TabIndex {
  Overview = "overview",
  Vote = "vote",
}

export enum VoteTabIndex {
  Deposit = "deposit",
  Voting = "voting",
}

export const zProposalDetailsQueryParams = z.object({
  id: z.coerce.number(),
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
  voteTab: z.union([
    z.nativeEnum(VoteTabIndex),
    z
      .string()
      .optional()
      .transform(() => VoteTabIndex.Deposit),
  ]),
});

export type ProposalDetailsQueryParams = z.infer<
  typeof zProposalDetailsQueryParams
>;
