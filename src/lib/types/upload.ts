import type { AccessType, Addr } from "lib/types";

export type SimulateStatus =
  | {
      status: "succeeded";
      message: string;
    }
  | {
      status: "failed";
      message: string;
    }
  | {
      status: "default";
      message: string;
    };

export interface UploadSectionState {
  wasmFile?: File;
  codeName: string;
  permission: AccessType;
  addresses: Record<"address", Addr>[];
}
