import { z } from "zod";

import { zBechAddr32 } from "lib/types";
import type { BechAddr, BechAddr32, Option } from "lib/types";

type MigrateStep = "migrate_options" | "upload_new_code" | "migrate_contract";

export interface MigratePageState {
  migrateStep: MigrateStep;
  contractAddress: BechAddr32;
  admin: Option<BechAddr>;
  codeId: string;
}

export const zMigrateQueryParams = z
  .object({
    contract: zBechAddr32.optional().default("" as BechAddr32),
    "code-id": z.string().optional().default(""),
  })
  .transform((val) => ({
    contractAddress: val.contract,
    codeId: val["code-id"],
  }));
