import axios from "axios";

import {
  getCollectionActivitiesExpression,
  getCollectionActivitiesExpressionOld,
  getCollectionsExpression,
  getCollectionsExpressionOld,
} from "../expression";
import {
  zActivitiesCountResponse,
  zActivity,
  zActivityOld,
  zCollectionByCollectionAddressResponse,
  zCollectionCreatorResponse,
  zCollectionCreatorResponseOld,
  zCollectionMutateEventsResponse,
  zCollectionsByAccountResponse,
  zCollectionsByAccountResponseOld,
  zCollectionsResponse,
  zMutationEventsCountResponseItem,
  zUniqueHoldersCountResponseItem,
} from "../types";
import {
  getCollectionActivitiesCountQuery,
  getCollectionActivitiesCountQueryOld,
  getCollectionActivitiesQuery,
  getCollectionActivitiesQueryOld,
  getCollectionByCollectionAddressQuery,
  getCollectionByCollectionAddressQueryOld,
  getCollectionCreatorQuery,
  getCollectionCreatorQueryOld,
  getCollectionMutateEventsCountQuery,
  getCollectionMutateEventsCountQueryOld,
  getCollectionMutateEventsQuery,
  getCollectionMutateEventsQueryOld,
  getCollectionsByAccountQuery,
  getCollectionsByAccountQueryOld,
  getCollectionsQuery,
  getCollectionsQueryOld,
  getCollectionUniqueHoldersCountQuery,
  getCollectionUniqueHoldersCountQueryOld,
} from "lib/query";
import type { HexAddr, HexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";

export const getCollections = async (
  indexer: string,
  limit: number,
  offset: number,
  search?: string
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionsQuery,
      variables: {
        offset,
        limit,
        expression: getCollectionsExpression(search),
      },
    });
    return parseWithError(zCollectionsResponse, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionsQueryOld,
      variables: {
        offset,
        limit,
        expression: getCollectionsExpressionOld(search),
      },
    });
    return parseWithError(zCollectionsResponse, res.data.data);
  }
};

export const getCollectionByCollectionAddress = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionByCollectionAddressQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zCollectionByCollectionAddressResponse, {
      data: res.data.data.collections[0],
    });
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionByCollectionAddressQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zCollectionByCollectionAddressResponse, {
      data: res.data.data.collections[0],
    });
  }
};

export const getCollectionCreator = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionCreatorQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zCollectionCreatorResponse, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionCreatorQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zCollectionCreatorResponseOld, res.data.data);
  }
};

export const getCollectionActivities = async (
  indexer: string,
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search?: string
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionActivitiesQuery,
      variables: {
        limit,
        offset,
        expression: getCollectionActivitiesExpression(
          collectionAddress,
          search
        ),
      },
    });
    return parseWithError(
      zActivity.array(),
      res.data.data.collection_transactions
    );
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionActivitiesQueryOld,
      variables: {
        limit,
        offset,
        expression: getCollectionActivitiesExpressionOld(
          collectionAddress,
          search
        ),
      },
    });
    return parseWithError(
      zActivityOld.array(),
      res.data.data.collection_transactions
    );
  }
};

export const getCollectionActivitiesCount = async (
  indexer: string,
  collectionAddress: HexAddr32
) => {
  try {
    const res = await axios.post(indexer, {
      query: getCollectionActivitiesCountQuery,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zActivitiesCountResponse, res.data.data);
  } catch {
    const res = await axios.post(indexer, {
      query: getCollectionActivitiesCountQueryOld,
      variables: { vmAddress: collectionAddress },
    });
    return parseWithError(zActivitiesCountResponse, res.data.data);
  }
};

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
