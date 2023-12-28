import axios from "axios";
import { z } from "zod";

import { AccessConfigPermission, zAddr } from "lib/types";
import type { Addr, CodeInfo } from "lib/types";

export interface CodeIdInfoResponse {
  code_info: {
    code_id: string;
    creator: Addr;
    data_hash: string;
    instantiate_permission: {
      permission: AccessConfigPermission;
      address: Addr;
      addresses: Addr[];
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
    uploader: zAddr,
    contract_count: z.number().nonnegative(),
    instantiate_permission: z.nativeEnum(AccessConfigPermission),
    permission_addresses: z.array(zAddr),
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

export const getCodesByAddress = async (
  endpoint: string,
  address: Addr,
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
    .then(({ data }) => zCodesResponse.parse(data));
