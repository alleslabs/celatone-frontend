import type { AccessType, Addr } from "lib/types";

export type SimulateStatus = "pending" | "completed" | "failed" | "default";

export interface UploadSectionState {
  wasmFile?: File;
  codeName: string;
  permission: AccessType;
  addresses: Record<"address", Addr>[];
}
