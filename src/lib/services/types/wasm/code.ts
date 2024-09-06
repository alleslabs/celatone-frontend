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

const zUploadAccessParams = z
  .object({
    permission: z.nativeEnum(AccessConfigPermission),
    addresses: zBechAddr.array(),
  })
  .transform((val) => ({
    isPermissionedNetwork: val.permission !== AccessConfigPermission.EVERYBODY,
    ...val,
  }));
export type UploadAccessParams = z.infer<typeof zUploadAccessParams>;

export const zUploadAccessParamsLcd = z
  .object({
    params: z.object({
      code_upload_access: zUploadAccessParams,
    }),
  })
  .transform<UploadAccessParams>((val) => val.params.code_upload_access);

export const zUploadAccessParamsSubspaceLcd = z
  .object({
    params: z.object({
      subspace: z.literal("wasm"),
      key: z.literal("uploadAccess"),
      value: z
        .string()
        .transform((val) => JSON.parse(val))
        .pipe(zUploadAccessParams),
    }),
  })
  .transform<UploadAccessParams>((val) => val.params.value);

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

export const zCodeInfoResponseLcd = z
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
