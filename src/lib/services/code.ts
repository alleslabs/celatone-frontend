import axios from "axios";
import { z } from "zod";

import { AccessConfigPermission, zBechAddr } from "lib/types";
import type { BechAddr, BechAddr20, CodeInfo, Option } from "lib/types";
import { parseWithError } from "lib/utils";

export interface CodeIdInfoResponse {
  code_info: {
    code_id: string;
    creator: BechAddr;
    data_hash: string;
    instantiate_permission: {
      permission: AccessConfigPermission;
      address: BechAddr;
      addresses: BechAddr[];
    };
  };
  data: string;
}

export const getCodeIdInfo = async (
  endpoint: string,
  id: number
): Promise<CodeIdInfoResponse> => {
  const { data } = await axios.get<CodeIdInfoResponse>(
    `${endpoint}/cosmwasm/wasm/v1/code/${id}`
  );
  return data;
};

const zCodesResponseItem = z
  .object({
    id: z.number().nonnegative(),
    cw2_contract: z.string().nullable(),
    cw2_version: z.string().nullable(),
    uploader: zBechAddr,
    contract_count: z.number().nonnegative(),
    instantiate_permission: z.nativeEnum(AccessConfigPermission),
    permission_addresses: z.array(zBechAddr),
  })
  .transform<CodeInfo>((val) => ({
    id: val.id,
    cw2Contract: val.cw2_contract,
    cw2Version: val.cw2_version,
    uploader: val.uploader,
    contractCount: val.contract_count,
    instantiatePermission: val.instantiate_permission,
    permissionAddresses: val.permission_addresses,
  }));

const zCodesResponse = z.object({
  items: z.array(zCodesResponseItem),
  total: z.number().nonnegative(),
});

export type CodesResponse = z.infer<typeof zCodesResponse>;

export const getCodes = async (
  endpoint: string,
  limit: number,
  offset: number,
  address: Option<BechAddr20>,
  permission: Option<boolean>
): Promise<CodesResponse> =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        address,
        permission,
      },
    })
    .then(({ data }) => parseWithError(zCodesResponse, data));

export const getCodesByAddress = async (
  endpoint: string,
  address: BechAddr,
  limit: number,
  offset: number
): Promise<CodesResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/wasm/codes`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zCodesResponse, data));
