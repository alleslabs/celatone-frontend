import { z } from "zod";

import { zValidatorAddr } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Votes = "votes",
  Performance = "performance",
  BondedTokenChanges = "bonded-token-changes",
}

export const zValidatorDetailsQueryParams = z.object({
  validatorAddress: zValidatorAddr,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});

export type ValidatorDetailsQueryParams = z.infer<
  typeof zValidatorDetailsQueryParams
>;
