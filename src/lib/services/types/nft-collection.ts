import type { Addr, Nullable } from "lib/types";

import {
  zAddr,
  zBechAddr,
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
    creator: zAddr,
    description: z.string(),
    id: zAddr,
    name: z.string(),
    uri: z.string(),
  })
  .transform(({ id, ...rest }) => ({
    ...rest,
    collectionAddress: id,
  }));
export type Collection = z.infer<typeof zCollection>;

export const zNftCollectionsResponse = z.object({
  items: z.array(zCollection),
  total: z.number().nonnegative(),
});
export type NftCollectionsResponse = z.infer<typeof zNftCollectionsResponse>;

export interface CollectionByCollectionAddressResponse {
  creatorAddress?: Addr;
  currentSupply?: number;
  description: string;
  name: string;
  uri: string;
}

export const zCollectionByCollectionAddressResponse = z
  .object({
    collection: z
      .object({
        description: z.string(),
        name: z.string(),
        uri: z.string(),
      })
      .nullable(),
  })
  .transform<Nullable<CollectionByCollectionAddressResponse>>((val) => {
    if (!val.collection) {
      return null;
    }

    return {
      creatorAddress: undefined,
      currentSupply: undefined,
      description: val.collection.description,
      name: val.collection.name,
      uri: val.collection.uri,
    };
  });

export const zCollectionCreatorResponse = z
  .object({
    creator: z
      .object({
        creator_address: zAddr,
        height: z.number(),
        timestamp: zUtcDate,
        tx_hash: z.string(),
      })
      .nullable(),
  })
  .transform((val) => {
    if (!val.creator) {
      return null;
    }

    return {
      creatorAddress: val.creator.creator_address,
      height: val.creator.height,
      timestamp: val.creator.timestamp,
      txhash: parseTxHash(val.creator.tx_hash),
    };
  });
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

// #####################################
// ############# SEQUENCER #############
// #####################################

const zCollectionNftsSequencer = z.object({
  handle: zHexAddr32,
  length: z.coerce.number(),
});

const zCollectionSequencer = z.object({
  // Revisit this address type, it can be empty string
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

export const zCollectionsResponseSequencer = z.object({
  collections: z.array(
    zCollectionResponseSequencer.transform<Collection>((val) => ({
      collectionAddress: val.objectAddr,
      ...val.collection,
    }))
  ),
  pagination: zPagination,
});

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
    creatorAddress: val.collection.collection.creator,
    currentSupply: val.collection.collection.nfts.length,
    description: val.collection.collection.description,
    name: val.collection.collection.name,
    uri: val.collection.collection.uri,
  }));

export const zCollectionByCollectionAddressResponseWasm = z
  .object({
    data: z.object({
      creator: zBechAddr,
      description: z.string(),
      image: z.string(),
      royalty_info: z.object({
        payment_address: zBechAddr,
        share: z.string(),
      }),
      start_trading_time: z.string(),
    }),
  })
  .transform((val) => ({
    ...snakeToCamel(val.data),
  }));
