import { sha256 } from "@cosmjs/crypto";
import { toHex } from "@cosmjs/encoding";

export const createTxHash = (txRaw: string) =>
  toHex(sha256(Uint8Array.from(Buffer.from(txRaw, "base64")))).toUpperCase();
