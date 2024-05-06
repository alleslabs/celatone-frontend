import { z } from "zod";

import type { CodeInfo } from "lib/types";
import {
  AccessConfigPermission,
  zBechAddr,
  zPagination,
  zProjectInfo,
  zPublicCodeInfo,
} from "lib/types";
import { parseDate, parseTxHash, snakeToCamel } from "lib/utils";

export const zCodeInfoResponseLcd = z
  .object({
    code_info: z.object({
      code_id: z.string(),
      creator: zBechAddr,
      data_hash: z.string(),
      instantiate_permission: z.object({
        permission: z.nativeEnum(AccessConfigPermission),
        address: zBechAddr.optional(),
        addresses: z.array(zBechAddr).default([]),
      }),
    }),
  })
  .transform(({ code_info: { instantiate_permission, ...rest } }) => ({
    codeInfo: {
      ...snakeToCamel(rest),
      instantiatePermission: {
        permission: instantiate_permission.permission,
        addresses:
          instantiate_permission.address &&
          instantiate_permission.address !== ""
            ? [instantiate_permission.address]
            : instantiate_permission.addresses,
      },
    },
  }));
export type CodeInfoResponseLcd = z.infer<typeof zCodeInfoResponseLcd>;

const zCodesResponseItemLcd = z
  .object({
    code_id: z.coerce.number(),
    creator: zBechAddr,
    instantiate_permission: z.object({
      permission: z.nativeEnum(AccessConfigPermission),
      addresses: z.array(zBechAddr),
    }),
  })
  .transform<CodeInfo>((val) => ({
    id: val.code_id,
    cw2Contract: undefined,
    cw2Version: undefined,
    uploader: val.creator,
    contractCount: undefined,
    instantiatePermission: val.instantiate_permission.permission,
    permissionAddresses: val.instantiate_permission.addresses,
  }));

export const zCodesResponseLcd = z.object({
  code_infos: z.array(zCodesResponseItemLcd),
  pagination: zPagination,
});
export type CodesResponseLcd = z.infer<typeof zCodesResponseLcd>;

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

export const zCodesResponse = z.object({
  items: z.array(zCodesResponseItem),
  total: z.number().nonnegative(),
});
export type CodesResponse = z.infer<typeof zCodesResponse>;

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

export const zCodeData = z
  .object({
    info: zCode,
    project_info: zProjectInfo.nullable(),
    public_info: zPublicCodeInfo.nullable(),
  })
  .transform(snakeToCamel);
export type CodeData = z.infer<typeof zCodeData>;
