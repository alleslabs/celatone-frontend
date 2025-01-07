import type { StdFee } from "@cosmjs/stargate";

export type CardTheme = "gray" | "primary";

export type SimulateStatus = "completed" | "failed" | "pending";

export type Status = "error" | "info" | "init";

export interface UploadSectionState {
  codeName: string;
  estimatedFee?: StdFee;
  simulateError: string;
  simulateStatus: SimulateStatus;
  wasmFile?: File;
}
