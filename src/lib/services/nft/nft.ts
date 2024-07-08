import axios from "axios";
import { z } from "zod";

import {
  getNftsByAccountExpression,
  getNftsByAccountExpressionOld,
  getNftsExpression,
  getNftsExpressionOld,
} from "../expression";
import {
  getNftMintInfoQuery,
  getNftMutateEventsCountQuery,
  getNftMutateEventsCountQueryOld,
  getNftMutateEventsQuery,
  getNftMutateEventsQueryOld,
  getNftQuery,
  getNftQueryOld,
  getNftsByAccountQuery,
  getNftsByAccountQueryOld,
  getNftsCountByAccountQuery,
  getNftsCountByAccountQueryOld,
  getNftsQuery,
  getNftsQueryOld,
  getNftTransactionsCountQuery,
  getNftTransactionsCountQueryOld,
  getNftTransactionsQuery,
  getNftTransactionsQueryOld,
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
    owner: zHexAddr,
    id: zHexAddr32,
    collection: zHexAddr32,
    collectionByCollection: z.object({
      name: z.string(),
    }),
  })
  .transform((val) => ({
    uri: val.uri,
    tokenId: val.token_id,
    description: val.description,
    isBurned: val.is_burned,
    ownerAddress: val.owner,
    nftAddress: val.id,
    collectionAddress: val.collection,
    collectionName: val.collectionByCollection.name,
  }));
export type Nft = z.infer<typeof zNft>;

const zNftOld = z
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

export const getNfts = async (
  indexer: string,
  collectionAddress: HexAddr32,
  search: string,
  limit: number,
  offset: number
) => {
  try {
    const res = await axios.post(indexer, {
      query: getNftsQuery,
      variables: {
        limit,
        offset,
        expression: getNftsExpression(collectionAddress, search),
      },
    });
    return parseWithError(zNft.array(), res.data.data.nfts);
  } catch {
    const res = await axios.post(indexer, {
      query: getNftsQueryOld,
      variables: {
        limit,
        offset,
        expression: getNftsExpressionOld(collectionAddress, search),
      },
    });
    return parseWithError(zNftOld.array(), res.data.data.nfts);
  }
};

const zNftByNftAddressResponse = z.object({
  data: z.union([zNft, zNftOld]).optional(),
});
export type NftByNftAddressResponse = z.infer<typeof zNftByNftAddressResponse>;

export const getNftByNftAddress = async (
  indexer: string,
  collectionAddress: HexAddr32,
  nftAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getNftQuery,
      variables: { collectionAddress, nftAddress },
    });
    return parseWithError(zNftByNftAddressResponse, {
      data: res.data.data.nfts[0],
    });
  } catch {
    const res = await axios.post(indexer, {
      query: getNftQueryOld,
      variables: { collectionAddress, nftAddress },
    });
    return parseWithError(zNftByNftAddressResponse, {
      data: res.data.data.nfts[0],
    });
  }
};

export const getNftsCountByAccount = async (
  indexer: string,
  accountAddress: HexAddr
) => {
  try {
    const res = await axios.post(indexer, {
      query: getNftsCountByAccountQuery,
      variables: { accountAddress },
    });
    return z.number().parse(res.data.data.nfts_aggregate.aggregate.count);
  } catch {
    const res = await axios.post(indexer, {
      query: getNftsCountByAccountQueryOld,
      variables: { accountAddress },
    });
    return z.number().parse(res.data.data.nfts_aggregate.aggregate.count);
  }
};

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
  limit: number,
  offset: number
) => {
  try {
    const res = await axios.post(indexer, {
      query: getNftTransactionsQuery,
      variables: { limit, offset, nftAddress },
    });
    return parseWithError(
      zNftTransactionsResponse.array(),
      res.data.data.nft_transactions
    );
  } catch (err) {
    const res = await axios.post(indexer, {
      query: getNftTransactionsQueryOld,
      variables: { limit, offset, nftAddress },
    });
    return parseWithError(
      zNftTransactionsResponse.array(),
      res.data.data.nft_transactions
    );
  }
};

export const getNftTransactionsCount = async (
  indexer: string,
  nftAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getNftTransactionsCountQuery,
      variables: { nftAddress },
    });
    return z
      .number()
      .parse(res.data.data.nft_transactions_aggregate.aggregate.count);
  } catch {
    const res = await axios.post(indexer, {
      query: getNftTransactionsCountQueryOld,
      variables: { nftAddress },
    });
    return z
      .number()
      .parse(res.data.data.nft_transactions_aggregate.aggregate.count);
  }
};

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
) => {
  try {
    const res = await axios.post(indexer, {
      query: getNftMutateEventsQuery,
      variables: { limit, offset, nftAddress },
    });
    return parseWithError(
      zNftMutateEventsResponseItem.array(),
      res.data.data.nft_mutation_events
    );
  } catch {
    const res = await axios.post(indexer, {
      query: getNftMutateEventsQueryOld,
      variables: { limit, offset, nftAddress },
    });
    return parseWithError(
      zNftMutateEventsResponseItem.array(),
      res.data.data.nft_mutation_events
    );
  }
};

export const getNftMutateEventsCount = async (
  indexer: string,
  nftAddress: HexAddr32
) => {
  try {
    const rest = await axios.post(indexer, {
      query: getNftMutateEventsCountQuery,
      variables: { nftAddress },
    });
    return z
      .number()
      .parse(rest.data.data.nft_mutation_events_aggregate.aggregate.count);
  } catch {
    const res = await axios.post(indexer, {
      query: getNftMutateEventsCountQueryOld,
      variables: { nftAddress },
    });
    return z
      .number()
      .parse(res.data.data.nft_mutation_events_aggregate.aggregate.count);
  }
};

const zNftsByAccountResponse = z
  .object({
    nfts: z.union([zNft, zNftOld]).array(),
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
  accountAddress: HexAddr,
  limit: number,
  offset: number,
  collectionAddress?: HexAddr32,
  search?: string
) => {
  try {
    const res = await axios.post(indexer, {
      query: getNftsByAccountQuery,
      variables: {
        limit,
        offset,
        expression: getNftsByAccountExpression(
          accountAddress,
          collectionAddress,
          search
        ),
      },
    });
    return parseWithError(zNftsByAccountResponse, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getNftsByAccountQueryOld,
      variables: {
        limit,
        offset,
        expression: getNftsByAccountExpressionOld(
          accountAddress,
          collectionAddress,
          search
        ),
      },
    });
    return parseWithError(zNftsByAccountResponse, res.data.data);
  }
};
