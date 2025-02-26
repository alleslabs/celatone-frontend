import { z } from "zod";

import type { MutateEvent } from "lib/types";
import {
  zBechAddr,
  zHexAddr,
  zHexAddr32,
  zPagination,
  zRemark,
  zUtcDate,
} from "lib/types";
import { parseTxHash, snakeToCamel } from "lib/utils";

export const zNft = z
  .object({
    uri: z.string(),
    token_id: z.string(),
    description: z.string().optional(),
    is_burned: z.boolean(),
    owner_address: zHexAddr,
    nft_address: zHexAddr32,
    collection_address: zHexAddr32,
    collection_name: z.string().optional(),
  })
  .transform(snakeToCamel);
export type Nft = z.infer<typeof zNft>;

export const zNftsResponse = z.object({
  items: z.array(zNft),
});
export type NftsResponse = z.infer<typeof zNftsResponse>;

export const zNftsByAccountAddressResponse = z.object({
  items: z.array(zNft),
  total: z.number(),
});
export type NftsByAccountAddressResponse = z.infer<
  typeof zNftsByAccountAddressResponse
>;

export const zNftMintInfoResponse = z
  .object({
    minter: zBechAddr,
    txhash: z.string().transform(parseTxHash),
    height: z.number(),
    timestamp: zUtcDate,
  })
  .optional();
export type NftMintInfo = z.infer<typeof zNftMintInfoResponse>;

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

export const zNftTxResponse = z
  .object({
    txhash: z.string().transform(parseTxHash),
    timestamp: zUtcDate,
    is_nft_burn: z.boolean(),
    is_nft_mint: z.boolean(),
    is_nft_transfer: z.boolean(),
  })
  .transform(snakeToCamel);
export type NftTxResponse = z.infer<typeof zNftTxResponse>;

export const zNftTxsResponse = z.object({
  items: z.array(zNftTxResponse),
  total: z.number().nonnegative(),
});
export type NftTxsResponse = z.infer<typeof zNftTxsResponse>;

const zNftMutateEventsResponseItem = z
  .object({
    old_value: z.string(),
    new_value: z.string(),
    mutated_field_name: z.string(),
    remark: zRemark,
    timestamp: zUtcDate,
  })
  .transform<MutateEvent>(snakeToCamel);

export const zNftMutateEventsResponse = z.object({
  items: z.array(zNftMutateEventsResponseItem),
  total: z.number().nonnegative(),
});
export type NftMutateEventsResponse = z.infer<typeof zNftMutateEventsResponse>;

const zNftSequencer = z
  .object({
    object_addr: zHexAddr32,
    collection_addr: zHexAddr32,
    collection_name: z.string(),
    owner_addr: zHexAddr,
    nft: z.object({
      collection: z.object({
        inner: zHexAddr32,
      }),
      description: z.string(),
      token_id: z.string(),
      uri: z.string(),
    }),
  })
  .transform<Nft>((val) => ({
    uri: val.nft.uri,
    tokenId: val.nft.token_id,
    description: val.nft.description,
    isBurned: false,
    ownerAddress: val.owner_addr,
    nftAddress: val.object_addr,
    collectionAddress: val.collection_addr,
    collectionName: val.collection_name,
  }));
export type NftSequencer = z.infer<typeof zNftSequencer>;

export const zNftsResponseSequencer = z.object({
  tokens: z.array(zNftSequencer),
  pagination: zPagination,
});

export const zNftsByAccountResponseSequencer = z
  .object({
    tokens: z.array(zNftSequencer),
    pagination: zPagination,
  })
  .transform((val) => ({
    items: val.tokens,
    pagination: val.pagination,
  }));

export const zNftInfoRest = z
  .object({
    collection: zHexAddr32,
    description: z.string(),
    token_id: z.string(),
    uri: z.string(),
  })
  .transform(snakeToCamel);
