import { z } from "zod";

import { zBechAddr32 } from "lib/types";
import type { BechAddr, BechAddr32, Option } from "lib/types";
import { isId } from "lib/utils";

export interface MigratePageState {
  admin: Option<BechAddr>;
  codeId: Option<number>;
  contractAddress: BechAddr32;
  migrateStep: MigrateStep;
}

type MigrateStep = "migrate_contract" | "migrate_options" | "upload_new_code";

export const zMigrateQueryParams = z.object({
  codeId: z
    .string()
    .transform((val) => (isId(val) ? Number(val) : undefined))
    .optional(),
  contract: zBechAddr32.optional().default("" as BechAddr32),
});
