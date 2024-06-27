import axios from "axios";
import { z } from "zod";

import {
  getNftMintInfoQuery,
  getNftMutateEventsCountQuery,
  getNftMutateEventsQuery,
  getNftQuery,
  getNftsByAccountQuery,
  getNftsCountByAccountQuery,
  getNftsQuery,
  getNftTransactionsCountQuery,
  getNftTransactionsQuery,
} from "lib/query";
import { zBechAddr, zHexAddr, zHexAddr32, zRemark, zUtcDate } from "lib/types";
import type { HexAddr, HexAddr32, MutateEvent } from "lib/types";
import { parseTxHash, parseWithError, snakeToCamel } from "lib/utils";

const zNft = z
  .object({
    uri: z.string(),
    token_id: z.string(),
    description: z.string().optional(),
    is_burned: z.boolean(),
    vmAddressByOwner: z.object({ vm_address: zHexAddr }),
    vm_address: z.object({ vm_address: zHexAddr32 }).optional(),
    collectionByCollection: z.object({
      vm_address: z.object({ vm_address: zHexAddr32 }),
      name: z.string(),
    }),
  })
  .transform((val) => ({
    uri: val.uri,
    tokenId: val.token_id,
    description: val.description,
    isBurned: val.is_burned,
    ownerAddress: val.vmAddressByOwner?.vm_address,
    nftAddress: val.vm_address?.vm_address,
    collectionAddress: val.collectionByCollection.vm_address.vm_address,
    collectionName: val.collectionByCollection.name,
  }));
export type Nft = z.infer<typeof zNft>;

export const getNfts = async (
  indexer: string,
  pageSize: number,
  offset: number,
  expression: object
) =>
  axios
    .post(indexer, {
      query: getNftsQuery,
      variables: {
        limit: pageSize,
        offset,
        expression,
      },
    })
    .then(({ data: res }) => parseWithError(zNft.array(), res.data.nfts));

export const getNftsCountByAccount = async (
  indexer: string,
  accountAddress: HexAddr
) =>
  axios
    .post(indexer, {
      query: getNftsCountByAccountQuery,
      variables: { accountAddress },
    })
    .then(({ data: res }) => res.data.nfts_aggregate.aggregate.count);

const zNftByNftAddressResponse = z.object({
  data: zNft.optional(),
});
export type NftByNftAddressResponse = z.infer<typeof zNftByNftAddressResponse>;

export const getNftByNftAddress = async (
  indexer: string,
  collectionAddress: HexAddr32,
  nftAddress: HexAddr32
) =>
  axios
    .post(indexer, {
      query: getNftQuery,
      variables: { collectionAddress, nftAddress },
    })
    .then(({ data }) =>
      parseWithError(zNftByNftAddressResponse, { data: data.data.nfts[0] })
    );

const zNftMintInfoResponse = z
  .object({
    account: z.object({
      address: zBechAddr,
    }),
    block: z.object({
      timestamp: zUtcDate,
      height: z.number(),
    }),
    hash: z.string().transform(parseTxHash),
  })
  .transform((val) => ({
    minter: val.account.address,
    txhash: val.hash,
    height: val.block.height,
    timestamp: val.block.timestamp,
  }));
export type NftMintInfo = z.infer<typeof zNftMintInfoResponse>;

// TODO: combine with getNftByNftAddress when migrating to API
export const getNftMintInfo = async (indexer: string, nftAddress: HexAddr32) =>
  axios
    .post(indexer, {
      query: getNftMintInfoQuery,
      variables: { nftAddress },
    })
    .then(({ data: res }) =>
      parseWithError(
        zNftMintInfoResponse,
        res.data.nft_transactions[0].transaction
      )
    );

export const zMetadata = z
  .object({
    name: z.string(),
    description: z.string(),
    image: z.string(),
    image_url: z.string().optional(),
    attributes: z
      .object({
        trait_type: z.string(),
        display_type: z.string().optional(),
        value: z.union([z.string(), z.number()]),
      })
      .array()
      .optional(),
  })
  .transform(snakeToCamel);
export type Metadata = z.infer<typeof zMetadata>;

export const getMetadata = async (uri: string) =>
  axios.get(uri).then(({ data }) => parseWithError(zMetadata, data));

const zNftTransactionsResponse = z
  .object({
    transaction: z.object({
      hash: z.string().transform(parseTxHash),
      block: z.object({ timestamp: zUtcDate, height: z.number() }),
    }),
    is_nft_burn: z.boolean(),
    is_nft_mint: z.boolean(),
    is_nft_transfer: z.boolean(),
  })
  .transform((val) => ({
    txhash: val.transaction.hash,
    timestamp: val.transaction.block.timestamp,
    isNftBurn: val.is_nft_burn,
    isNftMint: val.is_nft_mint,
    isNftTransfer: val.is_nft_transfer,
  }));
export type NftTransactions = z.infer<typeof zNftTransactionsResponse>;

export const getNftTransactions = async (
  indexer: string,
  nftAddress: HexAddr32,
  offset: number,
  limit: number
) =>
  axios
    .post(indexer, {
      query: getNftTransactionsQuery,
      variables: { limit, offset, nftAddress },
    })
    .then(({ data: res }) =>
      parseWithError(
        zNftTransactionsResponse.array(),
        res.data.nft_transactions
      )
    );

export const getNftTransactionsCount = async (
  indexer: string,
  nftAddress: HexAddr32
) =>
  axios
    .post(indexer, {
      query: getNftTransactionsCountQuery,
      variables: { nftAddress },
    })
    .then(
      ({ data: res }) => res.data.nft_transactions_aggregate.aggregate.count
    );

const zNftMutateEventsResponseItem = z
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

export const getNftMutateEvents = async (
  indexer: string,
  nftAddress: HexAddr32,
  offset: number,
  limit: number
) =>
  axios
    .post(indexer, {
      query: getNftMutateEventsQuery,
      variables: { limit, offset, nftAddress },
    })
    .then(({ data: res }) =>
      parseWithError(
        zNftMutateEventsResponseItem.array(),
        res.data.nft_mutation_events
      )
    );

export const getNftMutateEventsCount = async (
  indexer: string,
  nftAddress: HexAddr32
) =>
  axios
    .post(indexer, {
      query: getNftMutateEventsCountQuery,
      variables: { nftAddress },
    })
    .then(
      ({ data }) => data.data.nft_mutation_events_aggregate.aggregate.count
    );

const zNftsByAccountResponse = z
  .object({
    nfts: zNft.array(),
    nfts_aggregate: z.object({
      aggregate: z.object({
        count: z.number(),
      }),
    }),
  })
  .transform((val) => ({
    nfts: val.nfts,
    total: val.nfts_aggregate.aggregate.count,
  }));
export type NftsByAccountResponse = z.infer<typeof zNftsByAccountResponse>;

export const getNftsByAccount = async (
  indexer: string,
  pageSize: number,
  offset: number,
  expression: object
) =>
  axios
    .post(indexer, {
      query: getNftsByAccountQuery,
      variables: { pageSize, offset, expression },
    })
    .then(({ data: res }) => parseWithError(zNftsByAccountResponse, res.data));
