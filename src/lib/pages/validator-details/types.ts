import { z } from "zod";

import { zBechAddr32 } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Votes = "votes",
  Performance = "performance",
  //   Delegators = "delegators",
  BondedTokenChanges = "bondedTokenChanges",
}

export const zValidatorDetailsQueryParams = z.object({
  validatorAddress: zBechAddr32,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
