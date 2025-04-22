import { zHexAddr32 } from "lib/types";
import { z } from "zod";

export enum TabIndex {
  Activities = "activities",
  MutateEvents = "mutate_events",
  Overview = "overview",
  Supplies = "supplies",
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
