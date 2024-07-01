import axios from "axios";
import { z } from "zod";

import {
  getNftMutateEventsCountQueryOld,
  getNftMutateEventsQueryOld,
  getNftQueryOld,
  getNftsByAccountQueryOld,
  getNftsCountByAccountQueryOld,
  getNftsQueryOld,
  getNftTransactionsCountQueryOld,
  getNftTransactionsQueryOld,
} from "lib/query";
import { zHexAddr, zHexAddr32, zRemark, zUtcDate } from "lib/types";
import type { HexAddr, HexAddr32, MutateEvent } from "lib/types";
import { parseTxHash, parseWithError } from "lib/utils";

import type { Nft } from "./nft";

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
  .transform<Nft>((val) => ({
    uri: val.uri,
    tokenId: val.token_id,
    description: val.description,
    isBurned: val.is_burned,
    ownerAddress: val.vmAddressByOwner?.vm_address,
    nftAddress: val.vm_address?.vm_address || ("" as HexAddr32),
    collectionAddress: val.collectionByCollection.vm_address.vm_address,
    collectionName: val.collectionByCollection.name,
  }));

export const getNftsOld = async (
  indexer: string,
  collectionAddress: HexAddr32,
  pageSize: number,
  offset: number,
  search: string
) =>
  axios
    .post(indexer, {
      query: getNftsQueryOld,
      variables: {
        collectionAddress,
        limit: pageSize,
        offset,
        search,
      },
    })
    .then(({ data: res }) => parseWithError(zNft.array(), res.data.nfts));

export const getNftsCountByAccountOld = async (
  indexer: string,
  accountAddress: HexAddr
) =>
  axios
    .post(indexer, {
      query: getNftsCountByAccountQueryOld,
      variables: { accountAddress },
    })
    .then(({ data: res }) => res.data.nfts_aggregate.aggregate.count);

const zNftByNftAddressResponse = z.object({
  data: zNft.optional(),
});

export const getNftByNftAddressOld = async (
  indexer: string,
  collectionAddress: HexAddr32,
  nftAddress: HexAddr32
) =>
  axios
    .post(indexer, {
      query: getNftQueryOld,
      variables: { collectionAddress, nftAddress },
    })
    .then(({ data }) =>
      parseWithError(zNftByNftAddressResponse, { data: data.data.nfts[0] })
    );

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

export const getNftTransactionsOld = async (
  indexer: string,
  nftAddress: HexAddr32,
  offset: number,
  limit: number
) =>
  axios
    .post(indexer, {
      query: getNftTransactionsQueryOld,
      variables: { limit, offset, nftAddress },
    })
    .then(({ data: res }) =>
      parseWithError(
        zNftTransactionsResponse.array(),
        res.data.nft_transactions
      )
    );

export const getNftTransactionsCountOld = async (
  indexer: string,
  nftAddress: HexAddr32
) =>
  axios
    .post(indexer, {
      query: getNftTransactionsCountQueryOld,
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

export const getNftMutateEventsOld = async (
  indexer: string,
  nftAddress: HexAddr32,
  offset: number,
  limit: number
) =>
  axios
    .post(indexer, {
      query: getNftMutateEventsQueryOld,
      variables: { limit, offset, nftAddress },
    })
    .then(({ data: res }) =>
      parseWithError(
        zNftMutateEventsResponseItem.array(),
        res.data.nft_mutation_events
      )
    );

export const getNftMutateEventsCountOld = async (
  indexer: string,
  nftAddress: HexAddr32
) =>
  axios
    .post(indexer, {
      query: getNftMutateEventsCountQueryOld,
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

export const getNftsByAccountOld = async (
  indexer: string,
  accountAddress: HexAddr,
  pageSize: number,
  offset: number,
  search: string
) =>
  axios
    .post(indexer, {
      query: getNftsByAccountQueryOld,
      variables: { accountAddress, pageSize, offset, search },
    })
    .then(({ data: res }) => parseWithError(zNftsByAccountResponse, res.data));
