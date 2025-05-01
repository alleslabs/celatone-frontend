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
import { z } from "zod";

export const zNft = z
  .object({
    collection_address: zHexAddr32,
    collection_name: z.string().optional(),
    description: z.string().optional(),
    is_burned: z.boolean(),
    // Available in Move VM only
    nft_address: zHexAddr32.nullable(),
    owner_address: zHexAddr,
    token_id: z.string(),
    uri: z.string(),
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
    height: z.number(),
    minter: zBechAddr,
    timestamp: zUtcDate,
    txhash: z.string().transform(parseTxHash),
  })
  .optional();
export type NftMintInfo = z.infer<typeof zNftMintInfoResponse>;

export const zMetadata = z
  .object({
    attributes: z
      .object({
        display_type: z.string().optional(),
        trait_type: z.string(),
        value: z.union([z.string(), z.number()]),
      })
      .array()
      .optional(),
    description: z.string(),
    image: z.string(),
    image_url: z.string().optional(),
    name: z.string(),
  })
  .transform(snakeToCamel);
export type Metadata = z.infer<typeof zMetadata>;

export const zNftTxResponse = z
  .object({
    is_nft_burn: z.boolean(),
    is_nft_mint: z.boolean(),
    is_nft_transfer: z.boolean(),
    timestamp: zUtcDate,
    txhash: z.string().transform(parseTxHash),
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
    mutated_field_name: z.string(),
    new_value: z.string(),
    old_value: z.string(),
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
    // Revisit this address type
    collection_addr: zHexAddr32,
    collection_name: z.string(),
    nft: z.object({
      description: z.string(),
      token_id: z.string(),
      uri: z.string(),
    }),
    object_addr: zHexAddr32,
    owner_addr: zHexAddr,
  })
  .transform<Nft>((val) => ({
    collectionAddress: val.collection_addr,
    collectionName: val.collection_name,
    description: val.nft.description,
    isBurned: false,
    nftAddress: val.object_addr ? val.object_addr : null,
    ownerAddress: val.owner_addr,
    tokenId: val.nft.token_id,
    uri: val.nft.uri,
  }));
export type NftSequencer = z.infer<typeof zNftSequencer>;

export const zNftsResponseSequencer = z.object({
  pagination: zPagination,
  tokens: z.array(zNftSequencer),
});

export const zNftsByAccountResponseSequencer = z
  .object({
    pagination: zPagination,
    tokens: z.array(zNftSequencer),
  })
  .transform((val) => ({
    items: val.tokens,
    pagination: val.pagination,
  }));

export const zNftInfoRest = z
  .object({
    // Revisit this address type
    collection: zHexAddr32,
    description: z.string(),
    token_id: z.string(),
    uri: z.string(),
  })
  .transform(snakeToCamel);
