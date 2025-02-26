import axios from "axios";

import type { HexAddr, HexAddr32, Nullable, Option } from "lib/types";
import {
  convertAccountPubkeyToAccountAddress,
  parseWithError,
} from "lib/utils";
import { getTxsByAccountAddressSequencer } from "../tx/sequencer";
import type { Nft, NftMintInfo, NftTxResponse } from "../types";
import {
  zNftsByAccountResponseSequencer,
  zNftsResponseSequencer,
} from "../types";

export const getNftsSequencer = async (
  endpoint: string,
  collectionAddress: HexAddr32
) => {
  const nfts: Nft[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/indexer/nft/v1/tokens/by_collection/${collectionAddress}`,
        {
          params: {
            "pagination.reverse": true,
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

export const getNftsByAccountSequencer = async (
  endpoint: string,
  accountAddress: HexAddr,
  collectionAddress?: HexAddr32
) => {
  const nfts: Nft[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/indexer/nft/v1/tokens/by_account/${encodeURI(accountAddress)}`,
        {
          params: {
            "pagination.reverse": true,
            "pagination.key": paginationKey,
            collection_addr: collectionAddress,
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
    endpoint,
    address: nftAddress,
    limit: 1,
    reverse: false,
  });

  if (!txsByNftAddress.items.length)
    throw new Error("No mint transaction found");

  const tx = txsByNftAddress.items[0];

  const sender = convertAccountPubkeyToAccountAddress(tx.signerPubkey, prefix);

  return {
    minter: sender,
    txhash: tx.hash,
    height: tx.height,
    timestamp: tx.created,
  };
};

export const getNftTransactionsSequencer = async (
  endpoint: string,
  paginationKey: Option<string>,
  nftAddress: HexAddr32
) => {
  const txsByNftAddress = await getTxsByAccountAddressSequencer({
    endpoint,
    address: nftAddress,
    paginationKey,
    limit: 10,
  });

  const nftsTxs: NftTxResponse[] = [];

  txsByNftAddress.items.forEach((tx) => {
    const { events, hash, created } = tx;

    events?.reverse()?.forEach((event) => {
      if (!event.attributes[0].value.includes("0x1::object::")) return;

      const eventValue = event.attributes[0].value.split("::")[2];

      nftsTxs.push({
        txhash: hash,
        timestamp: created,
        isNftBurn: false,
        isNftMint: eventValue === "CreateEvent",
        isNftTransfer: eventValue === "TransferEvent",
      });
    });
  });

  return {
    items: nftsTxs,
    pagination: txsByNftAddress.pagination,
  };
};
