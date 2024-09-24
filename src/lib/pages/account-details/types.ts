import { z } from "zod";

import { zAddr } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Assets = "assets",
  Delegations = "delegations",
  Nfts = "nfts",
  Txs = "txs",
  Codes = "codes",
  Contracts = "contracts",
  Admins = "admins",
  Resources = "resources",
  Modules = "modules",
  Proposals = "proposals",
}

export const zAccountDetailsQueryParams = z.object({
  accountAddress: zAddr,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
  // for resource tab
  account: z.string().optional(),
  selected: z.string().optional(),
});
