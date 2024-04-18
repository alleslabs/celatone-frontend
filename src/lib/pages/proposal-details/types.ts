import { z } from "zod";

export enum PeriodState {
  ONGOING,
  FAILED,
  COMPLETE,
  WAITING,
}

export enum TabIndex {
  Overview = "overview",
  Vote = "vote",
}

export const zProposalDetailsQueryParams = z.object({
  proposalId: z.coerce.number(),
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});

export type ProposalDetailsQueryParams = z.infer<
  typeof zProposalDetailsQueryParams
>;
