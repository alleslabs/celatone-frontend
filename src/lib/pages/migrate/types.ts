import type { BechAddr, BechAddr32, Option } from "lib/types";

type MigrateStep = "migrate_options" | "upload_new_code" | "migrate_contract";

export interface MigratePageState {
  migrateStep: MigrateStep;
  contractAddress: BechAddr32;
  admin: Option<BechAddr>;
  codeId: string;
}
