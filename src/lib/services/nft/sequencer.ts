import type {
  BechAddr,
  BechAddr32,
  HexAddr32,
  Nullable,
  Option,
} from "lib/types";

import axios from "axios";
import {
  convertAccountPubkeyToAccountAddress,
  parseWithError,
} from "lib/utils";

import type { Nft, NftMintInfo, NftTxResponse } from "../types";

import { getTxsByAccountAddressSequencer } from "../tx/sequencer";
import {
  zNftsByAccountResponseSequencer,
  zNftsResponseSequencer,
} from "../types";

export const getNftsSequencerLoop = async (
  endpoint: string,
  collectionAddress: BechAddr32
) => {
  const nfts: Nft[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/indexer/nft/v1/tokens/by_collection/${collectionAddress}`,
        {
          params: {
            "pagination.key": paginationKey,
          },
        }
      )
      .then(({ data }) => parseWithError(zNftsResponseSequencer, data));

    nfts.push(...res.tokens);

    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return nfts;
};

export const getNftsSequencer = async (
  endpoint: string,
  collectionAddress: BechAddr32,
  paginationKey: Option<string>,
  limit: number
) => {
  const { data } = await axios.get(
    `${endpoint}/indexer/nft/v1/tokens/by_collection/${collectionAddress}`,
    {
      params: {
        "pagination.key": paginationKey,
        "pagination.limit": limit,
      },
    }
  );
  return parseWithError(zNftsResponseSequencer, data);
};

export const getNftsByAccountSequencer = async (
  endpoint: string,
  accountAddress: BechAddr,
  collectionAddress?: BechAddr32
) => {
  const nfts: Nft[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/indexer/nft/v1/tokens/by_account/${encodeURI(accountAddress)}`,
        {
          params: {
            collection_addr: collectionAddress,
            "pagination.key": paginationKey,
            "pagination.reverse": true,
          },
        }
      )
      .then(({ data }) =>
        parseWithError(zNftsByAccountResponseSequencer, data)
      );

    nfts.push(...res.items);

    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return {
    items: nfts,
    total: nfts.length,
  };
};

export const getNftMintInfoSequencer = async (
  endpoint: string,
  prefix: string,
  nftAddress: HexAddr32
): Promise<NftMintInfo> => {
  const txsByNftAddress = await getTxsByAccountAddressSequencer({
    address: nftAddress,
    endpoint,
    limit: 1,
    reverse: false,
  });

  if (!txsByNftAddress.items.length)
    throw new Error("No mint transaction found");

  const tx = txsByNftAddress.items[0];

  const sender = convertAccountPubkeyToAccountAddress(tx.signerPubkey, prefix);

  return {
    height: tx.height,
    minter: sender,
    timestamp: tx.created,
    txhash: tx.hash,
  };
};

export const getNftTransactionsSequencer = async (
  endpoint: string,
  paginationKey: Option<string>,
  nftAddress: HexAddr32
) => {
  const txsByNftAddress = await getTxsByAccountAddressSequencer({
    address: nftAddress,
    endpoint,
    limit: 10,
    paginationKey,
  });

  const nftsTxs: NftTxResponse[] = [];

  txsByNftAddress.items.forEach((tx) => {
    const { created, events, hash } = tx;

    events?.reverse()?.forEach((event) => {
      if (!event.attributes[0].value.includes("0x1::object::")) return;

      const eventValue = event.attributes[0].value.split("::")[2];

      nftsTxs.push({
        isNftBurn: false,
        isNftMint: eventValue === "CreateEvent",
        isNftTransfer: eventValue === "TransferEvent",
        timestamp: created,
        txhash: hash,
      });
    });
  });

  return {
    items: nftsTxs,
    pagination: txsByNftAddress.pagination,
  };
};
