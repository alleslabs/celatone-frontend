import { z } from "zod";

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
    token_id: z.string().nullish(),
    nft_address: zHexAddr.nullish(),
    is_collection_create: z.boolean(),
  })
  .transform(snakeToCamel);
export type Activity = z.infer<typeof zActivity>;

export const zActivitiesResponse = z.object({
  items: z.array(zActivity),
  total: z.number().nonnegative(),
});
export type ActivitiesResponse = z.infer<typeof zActivitiesResponse>;

const zCollectionMutateEventItemResponse = z
  .object({
    old_value: z.string(),
    new_value: z.string(),
    mutated_field_name: z.string(),
    remark: zRemark,
    timestamp: zUtcDate,
  })
  .transform(snakeToCamel);

export const zCollectionMutateEventsResponse = z.object({
  items: z.array(zCollectionMutateEventItemResponse),
  total: z.number().nonnegative(),
});
export type CollectionMutateEventsResponse = z.infer<
  typeof zCollectionMutateEventsResponse
>;

const zCollectionByAccountItemResponse = z
  .object({
    collection_name: z.string(),
    collection_address: zHexAddr32,
    uri: z.string(),
    hold: z.number(),
  })
  .transform(snakeToCamel);

export const zCollectionsByAccountAddressResponse = z
  .object({
    items: z.array(zCollectionByAccountItemResponse),
  })
  .transform(({ items }) => ({
    items: items.filter((item) => item.hold > 0),
  }));
export type CollectionsByAccountAddressResponse = z.infer<
  typeof zCollectionsByAccountAddressResponse
>;

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

export const zCollectionsByAccountAddressResponseSequencer = z
  .object({
    collections: z.array(zCollectionResponseSequencer),
    pagination: zPagination,
  })
  .transform<CollectionsByAccountAddressResponse>(({ collections }) => ({
    items: collections.map((collection) => ({
      collectionName: collection.collection.name,
      collectionAddress: collection.objectAddr,
      uri: collection.collection.uri,
      hold: collection.collection.nfts.length,
    })),
  }));
export type CollectionsByAccountAddressResponseSequencer = z.infer<
  typeof zCollectionsByAccountAddressResponseSequencer
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
