import axios from "axios";
import { z } from "zod";

import { zProjectInfo, zPublicAccountInfo } from "lib/types";
import type { BechAddr } from "lib/types";
import { parseWithError, snakeToCamel } from "lib/utils";

const zIcns = z.object({
  names: z.array(z.string()),
  primary_name: z.string(),
});

const zAccountData = z
  .object({
    icns: zIcns.nullable(),
    project_info: zProjectInfo.nullable(),
    public_info: zPublicAccountInfo.nullable(),
  })
  .transform(snakeToCamel);

export type AccountData = z.infer<typeof zAccountData>;

export const getAccountData = async (
  endpoint: string,
  address: BechAddr
): Promise<AccountData> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/info`)
    .then(({ data }) => parseWithError(zAccountData, data));

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
    .then(({ data }) => parseWithError(zAccountTableCounts, data));
