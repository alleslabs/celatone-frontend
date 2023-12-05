import { z } from "zod";

import { zAddr } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Assets = "assets",
  Delegations = "delegations",
  Txs = "txs",
  Codes = "codes",
  Contracts = "contracts",
  Admins = "admins",
  Resources = "resources",
  Modules = "modules",
  Proposals = "proposals",
}

export const zAccDetailQueryParams = z.object({
  accountAddress: zAddr,
  // Remark: Didn't use enum here because we want to allow for redirect to overview
  tab: z.string().default(TabIndex.Overview),
});
