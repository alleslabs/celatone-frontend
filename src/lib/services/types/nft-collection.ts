import { z } from "zod";

import type { MutateEvent } from "lib/types";
import {
  zHexAddr,
  zHexAddr32,
  zPagination,
  zRemark,
  zUtcDate,
} from "lib/types";
import { parseTxHash, snakeToCamel } from "lib/utils";

const zCollection = z
  .object({
    name: z.string(),
    id: zHexAddr32,
    uri: z.string(),
    description: z.string(),
    creator: zHexAddr32,
  })
  .transform((val) => ({
    ...val,
    collectionAddress: val.id,
  }));
export type Collection = z.infer<typeof zCollection>;

export const zNftCollectionsResponse = z.object({
  items: z.array(zCollection),
  total: z.number().nonnegative(),
});
export type NftCollectionsResponse = z.infer<typeof zNftCollectionsResponse>;

export const zCollectionByCollectionAddressResponse = z
  .object({
    name: z.string(),
    description: z.string(),
    uri: z.string(),
    created_height: z.number().nullable(),
    creator_address: zHexAddr,
  })
  .transform(snakeToCamel)
  .optional();
export type CollectionByCollectionAddressResponse = z.infer<
  typeof zCollectionByCollectionAddressResponse
>;

export const zCollectionCreatorResponse = z
  .object({
    creator_address: zHexAddr,
    height: z.number(),
    timestamp: zUtcDate,
    tx_hash: z.string(),
  })
  .transform((val) => ({
    creatorAddress: val.creator_address,
    height: val.height,
    timestamp: val.timestamp,
    txhash: parseTxHash(val.tx_hash),
  }))
  .optional();
export type CollectionCreatorResponse = z.infer<
  typeof zCollectionCreatorResponse
>;

export const zActivity = z
  .object({
    timestamp: zUtcDate,
    txhash: z.string().transform(parseTxHash),
    is_nft_burn: z.boolean(),
    is_nft_mint: z.boolean(),
    is_nft_transfer: z.boolean(),
    token_id: z.string().optional().nullable(),
    nft_address: zHexAddr.optional().nullable(),
    is_collection_create: z.boolean(),
  })
  .transform(snakeToCamel);
export type Activity = z.infer<typeof zActivity>;

export const zActivitiesResponse = z.object({
  items: z.array(zActivity),
  total: z.number().nonnegative(),
});
export type ActivitiesResponse = z.infer<typeof zActivitiesResponse>;

export const zCollectionMutateEventsResponse = z
  .object({
    old_value: z.string(),
    new_value: z.string(),
    mutated_field_name: z.string(),
    remark: zRemark,
    block: z.object({ timestamp: zUtcDate }),
  })
  .transform<MutateEvent>((val) => ({
    oldValue: val.old_value,
    newValue: val.new_value,
    mutatedFieldName: val.mutated_field_name,
    remark: val.remark,
    timestamp: val.block.timestamp,
  }));

export const zMutationEventsCountResponseItem = z
  .object({
    collection_mutation_events_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>(
    (val) => val.collection_mutation_events_aggregate.aggregate.count
  );

export const zUniqueHoldersCountResponseItem = z
  .object({
    nfts_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>((val) => val.nfts_aggregate.aggregate.count);

export const zCollectionsByAccountResponse = z
  .object({
    name: z.string(),
    id: zHexAddr32,
    uri: z.string(),
    nfts_aggregate: z.object({ aggregate: z.object({ count: z.number() }) }),
  })
  .transform((val) => ({
    collectionName: val.name,
    collectionAddress: val.id,
    uri: val.uri,
    hold: val.nfts_aggregate.aggregate.count,
  }));
export type CollectionsByAccountResponse = z.infer<
  typeof zCollectionsByAccountResponse
>;

export const zCollectionsByAccountResponseOld = z
  .object({
    name: z.string(),
    vm_address: z.object({ vm_address: zHexAddr32 }),
    uri: z.string(),
    nfts_aggregate: z.object({ aggregate: z.object({ count: z.number() }) }),
  })
  .transform<CollectionsByAccountResponse>((val) => ({
    collectionName: val.name,
    collectionAddress: val.vm_address.vm_address,
    uri: val.uri,
    hold: val.nfts_aggregate.aggregate.count,
  }));

const zCollectionNftsSequencer = z.object({
  handle: zHexAddr32,
  length: z.coerce.number(),
});

const zCollectionSequencer = z.object({
  creator: zHexAddr32,
  description: z.string(),
  name: z.string(),
  uri: z.string(),
  nfts: zCollectionNftsSequencer,
});

export const zCollectionResponseSequencer = z
  .object({
    object_addr: zHexAddr32,
    collection: zCollectionSequencer,
  })
  .transform(snakeToCamel);

export const zCollectionsByAccountResponseSequencer = z
  .object({
    collections: z.array(zCollectionResponseSequencer),
    pagination: zPagination,
  })
  .transform<CollectionsByAccountResponse[]>(({ collections }) =>
    collections.map((collection) => ({
      collectionName: collection.collection.name,
      collectionAddress: collection.objectAddr,
      uri: collection.collection.uri,
      hold: collection.collection.nfts.length,
    }))
  );
export type CollectionsByAccountResponseSequencer = z.infer<
  typeof zCollectionsByAccountResponseSequencer
>;

export const zCollectionByCollectionAddressResponseSequencer = z
  .object({
    collection: zCollectionResponseSequencer,
  })
  .transform<CollectionByCollectionAddressResponse>((val) => ({
    description: val.collection.collection.description,
    name: val.collection.collection.name,
    uri: val.collection.collection.uri,
    createdHeight: null,
    creatorAddress: val.collection.collection.creator,
  }));
