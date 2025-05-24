import { zAddr } from "lib/types";
import { z } from "zod";

export enum TabIndex {
  Overview = "overview",
  Supplies = "supplies",
  Activities = "activities",
  MutateEvents = "mutate_events",
}

export const zCollectionDetailQueryParams = z.object({
  collectionAddress: zAddr,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
export type CollectionDetailQueryParams = z.infer<
  typeof zCollectionDetailQueryParams
>;
