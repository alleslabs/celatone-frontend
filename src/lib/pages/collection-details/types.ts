import { z } from "zod";

import { zHexAddr } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Supplies = "supplies",
  Activities = "activities",
  MutateEvents = "mutate_events",
}

export const zCollectionDetailQueryParams = z.object({
  collectionAddress: zHexAddr,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
