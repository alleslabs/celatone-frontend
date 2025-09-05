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
import { z } from "zod";

export const zUploadAccessParams = z
  .object({
    params: z.object({
      code_upload_access: z.object({
        addresses: zBechAddr.array(),
        permission: z.nativeEnum(AccessConfigPermission),
      }),
      instantiate_default_permission: z.nativeEnum(AccessConfigPermission),
    }),
  })
  .transform((val) => ({
    isPermissionedNetwork:
      val.params.code_upload_access.permission !==
      AccessConfigPermission.EVERYBODY,
    ...snakeToCamel(val.params),
  }));
export type UploadAccessParams = z.infer<typeof zUploadAccessParams>;

const zCodesResponseItem = z
  .object({
    contract_count: z.number().nonnegative(),
    cw2_contract: z.string().nullable(),
    cw2_version: z.string().nullable(),
    id: z.number().nonnegative(),
    instantiate_permission: z.nativeEnum(AccessConfigPermission),
    permission_addresses: z.array(zBechAddr),
    uploader: zBechAddr,
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
      addresses: z.array(zBechAddr),
      permission: z.nativeEnum(AccessConfigPermission),
    }),
  })
  .transform<CodeInfo>((val) => ({
    contractCount: undefined,
    cw2Contract: undefined,
    cw2Version: undefined,
    id: val.code_id,
    instantiatePermission: val.instantiate_permission.permission,
    permissionAddresses: val.instantiate_permission.addresses,
    uploader: val.creator,
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
        created: zUtcDate,
        height: z.number().positive(),
        id: z.number().positive(),
      })
      .nullable(),
    transaction: z
      .object({
        created: zUtcDate,
        hash: z.string().transform((val) => parseTxHash(val).toUpperCase()),
        height: z.number(),
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
        address: zBechAddr.optional(),
        addresses: z.array(zBechAddr).default([]),
        permission: z.nativeEnum(AccessConfigPermission),
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
