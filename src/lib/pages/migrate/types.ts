import type { BechAddr, BechAddr32, Option } from "lib/types";

import { zBechAddr32 } from "lib/types";
import { isId } from "lib/utils";
import { z } from "zod";

type MigrateStep = "migrate_contract" | "migrate_options" | "upload_new_code";

export interface MigratePageState {
  admin: Option<BechAddr>;
  codeId: Option<number>;
  contractAddress: BechAddr32;
  migrateStep: MigrateStep;
}

export const zMigrateQueryParams = z.object({
  codeId: z
    .string()
    .transform((val) => (isId(val) ? Number(val) : undefined))
    .optional(),
  contract: zBechAddr32.optional().default("" as BechAddr32),
});
