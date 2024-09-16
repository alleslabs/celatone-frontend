import { z } from "zod";

import type { Addr } from "lib/types";
import { zAddr } from "lib/types";

export enum ModuleInteractionMobileStep {
  SelectModule = "select-module",
  SelectFunction = "select-function",
}

export const zInteractQueryParams = z.object({
  address: zAddr.optional().default("" as Addr),
  moduleName: z.string().optional().default(""),
  functionName: z.string().optional().default(""),
  functionType: z.string().optional().default(""),
});
export type InteractQueryParams = z.infer<typeof zInteractQueryParams>;
