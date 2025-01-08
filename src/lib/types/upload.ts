import type { AccessType, BechAddr } from "lib/types";

export type SimulateStatus =
  | {
      message: string;
      status: "default";
    }
  | {
      message: string;
      status: "failed";
    }
  | {
      message: string;
      status: "succeeded";
    };

export interface UploadSectionState {
  addresses: Record<"address", BechAddr>[];
  codeName: string;
  permission: AccessType;
  wasmFile?: File;
}
