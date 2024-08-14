import type { StdFee } from "@cosmjs/stargate";

export type SimulateStatus = "pending" | "completed" | "failed";

export type CardTheme = "primary" | "secondary";

export type Status = "error" | "info" | "init";

export interface UploadSectionState {
  wasmFile?: File;
  codeName: string;
  estimatedFee?: StdFee;
  simulateStatus: SimulateStatus;
  simulateError: string;
}
