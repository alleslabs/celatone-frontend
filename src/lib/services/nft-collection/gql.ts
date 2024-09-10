import axios from "axios";

import {
  zCollectionMutateEventsResponse,
  zCollectionsByAccountResponse,
  zCollectionsByAccountResponseOld,
  zMutationEventsCountResponseItem,
  zUniqueHoldersCountResponseItem,
} from "../types";
import {
  getCollectionMutateEventsCountQuery,
  getCollectionMutateEventsCountQueryOld,
  getCollectionMutateEventsQuery,
  getCollectionMutateEventsQueryOld,
  getCollectionsByAccountQuery,
  getCollectionsByAccountQueryOld,
  getCollectionUniqueHoldersCountQuery,
  getCollectionUniqueHoldersCountQueryOld,
} from "lib/query";
import type { HexAddr, HexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";

export const getCollectionMutateEvents = async (
  indexer: string,
  collectionAddress: HexAddr32,
  limit: number,
  offset: number
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionMutateEventsQuery,
      variables: { collectionAddress, limit, offset },
    });
    return parseWithError(
      zCollectionMutateEventsResponse.array(),
      res.data.data.collection_mutation_events
    );
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionMutateEventsQueryOld,
      variables: { collectionAddress, limit, offset },
    });
    return parseWithError(
      zCollectionMutateEventsResponse.array(),
      res.data.data.collection_mutation_events
    );
  }
};

export const getCollectionMutateEventsCount = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionMutateEventsCountQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zMutationEventsCountResponseItem, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionMutateEventsCountQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zMutationEventsCountResponseItem, res.data.data);
  }
};

export const getCollectionUniqueHoldersCount = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionUniqueHoldersCountQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zUniqueHoldersCountResponseItem, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionUniqueHoldersCountQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zUniqueHoldersCountResponseItem, res.data.data);
  }
};

export const getCollectionsByAccount = async (
  indexer: string,
  accountAddress: HexAddr
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionsByAccountQuery,
      variables: { accountAddress },
    });
    return parseWithError(
      zCollectionsByAccountResponse.array(),
      res.data.data.collections
    ).filter((collection) => collection.hold > 0);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionsByAccountQueryOld,
      variables: { accountAddress },
    });
    return parseWithError(
      zCollectionsByAccountResponseOld.array(),
      res.data.data.collections
    ).filter((collection) => collection.hold > 0);
  }
};
