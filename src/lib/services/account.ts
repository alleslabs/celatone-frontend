import axios from "axios";
import { z } from "zod";

import { zProjectInfo, zPublicAccountInfo, type Addr } from "lib/types";

const zIcns = z.object({
  names: z.array(z.string()),
  primary_name: z.string(),
});

const zAccountInfo = z
  .object({
    icns: zIcns.nullable(),
    project_info: zProjectInfo.nullable(),
    public_info: zPublicAccountInfo.nullable(),
  })
  .transform((accountInfo) => ({
    icns: accountInfo.icns,
    projectInfo: accountInfo.project_info,
    publicInfo: accountInfo.public_info,
  }));

export type AccountInfo = z.infer<typeof zAccountInfo>;

export const getAccountInfo = async (
  endpoint: string,
  address: Addr
): Promise<AccountInfo> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/info`)
    .then((res) => zAccountInfo.parse(res.data));

const zAccountTableCount = z.object({
  code: z.number().optional(),
  contract_by_admin: z.number().optional(),
  instantiated: z.number().optional(),
  proposal: z.number(),
  tx: z.number(),
});

export type AccountTableCount = z.infer<typeof zAccountTableCount>;

export const getAccountTableCount = async (
  endpoint: string,
  address: string,
  isWasm: boolean
): Promise<AccountTableCount> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/table-count`, {
      params: { is_wasm: isWasm },
    })
    .then((res) => zAccountTableCount.parse(res.data));
