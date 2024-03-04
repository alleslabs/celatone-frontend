import axios from "axios";
import { z } from "zod";

import {
  AccessConfigPermission,
  zBechAddr,
  zProjectInfo,
  zPublicInfo,
} from "lib/types";
import type {
  BechAddr,
  BechAddr20,
  CodeData,
  CodeInfo,
  Option,
} from "lib/types";
import { parseDateOpt, parseTxHashOpt, parseWithError } from "lib/utils";

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
    .then(({ data }) => zCodesResponse.parse(data));

const zCodeInfo = z
  .object({
    code_id: z.number().nonnegative(),
    cw2_contract: z.string().nullable(),
    cw2_version: z.string().nullable(),
    hash: z.string(),
    instantiate_permission: z.nativeEnum(AccessConfigPermission),
    permission_addresses: z.array(zBechAddr),
    proposal: z
      .object({
        id: z.number(),
        height: z.number(),
        created: z.string(),
      })
      .nullable(),
    transaction: z
      .object({
        height: z.number(),
        hash: z.string(),
        created: z.string(),
      })
      .nullable(),
    uploader: zBechAddr,
  })
  .transform<Partial<CodeData>>((val) => ({
    codeId: val.code_id,
    cw2Contract: val.cw2_contract,
    cw2Version: val.cw2_version,
    hash: parseTxHashOpt(val.hash),
    instantiatePermission: val.instantiate_permission,
    permissionAddresses: val.permission_addresses,
    proposal: val.proposal
      ? {
          proposalId: val.proposal.id,
          height: val.proposal.height,
          created: parseDateOpt(val.proposal.created),
        }
      : undefined,
    transaction: val.transaction
      ? {
          height: val.transaction.height,
          hash: val.transaction.hash,
          created: parseDateOpt(val.transaction.created),
        }
      : undefined,
    uploader: val.uploader,
  }));

const zCodeInfoResponse = z
  .object({
    info: zCodeInfo,
    project_info: zProjectInfo.nullable(),
    public_info: zPublicInfo.nullable(),
  })
  .transform((val) => {
    return {
      info: val.info,
      projectInfo: val.project_info,
      publicInfo: val.public_info,
    };
  });

export type CodeInfoResponse = z.infer<typeof zCodeInfoResponse>;

export const getCodeInfo = async (
  endpoint: string,
  codeId: number,
  isGov: boolean
): Promise<CodeInfoResponse> =>
  axios
    .get(`${endpoint}/${codeId}/info`, {
      params: {
        is_gov: isGov,
      },
    })
    .then(({ data }) => zCodeInfoResponse.parse(data));
