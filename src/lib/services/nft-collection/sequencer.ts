import type { HexAddr, HexAddr32, Option } from "lib/types";

import axios from "axios";
import {
  bech32AddressToHex,
  convertAccountPubkeyToAccountAddress,
  parseWithError,
} from "lib/utils";

import type { Activity, CollectionCreatorResponse } from "../types";

import { getTxsByAccountAddressSequencer } from "../tx/sequencer";
import {
  zCollectionByCollectionAddressResponseSequencer,
  zCollectionsByAccountAddressResponseSequencer,
} from "../types";
import { getCollectionByCollectionAddressRest } from "./rest";

export const getNftCollectionByCollectionAddressSequencer = async (
  endpoint: string,
  collectionAddress: HexAddr32
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/collections/${encodeURI(collectionAddress)}`
    )
    .then(({ data }) =>
      parseWithError(zCollectionByCollectionAddressResponseSequencer, data)
    )
    // Fallback to lite version if the collection is not found
    .catch(() =>
      getCollectionByCollectionAddressRest(endpoint, collectionAddress)
    );

export const getNftCollectionsByAccountAddressSequencer = async (
  endpoint: string,
  accountAddress: HexAddr
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/collections/by_account/${encodeURI(accountAddress)}`,
      {
        params: {
          "pagination.count_total": false,
          "pagination.reverse": true,
        },
      }
    )
    .then(({ data }) =>
      parseWithError(zCollectionsByAccountAddressResponseSequencer, data)
    );

export const getNftCollectionCreatorSequencer = async (
  endpoint: string,
  prefix: string,
  collectionAddress: HexAddr32
): Promise<CollectionCreatorResponse> => {
  const txByCollectionAddress = await getTxsByAccountAddressSequencer({
    address: collectionAddress,
    endpoint,
    limit: 1,
    reverse: false,
  });

  if (!txByCollectionAddress.items.length)
    throw new Error("No collection transaction found");

  const tx = txByCollectionAddress.items[0];

  const sender = bech32AddressToHex(
    convertAccountPubkeyToAccountAddress(tx.signerPubkey, prefix)
  );

  return {
    creatorAddress: sender,
    height: tx.height,
    timestamp: tx.created,
    txhash: tx.hash,
  };
};

export const getNftCollectionActivitiesSequencer = async (
  endpoint: string,
  paginationKey: Option<string>,
  collectionAddress: HexAddr32
) => {
  const txsByCollectionAddress = await getTxsByAccountAddressSequencer({
    address: collectionAddress,
    endpoint,
    limit: 10,
    paginationKey,
  });

  const collectionActivities: Activity[] = [];

  txsByCollectionAddress.items.forEach((tx) => {
    const { created, events, hash } = tx;

    events?.reverse()?.forEach((event) => {
      if (
        (!event.attributes[0].value.includes("0x1::object::") &&
          !event.attributes[0].value.includes("0x1::collection::")) ||
        event.attributes[0].value === "0x1::object::CreateEvent"
      )
        return;

      const eventValue = event.attributes[0].value.split("::")[2];
      let tokenId;
      try {
        tokenId = JSON.parse(event.attributes[1].value).token_id;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error getting tokenId: ", err);
      }

      collectionActivities.push({
        isCollectionCreate: eventValue === "CreateCollectionEvent",
        isNftBurn: eventValue === "BurnEvent",
        isNftMint: eventValue === "MintEvent",
        isNftTransfer: eventValue === "TransferEvent",
        nftAddress: null,
        timestamp: created,
        tokenId,
        txhash: hash,
      });
    });
  });

  return {
    items: collectionActivities,
    pagination: txsByCollectionAddress.pagination,
  };
};
