import {
  Addr,
  Nullable,
  zAddr,
  zHexAddr,
  zHexAddr32,
  zPagination,
  zRemark,
  zUtcDate,
} from "lib/types";
import { parseTxHash, snakeToCamel } from "lib/utils";
import { z } from "zod";

const zCollection = z
  .object({
    creator: zHexAddr32,
    description: z.string(),
    id: zHexAddr32,
    name: z.string(),
    uri: z.string(),
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

export interface CollectionByCollectionAddressResponse {
  createdHeight: Nullable<number>;
  creatorAddress?: Addr;
  currentSupply?: number;
  description: string;
  name: string;
  uri: string;
}

export const zCollectionByCollectionAddressResponse = z
  .object({
    description: z.string(),
    name: z.string(),
    uri: z.string(),
  })
  .transform<CollectionByCollectionAddressResponse>((val) => ({
    createdHeight: null,
    creatorAddress: undefined,
    currentSupply: undefined,
    description: val.description,
    name: val.name,
    uri: val.uri,
  }));

export const zCollectionCreatorResponse = z
  .object({
    creator_address: zAddr,
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
    is_collection_create: z.boolean(),
    is_nft_burn: z.boolean(),
    is_nft_mint: z.boolean(),
    is_nft_transfer: z.boolean(),
    nft_address: zHexAddr.nullish(),
    timestamp: zUtcDate,
    token_id: z.string().nullish(),
    txhash: z.string().transform(parseTxHash),
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
    mutated_field_name: z.string(),
    new_value: z.string(),
    old_value: z.string(),
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
    // Revisit this address type
    collection_address: zHexAddr32,
    collection_name: z.string(),
    hold: z.number(),
    uri: z.string(),
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
  // Revisit this address type
  creator: zHexAddr32,
  description: z.string(),
  name: z.string(),
  nfts: zCollectionNftsSequencer,
  uri: z.string(),
});

export const zCollectionResponseSequencer = z
  .object({
    collection: zCollectionSequencer,
    object_addr: zHexAddr32,
  })
  .transform(snakeToCamel);

export const zCollectionsByAccountAddressResponseSequencer = z
  .object({
    collections: z.array(zCollectionResponseSequencer),
    pagination: zPagination,
  })
  .transform<CollectionsByAccountAddressResponse>(({ collections }) => ({
    items: collections.map((collection) => ({
      collectionAddress: collection.objectAddr,
      collectionName: collection.collection.name,
      hold: collection.collection.nfts.length,
      uri: collection.collection.uri,
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
    createdHeight: null,
    creatorAddress: val.collection.collection.creator,
    currentSupply: val.collection.collection.nfts.length,
    description: val.collection.collection.description,
    name: val.collection.collection.name,
    uri: val.collection.collection.uri,
  }));
