import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  useNftsByAccountExpression,
  useNftsByAccountExpressionOld,
  useNftsExpression,
  useNftsExpressionOld,
} from "../expression";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useCurrentChain,
  useNftConfig,
} from "lib/app-provider";
import type { HexAddr, HexAddr32, MutateEvent } from "lib/types";

import type {
  Metadata,
  Nft,
  NftByNftAddressResponse,
  NftMintInfo,
  NftsByAccountResponse,
  NftTransactions,
} from "./nft";
import {
  getMetadata,
  getNftByNftAddress,
  getNftMintInfo,
  getNftMutateEvents,
  getNftMutateEventsCount,
  getNfts,
  getNftsByAccount,
  getNftsCountByAccount,
  getNftTransactions,
  getNftTransactionsCount,
} from "./nft";
import {
  getNftByNftAddressOld,
  getNftMutateEventsCountOld,
  getNftMutateEventsOld,
  getNftsByAccountOld,
  getNftsCountByAccountOld,
  getNftsOld,
  getNftTransactionsCountOld,
  getNftTransactionsOld,
} from "./nftOld";

const INITIATION_CHAIN_ID = "initiation-1";

export const useNfts = (
  collectionAddress: HexAddr32,
  pageSize: number,
  offset: number,
  search = ""
) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  const expressionNew = useNftsExpression(collectionAddress, search);
  const expressionOld = useNftsExpressionOld(collectionAddress, search);
  const expression =
    chainId === INITIATION_CHAIN_ID ? expressionNew : expressionOld;

  return useQuery<Nft[]>(
    [
      CELATONE_QUERY_KEYS.NFTS,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
      search,
      expression,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getNfts(chainConfig.indexer, pageSize, offset, expression)
        : getNftsOld(
            chainConfig.indexer,
            collectionAddress,
            pageSize,
            offset,
            search
          ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftByNftAddress = (
  collectionAddress: HexAddr32,
  nftAddress: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();

  return useQuery<NftByNftAddressResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS,
      chainConfig.indexer,
      collectionAddress,
      nftAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getNftByNftAddress(chainConfig.indexer, collectionAddress, nftAddress)
        : getNftByNftAddressOld(
            chainConfig.indexer,
            collectionAddress,
            nftAddress
          ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftMintInfo = (nftAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftMintInfo>(
    [CELATONE_QUERY_KEYS.NFT_TOKEN_MINT_INFO, chainConfig.indexer, nftAddress],
    async () => getNftMintInfo(chainConfig.indexer, nftAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useMetadata = (uri: string) => {
  return useQuery<Metadata>(
    [CELATONE_QUERY_KEYS.NFT_METADATA, uri],
    async () => getMetadata(uri),
    {
      enabled: !!uri,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftTransactions = (
  limit: number,
  offset: number,
  nftAddress: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();

  return useQuery<NftTransactions[]>(
    [
      CELATONE_QUERY_KEYS.NFT_TRANSACTIONS,
      chainConfig.indexer,
      nftAddress,
      limit,
      offset,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getNftTransactions(chainConfig.indexer, nftAddress, offset, limit)
        : getNftTransactionsOld(chainConfig.indexer, nftAddress, offset, limit),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftTransactionsCount = (nftAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();

  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_TRANSACTIONS_COUNT,
      chainConfig.indexer,
      nftAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getNftTransactionsCount(chainConfig.indexer, nftAddress)
        : getNftTransactionsCountOld(chainConfig.indexer, nftAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftMutateEvents = (
  limit: number,
  offset: number,
  nftAddress: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();

  return useQuery<MutateEvent[]>(
    [
      CELATONE_QUERY_KEYS.NFT_MUTATE_EVENTS,
      chainConfig.indexer,
      nftAddress,
      limit,
      offset,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getNftMutateEvents(chainConfig.indexer, nftAddress, offset, limit)
        : getNftMutateEventsOld(chainConfig.indexer, nftAddress, offset, limit),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftMutateEventsCount = (nftAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();

  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_MUTATE_EVENTS_COUNT,
      chainConfig.indexer,
      nftAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getNftMutateEventsCount(chainConfig.indexer, nftAddress)
        : getNftMutateEventsCountOld(chainConfig.indexer, nftAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftsCountByAccount = (accountAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  const { enabled } = useNftConfig({ shouldRedirect: false });
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();

  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFTS_COUNT_BY_ACCOUNT,
      chainConfig.indexer,
      accountAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getNftsCountByAccount(chainConfig.indexer, accountAddress)
        : getNftsCountByAccountOld(chainConfig.indexer, accountAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useNftsByAccountByCollection = (
  accountAddress: HexAddr,
  pageSize: number,
  offset: number,
  search = "",
  collectionAddress?: HexAddr32,
  options: Pick<UseQueryOptions<NftsByAccountResponse>, "onSuccess"> = {}
) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  const expressionNew = useNftsByAccountExpression(
    accountAddress,
    collectionAddress,
    search
  );
  const expressionOld = useNftsByAccountExpressionOld(
    accountAddress,
    collectionAddress,
    search
  );
  const expression =
    chainId === INITIATION_CHAIN_ID ? expressionNew : expressionOld;

  return useQuery<NftsByAccountResponse>(
    [
      CELATONE_QUERY_KEYS.NFTS_BY_ACCOUNT_BY_COLLECTION,
      chainConfig.indexer,
      accountAddress,
      pageSize,
      offset,
      collectionAddress,
      expression,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getNftsByAccount(chainConfig.indexer, pageSize, offset, expression)
        : getNftsByAccountOld(
            chainConfig.indexer,
            accountAddress,
            pageSize,
            offset,
            expression
          ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
