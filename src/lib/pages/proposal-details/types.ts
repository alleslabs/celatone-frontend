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

export enum PeriodIndex {
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
  period: z.union([
    z.nativeEnum(PeriodIndex),
    z
      .string()
      .optional()
      .transform(() => undefined),
  ]),
});

export type ProposalDetailsQueryParams = z.infer<
  typeof zProposalDetailsQueryParams
>;
