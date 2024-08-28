import { z } from "zod";

import { big } from "./big";

export const zHex = z.string().regex(/^0x[0-9a-fA-F]*$/, {
  message:
    "Invalid hex string format. Must start with '0x' followed by hex digits.",
});

export const zHexBig = zHex.transform((hex) => big(BigInt(hex).toString()));
export type HexBig = z.infer<typeof zHexBig>;

export const zHexDate = zHex.transform(
  (hex) => new Date(parseInt(hex, 16) * 1000)
);
