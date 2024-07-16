import { z } from "zod";

import type { MutateEvent } from "lib/types";
import { zHexAddr, zHexAddr32, zRemark, zUtcDate } from "lib/types";
import { parseTxHash } from "lib/utils";

const zCollection = z
  .object({
    name: z.string(),
    id: zHexAddr32,
    uri: z.string(),
    description: z.string(),
    creator: zHexAddr32,
  })
  .transform((val) => ({
    description: val.description,
    uri: val.uri,
    name: val.name,
    collectionAddress: val.id,
    creator: val.creator,
  }));
export type Collection = z.infer<typeof zCollection>;

const zCollectionOld = z
  .object({
    name: z.string(),
    vm_address: z.object({ vm_address: zHexAddr32 }),
    uri: z.string(),
    description: z.string(),
    vmAddressByCreator: z.object({ vm_address: zHexAddr32 }),
  })
  .transform<Collection>((val) => ({
    description: val.description,
    uri: val.uri,
    name: val.name,
    collectionAddress: val.vm_address.vm_address,
    creator: val.vmAddressByCreator.vm_address,
  }));

export const zCollectionsResponse = z
  .object({
    collections: z.union([zCollection, zCollectionOld]).array(),
    collections_aggregate: z.object({
      aggregate: z.object({
        count: z.number(),
      }),
    }),
  })
  .transform((val) => ({
    items: val.collections,
    total: val.collections_aggregate.aggregate.count,
  }));
export type CollectionsResponse = z.infer<typeof zCollectionsResponse>;

export const zCollectionByCollectionAddressResponse = z.object({
  data: z
    .object({
      name: z.string(),
      description: z.string(),
      uri: z.string(),
      vmAddressByCreator: z.object({
        collectionsByCreator: z
          .object({
            block_height: z.number(),
            name: z.string(),
            vmAddressByCreator: z.object({ vm_address: zHexAddr }),
          })
          .array(),
      }),
    })
    .transform((val) => ({
      description: val.description,
      name: val.name,
      uri: val.uri,
      createdHeight:
        val.vmAddressByCreator.collectionsByCreator[0].block_height,
      creatorAddress:
        val.vmAddressByCreator.collectionsByCreator[0].vmAddressByCreator
          .vm_address,
    }))
    .optional(),
});
export type CollectionByCollectionAddressResponse = z.infer<
  typeof zCollectionByCollectionAddressResponse
>;

export const zCollectionCreatorResponse = z
  .object({
    collection_transactions: z
      .object({
        block: z.object({ height: z.number(), timestamp: zUtcDate }),
        transaction: z.object({ hash: z.string() }),
        collection: z.object({ creator: zHexAddr }),
      })
      .array(),
  })
  .transform((val) => ({
    creatorAddress: val.collection_transactions[0].collection.creator,
    height: val.collection_transactions[0].block.height,
    timestamp: val.collection_transactions[0].block.timestamp,
    txhash: parseTxHash(val.collection_transactions[0].transaction.hash),
  }));
export type CollectionCreatorResponse = z.infer<
  typeof zCollectionCreatorResponse
>;

export const zCollectionCreatorResponseOld = z
  .object({
    collections: z
      .object({
        collection_transactions: z
          .object({
            transaction: z.object({
              block: z.object({ height: z.number(), timestamp: zUtcDate }),
              hash: z.string(),
            }),
          })
          .array(),
        vmAddressByCreator: z.object({ vm_address: zHexAddr }),
      })
      .array(),
  })
  .transform<CollectionCreatorResponse>((val) => ({
    creatorAddress: val.collections[0].vmAddressByCreator.vm_address,
    height:
      val.collections[0].collection_transactions[0].transaction.block.height,
    timestamp:
      val.collections[0].collection_transactions[0].transaction.block.timestamp,
    txhash:
      val.collections[0].collection_transactions[0].transaction.hash.replace(
        "\\x",
        ""
      ),
  }));

export const zActivity = z
  .object({
    transaction: z.object({
      block: z.object({ timestamp: zUtcDate }),
      hash: z.string().transform(parseTxHash),
    }),
    is_nft_burn: z.boolean(),
    is_nft_mint: z.boolean(),
    is_nft_transfer: z.boolean(),
    nft_id: zHexAddr.optional().nullable(),
    nft: z
      .object({
        token_id: z.string(),
      })
      .optional()
      .nullable(),
    is_collection_create: z.boolean(),
  })
  .transform((data) => ({
    timestamp: data.transaction.block.timestamp,
    txhash: data.transaction.hash,
    isNftBurn: data.is_nft_burn,
    isNftMint: data.is_nft_mint,
    isNftTransfer: data.is_nft_transfer,
    tokenId: data.nft?.token_id,
    nftAddress: data.nft_id,
    isCollectionCreate: data.is_collection_create,
  }));
export type Activity = z.infer<typeof zActivity>;

export const zActivityOld = z
  .object({
    transaction: z.object({
      block: z.object({ timestamp: zUtcDate }),
      hash: z.string().transform(parseTxHash),
    }),
    is_nft_burn: z.boolean(),
    is_nft_mint: z.boolean(),
    is_nft_transfer: z.boolean(),
    nft: z
      .object({
        token_id: z.string(),
        vm_address: z.object({ vm_address: zHexAddr }),
      })
      .optional()
      .nullable(),
    is_collection_create: z.boolean(),
  })
  .transform<Activity>((data) => ({
    timestamp: data.transaction.block.timestamp,
    txhash: data.transaction.hash,
    isNftBurn: data.is_nft_burn,
    isNftMint: data.is_nft_mint,
    isNftTransfer: data.is_nft_transfer,
    tokenId: data.nft?.token_id,
    nftAddress: data.nft?.vm_address.vm_address,
    isCollectionCreate: data.is_collection_create,
  }));

export const zActivitiesCountResponse = z
  .object({
    collection_transactions_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>(
    (val) => val.collection_transactions_aggregate.aggregate.count
  );

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
