import { z } from "zod";

import { big } from "./big";

export const zHex = z.string().regex(/^0x[0-9a-fA-F]*$/, {
  message:
    "Invalid hex string format. Must start with '0x' followed by hex digits.",
});
export type Hex = z.infer<typeof zHex>;

export const zHexBig = zHex.transform((hex) => big(BigInt(hex).toString()));

export const zHexBool = zHex.transform((hex) => parseInt(hex, 16) === 1);

export const zHexUtcDate = zHex.transform(
  (hex) => new Date(parseInt(hex, 16) * 1000)
);
