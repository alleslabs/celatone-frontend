import axios from "axios";
import { z } from "zod";

import {
  getCollectionActivitiesExpression,
  getCollectionActivitiesExpressionOld,
  getCollectionsExpression,
  getCollectionsExpressionOld,
} from "../expression";
import {
  getCollectionActivitiesCountQuery,
  getCollectionActivitiesCountQueryOld,
  getCollectionActivitiesQuery,
  getCollectionActivitiesQueryOld,
  getCollectionByCollectionAddressQuery,
  getCollectionByCollectionAddressQueryOld,
  getCollectionCreatorQuery,
  getCollectionCreatorQueryOld,
  getCollectionMutateEventsCountQuery,
  getCollectionMutateEventsCountQueryOld,
  getCollectionMutateEventsQuery,
  getCollectionMutateEventsQueryOld,
  getCollectionsByAccountQuery,
  getCollectionsByAccountQueryOld,
  getCollectionsQuery,
  getCollectionsQueryOld,
  getCollectionUniqueHoldersCountQuery,
  getCollectionUniqueHoldersCountQueryOld,
} from "lib/query";
import type { HexAddr, HexAddr32, MutateEvent } from "lib/types";
import { zHexAddr, zHexAddr32, zRemark, zUtcDate } from "lib/types";
import { parseTxHash, parseWithError } from "lib/utils";

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

const zCollectionsResponse = z
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

export const getCollections = async (
  indexer: string,
  limit: number,
  offset: number,
  search?: string
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionsQuery,
      variables: {
        offset,
        limit,
        expression: getCollectionsExpression(search),
      },
    });
    return parseWithError(zCollectionsResponse, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionsQueryOld,
      variables: {
        offset,
        limit,
        expression: getCollectionsExpressionOld(search),
      },
    });
    return parseWithError(zCollectionsResponse, res.data.data);
  }
};

const zCollectionByCollectionAddressResponse = z.object({
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

export const getCollectionByCollectionAddress = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionByCollectionAddressQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zCollectionByCollectionAddressResponse, {
      data: res.data.data.collections[0],
    });
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionByCollectionAddressQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zCollectionByCollectionAddressResponse, {
      data: res.data.data.collections[0],
    });
  }
};

const zCollectionCreatorResponse = z
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

const zCollectionCreatorResponseOld = z
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

export const getCollectionCreator = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionCreatorQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zCollectionCreatorResponse, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionCreatorQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zCollectionCreatorResponseOld, res.data.data);
  }
};

const zActivity = z
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

const zActivityOld = z
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

export const getCollectionActivities = async (
  indexer: string,
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search?: string
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionActivitiesQuery,
      variables: {
        limit,
        offset,
        expression: getCollectionActivitiesExpression(
          collectionAddress,
          search
        ),
      },
    });
    return parseWithError(
      zActivity.array(),
      res.data.data.collection_transactions
    );
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionActivitiesQueryOld,
      variables: {
        limit,
        offset,
        expression: getCollectionActivitiesExpressionOld(
          collectionAddress,
          search
        ),
      },
    });
    return parseWithError(
      zActivityOld.array(),
      res.data.data.collection_transactions
    );
  }
};

// TODO: here
const zActivitiesCountResponse = z
  .object({
    collection_transactions_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>(
    (val) => val.collection_transactions_aggregate.aggregate.count
  );

export const getCollectionActivitiesCount = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionActivitiesCountQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zActivitiesCountResponse, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionActivitiesCountQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zActivitiesCountResponse, res.data.data);
  }
};

const zCollectionMutateEventsResponse = z
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

export const getCollectionMutateEvents = async (
  indexer: string,
  collectionAddress: HexAddr32,
  limit: number,
  offset: number
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionMutateEventsQuery,
      variables: { collectionAddress, limit, offset },
    });
    return parseWithError(
      zCollectionMutateEventsResponse.array(),
      res.data.data.collection_mutation_events
    );
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionMutateEventsQueryOld,
      variables: { collectionAddress, limit, offset },
    });
    return parseWithError(
      zCollectionMutateEventsResponse.array(),
      res.data.data.collection_mutation_events
    );
  }
};

const zMutationEventsCountResponseItem = z
  .object({
    collection_mutation_events_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>(
    (val) => val.collection_mutation_events_aggregate.aggregate.count
  );

export const getCollectionMutateEventsCount = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionMutateEventsCountQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zMutationEventsCountResponseItem, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionMutateEventsCountQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zMutationEventsCountResponseItem, res.data.data);
  }
};

const zUniqueHoldersCountResponseItem = z
  .object({
    nfts_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>((val) => val.nfts_aggregate.aggregate.count);

export const getCollectionUniqueHoldersCount = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionUniqueHoldersCountQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zUniqueHoldersCountResponseItem, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionUniqueHoldersCountQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zUniqueHoldersCountResponseItem, res.data.data);
  }
};

const zCollectionsByAccountResponse = z
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

const zCollectionsByAccountResponseOld = z
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

export const getCollectionsByAccount = async (
  indexer: string,
  accountAddress: HexAddr
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionsByAccountQuery,
      variables: { accountAddress },
    });
    return parseWithError(
      zCollectionsByAccountResponse.array(),
      res.data.data.collections
    ).filter((collection) => collection.hold > 0);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionsByAccountQueryOld,
      variables: { accountAddress },
    });
    return parseWithError(
      zCollectionsByAccountResponseOld.array(),
      res.data.data.collections
    ).filter((collection) => collection.hold > 0);
  }
};
