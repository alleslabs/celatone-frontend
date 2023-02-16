import type { StdFee } from "@cosmjs/stargate";

export type SimulateStatus = "pending" | "completed" | "failed";

export interface UploadSectionState {
  wasmFile?: File;
  codeDesc: string;
  estimatedFee?: StdFee;
  simulateStatus: SimulateStatus;
  simulateError: string;
}
