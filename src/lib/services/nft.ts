import axios from "axios";
import { z } from "zod";

import {
  getNftMintInfo,
  getNftMutateEventsCount,
  getNftMutateEventsPagination,
  getNftToken,
  getNftTokenCountByAddress,
  getNftTokenListByAddressPagination,
  getNftTokenListPagination,
  getNftTransactionPagination,
  getNftTransactionsCount,
  getUserNftListByCollectionPagination,
} from "lib/query";
import { zUtcDate, zHexAddr } from "lib/types";
import type { HexAddr, Trait } from "lib/types";

interface NftTokenResponse {
  data: {
    nfts: {
      token_id: string;
      uri: string;
      description: string;
      vmAddressByOwner: { vm_address: string };
      vm_address: { vm_address: string };
      collectionByCollection: {
        vm_address: {
          vm_address: string;
        };
      };
    }[];
  };
}

const zNftTokenResponse = z
  .object({
    uri: z.string(),
    token_id: z.string(),
    description: z.string().optional(),
    vmAddressByOwner: z.object({ vm_address: zHexAddr }),
    vm_address: z.object({ vm_address: zHexAddr }).optional(),
    collectionByCollection: z.object({
      vm_address: z.object({ vm_address: zHexAddr }),
      name: z.string(),
    }),
  })
  .transform((val) => ({
    description: val.description,
    uri: val.uri,
    tokenId: val.token_id,
    ownerAddress: val.vmAddressByOwner?.vm_address,
    nftAddress: val.vm_address?.vm_address,
    collectionAddress: val.collectionByCollection.vm_address.vm_address,
    collectionName: val.collectionByCollection.name,
  }));

export const queryNftTokenListPagination = async (
  indexer: string,
  collectionAddress: HexAddr,
  pageSize: number,
  offset: number,
  search?: string
) =>
  axios
    .post<NftTokenResponse>(indexer, {
      query: getNftTokenListPagination,
      variables: {
        collectionAddress,
        limit: pageSize,
        offset,
        search: `%${search ?? ""}%`,
      },
    })
    .then(({ data: res }) => zNftTokenResponse.array().parse(res.data.nfts));

export const queryNftToken = async (
  indexer: string,
  collectionAddress: HexAddr,
  nftAddress: HexAddr
) =>
  axios
    .post(indexer, {
      query: getNftToken,
      variables: { collectionAddress, nftAddress },
    })
    .then(({ data }) => zNftTokenResponse.parse(data.data.nfts[0]));

export const queryNftTokenListByAddressPagination = async (
  indexer: string,
  userAddress: HexAddr,
  pageSize: number,
  offset: number,
  search?: string
) =>
  axios
    .post<NftTokenResponse>(indexer, {
      query: getNftTokenListByAddressPagination,
      variables: { userAddress, pageSize, offset, search: search ?? "" },
    })
    .then(({ data: res }) => zNftTokenResponse.array().parse(res.data.nfts));

export type NftToken = z.infer<typeof zNftTokenResponse>;

interface NftMintInfoResponse {
  data: {
    nft_transactions: {
      transaction: {
        block: { timestamp: string; height: number };
        hash: string;
      };
    }[];
  };
}

const zNftMintInfoResponse = z
  .object({
    block: z.object({
      timestamp: zUtcDate,
      height: z.number(),
    }),
    hash: z.string(),
  })
  .transform((val) => ({
    txhash: val.hash.replace("\\x", ""),
    height: val.block.height,
    timestamp: val.block.timestamp,
  }));

export const queryNftMintInfo = async (indexer: string, nftAddress: HexAddr) =>
  axios
    .post<NftMintInfoResponse>(indexer, {
      query: getNftMintInfo,
      variables: { nftAddress },
    })
    .then(({ data: res }) =>
      zNftMintInfoResponse.parse(res.data.nft_transactions[0].transaction)
    );

export type NftMintInfo = z.infer<typeof zNftMintInfoResponse>;

export interface Metadata {
  description: string;
  image: string;
  image_data: string;
  name: string;
  attributes?: Trait[];
}

interface NftTransactionPaginationResponse {
  data: {
    nft_transactions: {
      is_nft_burn: boolean;
      is_nft_mint: boolean;
      is_nft_transfer: boolean;
      transaction: {
        hash: string;
        block: {
          timestamp: string;
          height: number;
        };
      };
    }[];
  };
}

const zNftTransactionPaginationResponse = z
  .object({
    transaction: z.object({
      hash: z.string(),
      block: z.object({ timestamp: zUtcDate, height: z.number() }),
    }),
    is_nft_burn: z.boolean(),
    is_nft_mint: z.boolean(),
    is_nft_transfer: z.boolean(),
  })
  .transform((val) => ({
    txhash: val.transaction.hash.replace("\\x", ""),
    timestamp: val.transaction.block.timestamp,
    isNftBurn: val.is_nft_burn,
    isNftMint: val.is_nft_mint,
    isNftTransfer: val.is_nft_transfer,
  }));

export const queryNftTransactionPagination = async (
  indexer: string,
  nftAddress: HexAddr,
  offset: number,
  limit: number
) =>
  axios
    .post<NftTransactionPaginationResponse>(indexer, {
      query: getNftTransactionPagination,
      variables: { limit, offset, nftAddress },
    })
    .then(({ data: res }) =>
      zNftTransactionPaginationResponse.array().parse(res.data.nft_transactions)
    );

export type NftTransactionPagination = z.infer<
  typeof zNftTransactionPaginationResponse
>;

interface NftMutateEventsPaginationResponse {
  data: {
    nft_mutation_events: {
      old_value: string;
      remark: {
        type: string;
        value: string;
      };
      mutated_field_name: string;
      new_value: string;
      block: {
        timestamp: string;
      };
    }[];
  };
}

const zNftMutateEventsPaginationResponse = z
  .object({
    old_value: z.string(),
    new_value: z.string(),
    mutated_field_name: z.string(),
    remark: z.object({ type: z.string(), value: z.string() }),
    block: z.object({ timestamp: zUtcDate }),
  })
  .transform((val) => ({
    oldValue: val.old_value,
    newValue: val.new_value,
    mutatedFieldName: val.mutated_field_name,
    remark: val.remark,
    timestamp: val.block.timestamp,
  }));

export const queryNftMutateEventsPagination = async (
  indexer: string,
  nftAddress: HexAddr,
  offset: number,
  limit: number
) =>
  axios
    .post<NftMutateEventsPaginationResponse>(indexer, {
      query: getNftMutateEventsPagination,
      variables: { limit, offset, nftAddress },
    })
    .then(({ data: res }) =>
      zNftMutateEventsPaginationResponse
        .array()
        .parse(res.data.nft_mutation_events)
    );

export const queryNftMutateEventsCount = async (
  indexer: string,
  nftAddress: HexAddr
) =>
  axios
    .post(indexer, {
      query: getNftMutateEventsCount,
      variables: { nftAddress },
    })
    .then(
      ({ data }) => data.data.nft_mutation_events_aggregate.aggregate.count
    );

export type NftMutateEventsPagination = z.infer<
  typeof zNftMutateEventsPaginationResponse
>;

interface NftTokenCountByAddressResponse {
  data: {
    nfts_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

export const queryNftTransactionsCount = async (
  indexer: string,
  nftAddress: HexAddr
) =>
  axios
    .post(indexer, {
      query: getNftTransactionsCount,
      variables: { nftAddress },
    })
    .then(
      ({ data: res }) => res.data.nft_transactions_aggregate.aggregate.count
    );

export const queryNftTokenCountByAddress = async (
  indexer: string,
  userAddress: HexAddr
) =>
  axios
    .post<NftTokenCountByAddressResponse>(indexer, {
      query: getNftTokenCountByAddress,
      variables: { userAddress },
    })
    .then(({ data: res }) => res.data.nfts_aggregate.aggregate.count);

export const queryUserNftListByCollectionPagination = async (
  indexer: string,
  userAddress: HexAddr,
  pageSize: number,
  offset: number,
  collectionAddress?: HexAddr,
  search?: string
) =>
  axios
    .post<NftTokenResponse>(indexer, {
      query: getUserNftListByCollectionPagination,
      variables: { userAddress, collectionAddress, pageSize, offset, search },
    })
    .then(({ data: res }) => zNftTokenResponse.array().parse(res.data.nfts));
