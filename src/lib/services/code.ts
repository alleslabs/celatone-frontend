import axios from "axios";
import { z } from "zod";

import {
  AccessConfigPermission,
  zBechAddr,
  zProjectInfo,
  zPublicCodeInfo,
} from "lib/types";
import type { BechAddr, BechAddr20, CodeInfo, Option } from "lib/types";
import {
  parseDate,
  parseTxHash,
  parseWithError,
  snakeToCamel,
} from "lib/utils";

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

const zCode = z
  .object({
    code_id: z.number().positive(),
    cw2_contract: z.string().nullable(),
    cw2_version: z.string().nullable(),
    hash: z.string(),
    instantiate_permission: z.nativeEnum(AccessConfigPermission),
    permission_addresses: z.array(zBechAddr),
    proposal: z
      .object({
        id: z.number().positive(),
        height: z.number().positive(),
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
  .transform((val) => ({
    codeId: val.code_id,
    cw2Contract: val.cw2_contract,
    cw2Version: val.cw2_version,
    hash: parseTxHash(val.hash),
    instantiatePermission: val.instantiate_permission,
    permissionAddresses: val.permission_addresses,
    proposal: val.proposal
      ? {
          proposalId: val.proposal.id,
          height: val.proposal.height,
          created: parseDate(val.proposal.created),
        }
      : undefined,
    transaction: val.transaction
      ? {
          height: val.transaction.height,
          hash: parseTxHash(val.transaction.hash),
          created: parseDate(val.transaction.created),
        }
      : undefined,
    uploader: val.uploader,
  }));

export type Code = z.infer<typeof zCode>;

const zCodeData = z
  .object({
    info: zCode,
    project_info: zProjectInfo.nullable(),
    public_info: zPublicCodeInfo.nullable(),
  })
  .transform(snakeToCamel);

export type CodeData = z.infer<typeof zCodeData>;

export const getCodeDataByCodeId = async (
  endpoint: string,
  codeId: number,
  isGov: boolean
): Promise<CodeData> =>
  axios
    .get(`${endpoint}/${codeId}/info`, {
      params: {
        is_gov: isGov,
      },
    })
    .then(({ data }) => parseWithError(zCodeData, data));
