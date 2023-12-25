import axios from "axios";
import { z } from "zod";

import { zProjectInfo, zPublicAccountInfo, type Addr } from "lib/types";
import { snakeToCamel } from "lib/utils";

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
    .then(({ data }) => zAccountInfo.parse(data));

const zAccountTableCounts = z
  .object({
    code: z.number().nullish(),
    contract_by_admin: z.number().nullish(),
    instantiated: z.number().nullish(),
    proposal: z.number().nullish(),
    tx: z.number().nullish(),
  })
  .transform(snakeToCamel);

export type AccountTableCounts = z.infer<typeof zAccountTableCounts>;

export const getAccountTableCounts = async (
  endpoint: string,
  address: string,
  isGov: boolean,
  isWasm: boolean
): Promise<AccountTableCounts> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/table-counts`, {
      params: {
        is_gov: isGov,
        is_wasm: isWasm,
      },
    })
    .then(({ data }) => zAccountTableCounts.parse(data));
