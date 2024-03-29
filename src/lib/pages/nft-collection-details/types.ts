import { z } from "zod";

import { zHexAddr32 } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Supplies = "supplies",
  Activities = "activities",
  MutateEvents = "mutate_events",
}

export const zCollectionDetailQueryParams = z.object({
  collectionAddress: zHexAddr32,
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
