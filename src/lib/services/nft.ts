import { z } from "zod";

import { zUtcDate, type Trait, zHexAddr } from "lib/types";

export interface NFTTokenResponse {
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

export const zNFTTokenResponse = z
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

export type NFTToken = z.infer<typeof zNFTTokenResponse>;

export interface NFTMintInfoResponse {
  data: {
    nft_transactions: {
      transaction: {
        block: { timestamp: string; height: number };
        hash: string;
      };
    }[];
  };
}

export const zNFTMintInfoResponse = z
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

export type NFTMintInfo = z.infer<typeof zNFTMintInfoResponse>;

export interface Metadata {
  description: string;
  image: string;
  image_data: string;
  name: string;
  attributes?: Trait[];
}

export interface NFTTransactionPaginationResponse {
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

export const zNFTTransactionPaginationResponse = z
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
    isNFTBurn: val.is_nft_burn,
    isNFTMint: val.is_nft_mint,
    isNFTTransfer: val.is_nft_transfer,
  }));

export type NFTTransactionPagination = z.infer<
  typeof zNFTTransactionPaginationResponse
>;

export interface NFTMutateEventsPaginationResponse {
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

export const zNFTMutateEventsPaginationResponse = z
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

export type NFTMutateEventsPagination = z.infer<
  typeof zNFTMutateEventsPaginationResponse
>;

export interface NFTTokenCountByAddressResponse {
  data: {
    nfts_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}
