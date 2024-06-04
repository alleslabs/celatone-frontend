import { z } from "zod";

import { zProposal, zProposalsResponseItem } from "../proposal";
import { zTxsResponseItem } from "../tx";
import type {
  HexAddr,
  IndexedModule,
  ModuleAbi,
  ModuleData,
  ModuleInfo,
  Option,
} from "lib/types";
import {
  UpgradePolicy,
  zHexAddr,
  zPagination,
  zRemark,
  zUtcDate,
} from "lib/types";
import { indexModuleAbi, parseTxHash, snakeToCamel } from "lib/utils";

const zBaseModuleLcd = z.object({
  address: zHexAddr,
  module_name: z.string(),
  abi: z.string(),
  raw_bytes: z.string(),
  upgrade_policy: z.nativeEnum(UpgradePolicy),
});

const zIndexedModuleLcd = zBaseModuleLcd.transform<IndexedModule>((val) => ({
  ...snakeToCamel(val),
  ...indexModuleAbi(val.abi),
}));

export const zModuleResponseLcd = z.object({
  module: zIndexedModuleLcd,
});

export const zModulesResponseLcd = z.object({
  modules: z.array(zIndexedModuleLcd),
  pagination: zPagination,
});

export const zAccountModulesResponse = z.object({
  items: z.array(zIndexedModuleLcd),
  total: z.number().nonnegative(),
});
export type AccountModulesResponse = z.infer<typeof zAccountModulesResponse>;

export const zModuleVerificationInternal = z
  .object({
    id: z.number(),
    module_address: zHexAddr,
    module_name: z.string(),
    verified_at: z.string(),
    digest: z.string(),
    source: z.string(),
    base64: z.string(),
    chain_id: z.string(),
  })
  .transform(snakeToCamel);
export type ModuleVerificationInternal = z.infer<
  typeof zModuleVerificationInternal
>;

export interface DecodeModuleReturn {
  abi: string;
}

const zModulesResponseItem = z
  .object({
    address: zHexAddr,
    module_name: z.string(),
    height: z.number(),
    latest_updated: zUtcDate,
    is_republished: z.boolean(),
    is_verified: z.boolean(),
  })
  .transform<ModuleInfo>(snakeToCamel);

export const zModulesResponse = z.object({
  items: z.array(zModulesResponseItem),
  total: z.number().nonnegative(),
});
export type ModulesResponse = z.infer<typeof zModulesResponse>;

export const zModuleDataResponse = zBaseModuleLcd
  .extend({
    recent_publish_transaction: z.string().nullable(),
    recent_publish_proposal: zProposal
      .pick({ id: true, title: true })
      .nullish()
      .default(null),
    recent_publish_block_height: z.number().nonnegative(),
    recent_publish_block_timestamp: zUtcDate,
    is_republished: z.boolean(),
  })
  .transform<ModuleData>((val) => ({
    ...snakeToCamel(val),
    ...indexModuleAbi(val.abi),
    recentPublishTransaction: val.recent_publish_transaction
      ? parseTxHash(val.recent_publish_transaction)
      : null,
  }));

export const zModuleTableCountsResponse = z.object({
  txs: z.number().nonnegative().nullable(),
  histories: z.number().nonnegative().nullable(),
  proposals: z.number().nonnegative().nullish().default(null),
});
export type ModuleTableCountsResponse = z.infer<
  typeof zModuleTableCountsResponse
>;

export const zModuleTxsResponse = z.object({
  items: z.array(zTxsResponseItem),
  total: z.number().nonnegative(),
});
export type ModuleTxsResponse = z.infer<typeof zModuleTxsResponse>;

const zModuleHistory = z
  .object({
    remark: zRemark,
    upgrade_policy: z.nativeEnum(UpgradePolicy),
    height: z.number().nonnegative(),
    timestamp: zUtcDate,
    previous_policy: z.nativeEnum(UpgradePolicy).nullable(),
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
  modulePath: string;
  currentPolicy: Option<UpgradePolicy>;
}

export interface ModuleInitialPublishInfo {
  publisherVmAddress: HexAddr;
  createdHeight: Option<number>;
  createdTime: Option<Date>;
  initTxHash: Option<string>;
  initProposalId: Option<number>;
  initProposalTitle: Option<string>;
}
