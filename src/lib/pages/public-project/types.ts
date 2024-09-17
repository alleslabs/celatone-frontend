import { z } from "zod";

export enum TabIndex {
  Overview = "overview",
  Codes = "codes",
  Contracts = "contracts",
  Accounts = "accounts",
  Modules = "modules",
}

export const zProjectDetailsQueryParams = z.object({
  slug: z.string(),
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
