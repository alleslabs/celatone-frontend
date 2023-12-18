import { z } from "zod";

export enum TabIndex {
  Overview = "overview",
  Supplies = "supplies",
  Activities = "activities",
  RelatedProposals = "related proposals",
  MutateEvents = "mutate events",
  UniqueHolders = "unique holders",
}

export const zCollectionDetailQueryParams = z.object({
  collectionAddress: z.string(),
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
