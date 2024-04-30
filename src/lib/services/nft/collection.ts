import axios from "axios";
import { z } from "zod";

import {
  getCollectionActivitiesCountQuery,
  getCollectionActivitiesQuery,
  getCollectionByCollectionAddressQuery,
  getCollectionCreatorQuery,
  getCollectionMutateEventsCountQuery,
  getCollectionMutateEventsQuery,
  getCollectionsByAccountQuery,
  getCollectionsQuery,
  getCollectionTotalBurnedCountQuery,
  getCollectionUniqueHoldersCountQuery,
} from "lib/query";
import type { HexAddr, HexAddr32, MutateEvent } from "lib/types";
import { zHexAddr, zHexAddr32, zRemark, zUtcDate } from "lib/types";
import { parseTxHash, parseWithError } from "lib/utils";

const zCollection = z
  .object({
    name: z.string(),
    vm_address: z.object({ vm_address: zHexAddr32 }),
    uri: z.string(),
    description: z.string(),
    vmAddressByCreator: z.object({ vm_address: zHexAddr32 }),
  })
  .transform((val) => ({
    description: val.description,
    uri: val.uri,
    name: val.name,
    collectionAddress: val.vm_address.vm_address,
    creator: val.vmAddressByCreator.vm_address,
  }));
export type Collection = z.infer<typeof zCollection>;

const zCollectionsResponse = z
  .object({
    collections: zCollection.array(),
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
  offset: number,
  pageSize: number,
  search?: string
) =>
  axios
    .post(indexer, {
      query: getCollectionsQuery,
      variables: { offset, pageSize, search },
    })
    .then(({ data: res }) => parseWithError(zCollectionsResponse, res.data));

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
) =>
  axios
    .post(indexer, {
      query: getCollectionByCollectionAddressQuery,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data: res }) =>
      parseWithError(zCollectionByCollectionAddressResponse, {
        data: res.data.collections[0],
      })
    );

const zTotalBurnedResponse = z
  .object({
    nfts_aggregate: z.object({ aggregate: z.object({ count: z.number() }) }),
  })
  .transform<number>((val) => val.nfts_aggregate.aggregate.count);

export const getCollectionTotalBurnedCount = async (
  indexer: string,
  collectionAddress: HexAddr32
) =>
  axios
    .post(indexer, {
      query: getCollectionTotalBurnedCountQuery,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data }) => parseWithError(zTotalBurnedResponse, data.data));

const zCollectionCreatorResponse = z
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
  .transform((val) => ({
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
export type CollectionCreatorResponse = z.infer<
  typeof zCollectionCreatorResponse
>;

export const getCollectionCreator = async (
  indexer: string,
  collectionAddress: HexAddr32
) =>
  axios
    .post(indexer, {
      query: getCollectionCreatorQuery,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data: res }) =>
      parseWithError(zCollectionCreatorResponse, res.data)
    );

const zActivity = z
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
  .transform((data) => ({
    timestamp: data.transaction.block.timestamp,
    txhash: data.transaction.hash,
    isNftBurn: data.is_nft_burn,
    isNftMint: data.is_nft_mint,
    isNftTransfer: data.is_nft_transfer,
    tokenId: data.nft?.token_id,
    nftAddress: data.nft?.vm_address.vm_address,
    isCollectionCreate: data.is_collection_create,
  }));
export type Activity = z.infer<typeof zActivity>;

export const getCollectionActivities = async (
  indexer: string,
  pageSize: number,
  offset: number,
  expression?: object
) => {
  return axios
    .post(indexer, {
      query: getCollectionActivitiesQuery,
      variables: {
        pageSize,
        offset,
        expression,
      },
    })
    .then(({ data: res }) =>
      parseWithError(zActivity.array(), res.data.collection_transactions)
    );
};

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
) =>
  axios
    .post(indexer, {
      query: getCollectionActivitiesCountQuery,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data }) => parseWithError(zActivitiesCountResponse, data.data));

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
  pageSize: number,
  offset: number
) =>
  axios
    .post(indexer, {
      query: getCollectionMutateEventsQuery,
      variables: {
        collectionAddress,
        pageSize,
        offset,
      },
    })
    .then(({ data: res }) =>
      parseWithError(
        zCollectionMutateEventsResponse.array(),
        res.data.collection_mutation_events
      )
    );

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
) =>
  axios
    .post(indexer, {
      query: getCollectionMutateEventsCountQuery,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data }) =>
      parseWithError(zMutationEventsCountResponseItem, data.data)
    );

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
) =>
  axios
    .post(indexer, {
      query: getCollectionUniqueHoldersCountQuery,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data }) =>
      parseWithError(zUniqueHoldersCountResponseItem, data.data)
    );

const zCollectionsByAccountResponse = z
  .object({
    name: z.string(),
    vm_address: z.object({ vm_address: zHexAddr32 }),
    uri: z.string(),
    nfts_aggregate: z.object({ aggregate: z.object({ count: z.number() }) }),
  })
  .transform((val) => ({
    collectionName: val.name,
    collectionAddress: val.vm_address.vm_address,
    uri: val.uri,
    hold: val.nfts_aggregate.aggregate.count,
  }))
  .array();
export type CollectionsByAccountResponse = z.infer<
  typeof zCollectionsByAccountResponse
>;

export const getCollectionsByAccount = async (
  indexer: string,
  accountAddress: HexAddr
) =>
  axios
    .post(indexer, {
      query: getCollectionsByAccountQuery,
      variables: { accountAddress },
    })
    .then(({ data: res }) =>
      parseWithError(
        zCollectionsByAccountResponse,
        res.data.collections
      ).filter((collection) => collection.hold > 0)
    );
