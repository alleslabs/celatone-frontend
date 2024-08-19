import { z } from "zod";

import type { Addr } from "lib/types";
import { zAddr } from "lib/types";

export enum ModuleInteractionMobileStep {
  SelectModule = "select-module",
  SelectFunction = "select-function",
}

// TODO: Handle default case
export const zInteractQueryParams = z.object({
  address: zAddr.optional().default("" as Addr),
  moduleName: z.string().optional().default(""),
  functionName: z.string().optional().default(""),
  functionType: z.string().optional().default(""),
});
