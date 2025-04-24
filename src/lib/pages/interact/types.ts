import type { Addr } from "lib/types";

import { zAddr } from "lib/types";
import { z } from "zod";

export enum ModuleInteractionMobileStep {
  SelectFunction = "select-function",
  SelectModule = "select-module",
}

export const zInteractQueryParams = z.object({
  address: zAddr.optional().default("" as Addr),
  functionName: z.string().optional().default(""),
  functionType: z.string().optional().default(""),
  moduleName: z.string().optional().default(""),
});
export type InteractQueryParams = z.infer<typeof zInteractQueryParams>;
