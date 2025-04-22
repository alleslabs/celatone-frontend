import { zValidatorAddr } from "lib/types";
import { z } from "zod";

export enum TabIndex {
  BondedTokenChanges = "bonded-token-changes",
  Overview = "overview",
  Performance = "performance",
  Votes = "votes",
}

export const zValidatorDetailsQueryParams = z.object({
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
  validatorAddress: zValidatorAddr,
});

export type ValidatorDetailsQueryParams = z.infer<
  typeof zValidatorDetailsQueryParams
>;
