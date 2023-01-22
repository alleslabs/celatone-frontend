import type { StdFee } from "@cosmjs/stargate";

export type SimulateStatus = "Pending" | "Completed" | "Failed";

export interface UploadSectionState {
  wasmFile?: File;
  codeDesc: string;
  estimatedFee?: StdFee;
  simulateStatus: SimulateStatus;
  simulateError: string;
}
