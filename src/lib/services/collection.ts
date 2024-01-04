import axios from "axios";
import { z } from "zod";

import {
  getCollectioUniqueHoldersCount,
  getCollectionActivitiesCount,
  getCollectionActivitiesPagination,
  getCollectionByCollectionAddress,
  getCollectionCreator,
  getCollectionListByAddress,
  getCollectionMutateEventsCount,
  getCollectionMutateEventsPagination,
  getCollectionTotalBurnedCount,
  getCollectionsPagination,
} from "lib/query";
import type { HexAddr } from "lib/types";
import { zHexAddr, zUtcDate } from "lib/types";

interface CollectionResponse {
  data: {
    collections: {
      name: string;
      uri: string;
      description: string;
      vm_address: { vm_address: string };
    }[];
  };
}

const zCollectionResponseItem = z
  .object({
    uri: z.string(),
    name: z.string(),
    description: z.string(),
    vm_address: z.object({ vm_address: zHexAddr }),
  })
  .transform((val) => ({
    description: val.description,
    uri: val.uri,
    name: val.name,
    collectionAddress: val.vm_address.vm_address,
  }));

export const queryCollectionsPagination = async (
  indexer: string,
  offset: number,
  pageSize: number,
  search?: string
) =>
  axios
    .post<CollectionResponse>(indexer, {
      query: getCollectionsPagination,
      variables: { offset, pageSize, search },
    })
    .then(({ data: res }) =>
      zCollectionResponseItem.array().parse(res.data.collections)
    );

export type Collection = z.infer<typeof zCollectionResponseItem>;

interface CollectionInfoResponse {
  data: {
    collections: {
      name: string;
      uri: string;
      description: string;
      vmAddressByCreator: {
        collectionsByCreator: {
          block_height: number;
          name: string;
          vmAddressByCreator: { vm_address: string };
        };
      }[];
    }[];
  };
}

const zCollectionInfoResponseItem = z
  .object({
    name: z.string(),
    description: z.string(),
    uri: z.string(),
    vmAddressByCreator: z.object({
      collectionsByCreator: z
        .object({
          block_height: z.number(),
          name: z.string(),
          vmAddressByCreator: z.object({ vm_address: zHexAddr }),
        })
        .array(),
    }),
  })
  .transform((val) => ({
    description: val.description,
    name: val.name,
    uri: val.uri,
    createdHeight: val.vmAddressByCreator.collectionsByCreator[0].block_height,
    creatorAddress:
      val.vmAddressByCreator.collectionsByCreator[0].vmAddressByCreator
        .vm_address,
  }));

export const queryCollectionInfo = async (
  indexer: string,
  collectionAddress: HexAddr
) =>
  axios
    .post<CollectionInfoResponse>(indexer, {
      query: getCollectionByCollectionAddress,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data: res }) =>
      zCollectionInfoResponseItem.parse(res.data.collections[0])
    );

export type CollectionInfo = z.infer<typeof zCollectionInfoResponseItem>;

interface TotalBurnedCountResponse {
  data: {
    nfts_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

const zTotalBurnedResponseItem = z
  .object({
    nfts_aggregate: z.object({ aggregate: z.object({ count: z.number() }) }),
  })
  .transform<number>((val) => val.nfts_aggregate.aggregate.count);

export const queryTotalBurnedCount = async (
  indexer: string,
  collectionAddress: HexAddr
) =>
  axios
    .post<TotalBurnedCountResponse>(indexer, {
      query: getCollectionTotalBurnedCount,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data }) => zTotalBurnedResponseItem.parse(data.data));

interface CollectionCreatorResponse {
  data: {
    collections: {
      collection_transactions: {
        transaction: {
          block: {
            height: number;
            timestamp: string;
          };
          hash: string;
        };
      }[];
      vmAddressByCreator: { vm_address: string };
    }[];
  };
}

const zCollectionCreatorResponseItem = z
  .object({
    collections: z
      .object({
        collection_transactions: z
          .object({
            transaction: z.object({
              block: z.object({ height: z.number(), timestamp: zUtcDate }),
              hash: z.string(),
            }),
          })
          .array(),
        vmAddressByCreator: z.object({ vm_address: zHexAddr }),
      })
      .array(),
  })
  .transform((val) => ({
    creatorAddress: val.collections[0].vmAddressByCreator.vm_address,
    height:
      val.collections[0].collection_transactions[0].transaction.block.height,
    timestamp:
      val.collections[0].collection_transactions[0].transaction.block.timestamp,
    txhash:
      val.collections[0].collection_transactions[0].transaction.hash.replace(
        "\\x",
        ""
      ),
  }));

export const queryCollectionCreator = async (
  indexer: string,
  collectionAddress: HexAddr
) =>
  axios
    .post<CollectionCreatorResponse>(indexer, {
      query: getCollectionCreator,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data: res }) => zCollectionCreatorResponseItem.parse(res.data));

export type CollectionCreator = z.infer<typeof zCollectionCreatorResponseItem>;

interface ActivitiesCountResponse {
  data: {
    collection_transactions_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

const zActivitiesCountResponseItem = z
  .object({
    collection_transactions_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>(
    (val) => val.collection_transactions_aggregate.aggregate.count
  );

export const queryCollectionActivitiesCount = async (
  indexer: string,
  collectionAddress: HexAddr
) =>
  axios
    .post<ActivitiesCountResponse>(indexer, {
      query: getCollectionActivitiesCount,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data }) => zActivitiesCountResponseItem.parse(data.data));

interface MutationEventsCountResponse {
  data: {
    collection_mutation_events_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

const zMutationEventsCountResponseItem = z
  .object({
    collection_mutation_events_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>(
    (val) => val.collection_mutation_events_aggregate.aggregate.count
  );

export const queryCollectionMutateEventsCount = async (
  indexer: string,
  collectionAddress: HexAddr
) =>
  axios
    .post<MutationEventsCountResponse>(indexer, {
      query: getCollectionMutateEventsCount,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data }) => zMutationEventsCountResponseItem.parse(data.data));

interface UniqueHoldersCountResponse {
  data: {
    nfts_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

const zUniqueHoldersCountResponseItem = z
  .object({
    nfts_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>((val) => val.nfts_aggregate.aggregate.count);

export const queryCollectionUniqueHoldersCount = async (
  indexer: string,
  collectionAddress: HexAddr
) =>
  axios
    .post<UniqueHoldersCountResponse>(indexer, {
      query: getCollectioUniqueHoldersCount,
      variables: { vmAddress: collectionAddress },
    })
    .then(({ data }) => zUniqueHoldersCountResponseItem.parse(data.data));

interface ActivitiesResponse {
  data: {
    collection_transactions: {
      transaction: {
        block: {
          timestamp: string;
        };
        hash: string;
        is_nft_burn: boolean;
        is_nft_mint: boolean;
        is_nft_transfer: boolean;
        nft?: {
          token_id: string;
        };
      };
    }[];
  };
}

const zActivitiesResponseItem = z
  .object({
    transaction: z.object({
      block: z.object({ timestamp: zUtcDate }),
      hash: z.string(),
    }),
    is_nft_burn: z.boolean(),
    is_nft_mint: z.boolean(),
    is_nft_transfer: z.boolean(),
    nft: z
      .object({
        token_id: z.string(),
      })
      .optional()
      .nullable(),
  })
  .transform((data) => ({
    timestamp: data.transaction.block.timestamp,
    txhash: data.transaction.hash.replace("\\x", ""),
    isNftBurn: data.is_nft_burn,
    isNftMint: data.is_nft_mint,
    isNftTransfer: data.is_nft_transfer,
    tokenId: data.nft?.token_id,
  }));

export const queryCollectionActivities = async (
  indexer: string,
  collectionAddress: HexAddr,
  pageSize: number,
  offset: number,
  search?: string
) =>
  axios
    .post<ActivitiesResponse>(indexer, {
      query: getCollectionActivitiesPagination,
      variables: {
        collectionAddress,
        pageSize,
        offset,
        search,
      },
    })
    .then(({ data: res }) =>
      zActivitiesResponseItem.array().parse(res.data.collection_transactions)
    );

export type Activity = z.infer<typeof zActivitiesResponseItem>;

interface CollectionMutateEventsResponse {
  data: {
    collection_mutation_events: {
      mutated_field_name: string;
      new_value: string;
      old_value: string;
      remark: {
        type: string;
        value: string;
      };
      block: {
        timestamp: string;
      };
    }[];
  };
}

const zCollectionMutateEventsResponse = z
  .object({
    old_value: z.string(),
    new_value: z.string(),
    mutated_field_name: z.string(),
    remark: z.object({ type: z.string(), value: z.string() }),
    block: z.object({ timestamp: zUtcDate }),
  })
  .transform((val) => ({
    oldValue: val.old_value,
    newValue: val.new_value,
    mutatedFieldName: val.mutated_field_name,
    remark: val.remark,
    timestamp: val.block.timestamp,
  }));

export const queryCollectionMutateEventsPagination = async (
  indexer: string,
  collectionAddress: HexAddr,
  pageSize: number,
  offset: number
) =>
  axios
    .post<CollectionMutateEventsResponse>(indexer, {
      query: getCollectionMutateEventsPagination,
      variables: {
        collectionAddress,
        pageSize,
        offset,
      },
    })
    .then(({ data: res }) =>
      zCollectionMutateEventsResponse
        .array()
        .parse(res.data.collection_mutation_events)
    );

export type CollectionMutateEvent = z.infer<
  typeof zCollectionMutateEventsResponse
>;

interface CollectionListByAddressResponse {
  data: {
    collections: {
      name: string;
      uri: string;
      vm_address: {
        vm_address: string;
      };
      nfts_aggregate: {
        aggregate: {
          count: number;
        };
      };
    }[];
  };
}

const zCollectionListByAddressResponse = z
  .object({
    name: z.string(),
    uri: z.string(),
    vm_address: z.object({ vm_address: zHexAddr }),
    nfts_aggregate: z.object({ aggregate: z.object({ count: z.number() }) }),
  })
  .transform((val) => ({
    collectionName: val.name,
    collectionAddress: val.vm_address.vm_address,
    uri: val.uri,
    hold: val.nfts_aggregate.aggregate.count,
  }));

export const queryCollectionListByAddress = async (
  indexer: string,
  accountAddress: HexAddr
) =>
  axios
    .post<CollectionListByAddressResponse>(indexer, {
      query: getCollectionListByAddress,
      variables: { accountAddress },
    })
    .then(({ data: res }) =>
      zCollectionListByAddressResponse.array().parse(res.data.collections)
    );

export type CollectionByAddress = z.infer<
  typeof zCollectionListByAddressResponse
>;
