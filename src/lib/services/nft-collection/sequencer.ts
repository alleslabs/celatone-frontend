import type {
  Addr,
  Addr32,
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

import type {
  Activity,
  CollectionByCollectionAddressResponse,
  CollectionCreatorResponse,
  CollectionsResponseSequencer,
} from "../types";

import { getTxsByAccountAddressSequencer } from "../tx/sequencer";
import {
  zCollectionByCollectionAddressResponseSequencer,
  zCollectionsByAccountAddressResponseSequencer,
  zCollectionsResponseSequencer,
  zNftsResponseSequencer,
} from "../types";
import { getCollectionByCollectionAddressMoveRest } from "./rest";

// ####### NFT COLLECTION #######
const getNftCollectionByCollectionAddressBaseSequencer = async (
  endpoint: string,
  collectionAddress: Addr32
) => {
  const { data } = await axios.get(
    `${endpoint}/indexer/nft/v1/collections/${encodeURI(collectionAddress)}`
  );

  return parseWithError(zCollectionByCollectionAddressResponseSequencer, data);
};

export const getNftCollectionByCollectionAddressSequencer = async (
  endpoint: string,
  collectionAddress: Addr32,
  isMove: boolean
): Promise<Nullable<CollectionByCollectionAddressResponse>> => {
  try {
    const { collection } =
      await getNftCollectionByCollectionAddressBaseSequencer(
        endpoint,
        collectionAddress
      );

    // TEMPORARY PATCH: Remove this when backend fix the `/indexer/nft/v1/collections` endpoint
    const { data: nftsResponse } = await axios.get(
      `${endpoint}/indexer/nft/v1/tokens/by_collection/${encodeURI(collectionAddress)}`,
      {
        params: {
          "pagination.count_total": true,
        },
      }
    );
    const currentSupply = parseWithError(zNftsResponseSequencer, nftsResponse)
      .pagination.total;
    // end of patch

    return {
      creatorAddress: collection.creator,
      currentSupply,
      description: collection.description,
      name: collection.name,
      uri: collection.uri,
    };
  } catch {
    try {
      if (isMove) {
        // Fallback to lite version if the collection is not found (Support Move only)
        return await getCollectionByCollectionAddressMoveRest(
          endpoint,
          collectionAddress
        );
      }
    } catch {
      // ignore and return null below
    }

    return null;
  }
};

export const getNftCollectionCreatorByCollectionAddressSequencer = async (
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

// ####### NFT COLLECTIONS #######
export const getNftCollectionsSequencer = async (
  endpoint: string,
  limit: number,
  paginationKey: Option<string>
) => {
  const { data } = await axios.get(`${endpoint}/indexer/nft/v1/collections`, {
    params: {
      "pagination.key": paginationKey,
      "pagination.limit": limit,
    },
  });
  return parseWithError(zCollectionsResponseSequencer, data);
};

export const getNftCollecitonsByNameSequencer = async (
  endpoint: string,
  name: string,
  paginationKey: Option<string>
) => {
  const { data } = await axios.get(
    `${endpoint}/indexer/nft/v1/collections/by_name/${encodeURI(name)}`,
    {
      params: {
        "pagination.key": paginationKey,
      },
    }
  );

  return parseWithError(zCollectionsResponseSequencer, data);
};

export const getNftCollectionsByCollectionAddressSequencer = async (
  endpoint: string,
  collectionAddress: Addr32
): Promise<CollectionsResponseSequencer> => {
  try {
    const { collection } =
      await getNftCollectionByCollectionAddressBaseSequencer(
        endpoint,
        collectionAddress
      );

    if (collection) {
      return {
        collections: [collection],
        pagination: {
          nextKey: null,
          total: 1,
        },
      };
    }

    throw new Error("No collection found");
  } catch {
    return {
      collections: [],
      pagination: {
        nextKey: null,
        total: 0,
      },
    };
  }
};

export const getNftCollectionsByAccountAddressSequencer = async (
  endpoint: string,
  accountAddress: Addr
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/collections/by_account/${encodeURI(accountAddress)}`,
      {
        params: {
          "pagination.count_total": false,
          "pagination.limit": 1000,
          "pagination.reverse": true,
        },
      }
    )
    .then(({ data }) =>
      parseWithError(zCollectionsByAccountAddressResponseSequencer, data)
    );
