import axios from "axios";

import { getMoveViewJson } from "../move/module/api";
import { getTxsByAccountAddressSequencer } from "../tx/sequencer";
import type { Nft, NftMintInfo, NftTransactions } from "../types";
import {
  zNftByNftAddressResponseSequencer,
  zNftsByAccountResponseSequencer,
} from "../types";
import type { BechAddr20, HexAddr, HexAddr32, Nullable } from "lib/types";
import {
  convertAccountPubkeyToAccountAddress,
  parseWithError,
} from "lib/utils";

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

    nfts.push(...res.nfts);

    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return {
    nfts,
    total: nfts.length,
  };
};

const getNftHolder = async (endpoint: string, nftAddress: HexAddr32) =>
  getMoveViewJson(
    endpoint,
    "0x1" as HexAddr,
    "object",
    "owner",
    ["0x1::nft::Nft"],
    [`"${nftAddress}"`]
  );

const getNftInfo = async (endpoint: string, nftAddress: HexAddr32) =>
  getMoveViewJson(
    endpoint,
    "0x1" as HexAddr,
    "nft",
    "nft_info",
    [],
    [`"${nftAddress}"`]
  );

export const getNftByNftAddressSequencer = async (
  endpoint: string,
  nftAddress: HexAddr32
) =>
  Promise.all([
    getNftHolder(endpoint, nftAddress),
    getNftInfo(endpoint, nftAddress),
  ]).then((data) => parseWithError(zNftByNftAddressResponseSequencer, data));

export const getNftMintInfoSequencer = async (
  endpoint: string,
  prefix: string,
  nftAddress: HexAddr32
): Promise<NftMintInfo> => {
  const txsByAccountAddress = await getTxsByAccountAddressSequencer(
    endpoint,
    nftAddress as unknown as BechAddr20,
    undefined,
    1
  );

  if (!txsByAccountAddress.items.length)
    throw new Error("No mint transaction found");

  const tx = txsByAccountAddress.items[0];

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
  nftAddress: HexAddr32
) => {
  const txsByAccountAddress = await getTxsByAccountAddressSequencer(
    endpoint,
    nftAddress as unknown as BechAddr20,
    undefined,
    undefined
  );

  if (!txsByAccountAddress.items.length)
    throw new Error("No transactions found");

  const nftsTxs: NftTransactions[] = [];

  txsByAccountAddress.items.forEach((tx) => {
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

  return nftsTxs;
};
