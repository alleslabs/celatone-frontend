import { z } from "zod";

import type { CodeInfo } from "lib/types";
import {
  AccessConfigPermission,
  zBechAddr,
  zPagination,
  zProjectInfo,
  zPublicCodeInfo,
  zUtcDate,
} from "lib/types";
import { parseTxHash, snakeToCamel } from "lib/utils";

export const zUploadAccessParams = z
  .object({
    code_upload_access: z.object({
      permission: z.nativeEnum(AccessConfigPermission),
      addresses: zBechAddr.array(),
    }),
    instantiate_default_permission: z.nativeEnum(AccessConfigPermission),
  })
  .transform((val) => ({
    isPermissionedNetwork:
      val.code_upload_access.permission !== AccessConfigPermission.EVERYBODY,
    ...snakeToCamel(val),
  }));
export type UploadAccessParams = z.infer<typeof zUploadAccessParams>;

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
  .transform<CodeInfo>(snakeToCamel);

export const zCodesResponse = z.object({
  items: z.array(zCodesResponseItem),
  total: z.number().nonnegative(),
});
export type CodesResponse = z.infer<typeof zCodesResponse>;

const zCodesResponseItemRest = z
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

export const zCodesResponseRest = z.object({
  code_infos: z.array(zCodesResponseItemRest),
  pagination: zPagination,
});

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
        created: zUtcDate,
      })
      .nullable(),
    transaction: z
      .object({
        height: z.number(),
        hash: z.string().transform((val) => parseTxHash(val).toUpperCase()),
        created: zUtcDate,
      })
      .nullable(),
    uploader: zBechAddr,
  })
  .transform((val) => ({
    ...snakeToCamel(val),
    hash: parseTxHash(val.hash),
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

export const zCodeInfoResponseRest = z
  .object({
    code_info: z.object({
      code_id: z.coerce.number(),
      creator: zBechAddr,
      data_hash: z.string(),
      instantiate_permission: z.object({
        permission: z.nativeEnum(AccessConfigPermission),
        address: zBechAddr.optional(),
        addresses: z.array(zBechAddr).default([]),
      }),
    }),
  })
  .transform<Code>(
    ({
      code_info: { code_id, creator, data_hash, instantiate_permission },
    }) => ({
      codeId: code_id,
      cw2Contract: null,
      cw2Version: null,
      hash: data_hash,
      instantiatePermission: instantiate_permission.permission,
      permissionAddresses:
        instantiate_permission.address && instantiate_permission.address !== ""
          ? [instantiate_permission.address]
          : instantiate_permission.addresses,
      proposal: null,
      transaction: null,
      uploader: creator,
    })
  );

export const zCodeListResponse = z.object({
  items: z.array(zCodesResponseItem),
});
