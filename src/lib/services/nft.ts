import { z } from "zod";

import { zUtcDate, type Trait, zHexAddr } from "lib/types";

export interface NftTokenResponse {
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

export const zNftTokenResponse = z
  .object({
    uri: z.string(),
    token_id: z.string(),
    description: z.string().optional(),
    vmAddressByOwner: z.object({ vm_address: zHexAddr }),
    vm_address: z.object({ vm_address: zHexAddr }).optional(),
    collectionByCollection: z
      .object({
        vm_address: z.object({ vm_address: zHexAddr }),
      })
      .optional(),
  })
  .transform((val) => ({
    description: val.description,
    uri: val.uri,
    tokenId: val.token_id,
    ownerAddress: val.vmAddressByOwner?.vm_address,
    nftAddress: val.vm_address?.vm_address,
    collectionAddress: val.collectionByCollection?.vm_address.vm_address,
  }));

export type NftToken = z.infer<typeof zNftTokenResponse>;

export interface NftMintInfoResponse {
  data: {
    nft_transactions: {
      transaction: {
        block: { timestamp: string; height: number };
        hash: string;
      };
    }[];
  };
}

export const zNftMintInfoResponse = z
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

export type NftMintInfo = z.infer<typeof zNftMintInfoResponse>;

export interface Metadata {
  description: string;
  image: string;
  image_data: string;
  name: string;
  attributes?: Trait[];
}

export interface NftTransactionPaginationResponse {
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

export const zNftTransactionPaginationResponse = z
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

export type NftTransactionPagination = z.infer<
  typeof zNftTransactionPaginationResponse
>;

export interface NftMutateEventsPaginationResponse {
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

export const zNftMutateEventsPaginationResponse = z
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

export type NftMutateEventsPagination = z.infer<
  typeof zNftMutateEventsPaginationResponse
>;

export interface NftTokenCountByAddressResponse {
  data: {
    nfts_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}
