import type { StdFee } from "@cosmjs/stargate";

import { z } from "zod";

export interface Fee extends Omit<StdFee, "gas"> {
  gas_limit: string;
}

export const zTxHash = z.string().regex(/^[a-fA-F0-9]{64}$/);
