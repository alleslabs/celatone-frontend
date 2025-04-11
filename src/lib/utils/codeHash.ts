import type { Option } from "lib/types";

import { Sha256 } from "@cosmjs/crypto";

export const getCodeHash = async (wasmFile: Option<File>) => {
  if (wasmFile) {
    const wasmFileBytes = new Sha256(
      new Uint8Array(await wasmFile.arrayBuffer())
    ).digest();
    return Buffer.from(wasmFileBytes).toString("hex");
  }
  return "";
};
