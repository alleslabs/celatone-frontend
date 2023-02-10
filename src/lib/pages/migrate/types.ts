import type { Addr, ContractAddr, Option } from "lib/types";

type MigrateStep = "migrate_options" | "upload_new_code" | "migrate_contract";

export interface MigratePageState {
  migrateStep: MigrateStep;
  contractAddress: ContractAddr;
  admin: Option<Addr>;
  codeId: string;
}
