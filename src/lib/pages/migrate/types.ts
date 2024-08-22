import { z } from "zod";

import { zBechAddr32 } from "lib/types";
import type { BechAddr, BechAddr32, Option } from "lib/types";
import { isId } from "lib/utils";

type MigrateStep = "migrate_options" | "upload_new_code" | "migrate_contract";

export interface MigratePageState {
  migrateStep: MigrateStep;
  contractAddress: BechAddr32;
  admin: Option<BechAddr>;
  codeId: Option<number>;
}

export const zMigrateQueryParams = z.object({
  contract: zBechAddr32.optional().default("" as BechAddr32),
  codeId: z
    .string()
    .transform((val) => (isId(val) ? Number(val) : undefined))
    .optional(),
});
