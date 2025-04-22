import { zAddr } from "lib/types";
import { z } from "zod";

export enum TabIndex {
  Admins = "admins",
  Assets = "assets",
  Codes = "codes",
  Contracts = "contracts",
  Delegations = "delegations",
  Modules = "modules",
  Nfts = "nfts",
  Overview = "overview",
  Proposals = "proposals",
  Resources = "resources",
  Txs = "txs",
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
