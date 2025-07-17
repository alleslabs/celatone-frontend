import type {
  HexAddr,
  IndexedModule,
  ModuleAbi,
  ModuleInfo,
  ModulePublishInfo,
  Option,
} from "lib/types";

import {
  UpgradePolicy,
  zHexAddr,
  zPagination,
  zRemark,
  zUtcDate,
} from "lib/types";
import {
  indexModuleAbi,
  parseTxHash,
  sha256Hex,
  snakeToCamel,
} from "lib/utils";
import { z } from "zod";

import { zProposal, zProposalsResponseItem } from "../proposal";
import { zTxsResponseWithTxResponseItem } from "../tx";

const zBaseModuleRest = z.object({
  abi: z.string(),
  address: zHexAddr,
  module_name: z.string(),
  raw_bytes: z.string(),
  upgrade_policy: z.nativeEnum(UpgradePolicy),
});

const zIndexedModuleRest = zBaseModuleRest.transform<IndexedModule>((val) => ({
  ...snakeToCamel(val),
  ...indexModuleAbi(val.abi),
  digest: sha256Hex(Buffer.from(val.raw_bytes, "utf-8")),
}));

export const zModuleResponseRest = z.object({
  module: zIndexedModuleRest,
});

export const zModulesResponseRest = z.object({
  modules: z.array(zIndexedModuleRest),
  pagination: zPagination,
});

export const zAccountModulesResponse = z.object({
  items: z.array(zIndexedModuleRest),
  total: z.number().nonnegative(),
});
export type AccountModulesResponse = z.infer<typeof zAccountModulesResponse>;

export interface DecodeModuleReturn {
  abi: string;
}

const zModulesResponseItem = z
  .object({
    address: zHexAddr,
    digest: z.string(),
    height: z.number(),
    is_republished: z.boolean(),
    is_verified: z.boolean(),
    latest_updated: zUtcDate,
    module_name: z.string(),
  })
  .transform<ModuleInfo>(snakeToCamel);

export const zModulesResponse = z.object({
  items: z.array(zModulesResponseItem),
  total: z.number().nonnegative(),
});
export type ModulesResponse = z.infer<typeof zModulesResponse>;

export const zModulePublishInfoResponse = z
  .object({
    is_republished: z.boolean(),
    recent_publish_block_height: z.number().nonnegative(),
    recent_publish_block_timestamp: zUtcDate,
    recent_publish_proposal: zProposal
      .pick({ id: true, title: true })
      .nullish(),
    recent_publish_transaction: z.string().nullable(),
  })
  .transform<ModulePublishInfo>((val) => ({
    ...snakeToCamel(val),
    recentPublishTransaction: val.recent_publish_transaction
      ? parseTxHash(val.recent_publish_transaction)
      : null,
  }));

export const zModuleTableCountsResponse = z.object({
  histories: z.number().nonnegative().nullable(),
  proposals: z.number().nonnegative().nullish(),
  txs: z.number().nonnegative().nullable(),
});
export type ModuleTableCountsResponse = z.infer<
  typeof zModuleTableCountsResponse
>;

export const zModuleTxsResponse = z.object({
  items: z.array(zTxsResponseWithTxResponseItem),
});
export type ModuleTxsResponse = z.infer<typeof zModuleTxsResponse>;

const zModuleHistory = z
  .object({
    height: z.number().nonnegative(),
    previous_policy: z.nativeEnum(UpgradePolicy).nullable(),
    remark: zRemark,
    timestamp: zUtcDate,
    upgrade_policy: z.nativeEnum(UpgradePolicy),
  })
  .transform(snakeToCamel);
export type ModuleHistory = z.infer<typeof zModuleHistory>;

export const zModuleHistoriesResponse = z.object({
  items: z.array(zModuleHistory),
  total: z.number().nonnegative(),
});
export type ModuleHistoriesResponse = z.infer<typeof zModuleHistoriesResponse>;

export const zModuleRelatedProposalsResponse = z.object({
  items: z.array(zProposalsResponseItem),
  total: z.number().nonnegative(),
});
export type ModuleRelatedProposalsResponse = z.infer<
  typeof zModuleRelatedProposalsResponse
>;

export interface DecodeModuleQueryResponse {
  abi: ModuleAbi;
  currentPolicy: Option<UpgradePolicy>;
  modulePath: string;
}

export interface ModuleInitialPublishInfo {
  createdHeight: Option<number>;
  createdTime: Option<Date>;
  initProposalId: Option<number>;
  initProposalTitle: Option<string>;
  initTxHash: Option<string>;
  publisherVmAddress: HexAddr;
}

export const zMoveViewJsonResponseRest = z
  .object({
    data: z.string(),
  })
  .transform((val) => JSON.parse(val.data));
