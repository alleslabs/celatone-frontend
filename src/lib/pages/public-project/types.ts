import { z } from "zod";

export enum TabIndex {
  Accounts = "accounts",
  Codes = "codes",
  Contracts = "contracts",
  Modules = "modules",
  Overview = "overview",
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
