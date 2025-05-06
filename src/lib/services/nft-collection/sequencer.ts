import type {
  BechAddr32,
  HexAddr,
  HexAddr32,
  Nullable,
  Option,
} from "lib/types";

import axios from "axios";
import {
  convertAccountPubkeyToAccountAddress,
  parseWithError,
} from "lib/utils";

import type {
  Activity,
  CollectionByCollectionAddressResponse,
  CollectionCreatorResponse,
} from "../types";

import { getTxsByAccountAddressSequencer } from "../tx/sequencer";
import {
  zCollectionByCollectionAddressResponseSequencer,
  zCollectionsByAccountAddressResponseSequencer,
  zNftsResponseSequencer,
} from "../types";
import { getCollectionByCollectionAddressRest } from "./rest";

export const getNftCollectionByCollectionAddressSequencer = async (
  endpoint: string,
  collectionAddressBech: BechAddr32,
  collectionAddressHex: HexAddr32,
  isMove: boolean
): Promise<Nullable<CollectionByCollectionAddressResponse>> => {
  try {
    // TODO: remove this when backend fix the stagesync issue
    const archivalEndpoint = endpoint.includes("anvil")
      ? endpoint.replace("rest-", "archival-rest-")
      : endpoint;

    const { data: collectionResponse } = await axios.get(
      `${archivalEndpoint}/indexer/nft/v1/collections/${encodeURI(collectionAddressBech)}`
    );

    const collection = parseWithError(
      zCollectionByCollectionAddressResponseSequencer,
      collectionResponse
    );

    // Remove this when backend fix the `/indexer/nft/v1/collections` endpoint
    const { data: nftsResponse } = await axios.get(
      `${archivalEndpoint}/indexer/nft/v1/tokens/by_collection/${encodeURI(collectionAddressBech)}`,
      {
        params: {
          "pagination.count_total": true,
        },
      }
    );
    const currentSupply = parseWithError(zNftsResponseSequencer, nftsResponse)
      .pagination.total;
    // end of remove

    return {
      ...collection,
      currentSupply,
    };
  } catch {
    if (isMove) {
      // Fallback to lite version if the collection is not found (Support Move only)
      return getCollectionByCollectionAddressRest(
        endpoint,
        collectionAddressHex
      );
    }

    return null;
  }
};

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
  collectionAddress: BechAddr32
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

  const sender = convertAccountPubkeyToAccountAddress(tx.signerPubkey, prefix);

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
