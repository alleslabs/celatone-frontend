import { zAddr } from "lib/types";
import { z } from "zod";

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
  // for resource tab
  account: z.string().optional(),
  accountAddress: zAddr,
  selected: z.string().optional(),
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
