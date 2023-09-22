import { Sha256 } from "@cosmjs/crypto";

/** Convenience function equivalent to `new Sha256(data).digest()` */
export const sha256 = (data: Uint8Array): Uint8Array => {
  return new Sha256(data).digest();
};

export const sha256Hex = (data: Uint8Array): string => {
  return Buffer.from(sha256(data)).toString("hex");
};
