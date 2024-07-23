import axios from "axios";
import { z } from "zod";

import {
  getNftsByAccountExpression,
  getNftsByAccountExpressionOld,
  getNftsExpression,
  getNftsExpressionOld,
} from "../expression";
import {
  zMetadata,
  zNft,
  zNftByNftAddressResponse,
  zNftMintInfoResponse,
  zNftMutateEventsResponseItem,
  zNftOld,
  zNftsByAccountResponse,
  zNftTransactionsResponse,
} from "../types/nft";
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
import type { HexAddr, HexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";

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

export const getMetadata = async (uri: string) =>
  axios.get(uri).then(({ data }) => parseWithError(zMetadata, data));

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
