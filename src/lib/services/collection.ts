import { z } from "zod";

import { zUtcDate } from "lib/types";

export interface CollectionResponse {
  data: {
    collections: {
      name: string;
      uri: string;
      description: string;
      vm_address: { vm_address: string };
    }[];
  };
}

export const zCollectionResponseItem = z
  .object({
    uri: z.string(),
    name: z.string(),
    description: z.string(),
    vm_address: z.object({ vm_address: z.string() }),
  })
  .transform((val) => ({
    description: val.description,
    uri: val.uri,
    name: val.name,
    collectionAddress: val.vm_address.vm_address,
  }));

export type Collection = z.infer<typeof zCollectionResponseItem>;

export interface CollectionInfoResponse {
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

export const zCollectionInfoResponseItem = z
  .object({
    name: z.string(),
    description: z.string(),
    uri: z.string(),
    vmAddressByCreator: z.object({
      collectionsByCreator: z
        .object({
          block_height: z.number(),
          name: z.string(),
          vmAddressByCreator: z.object({ vm_address: z.string() }),
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

export type CollectionInfo = z.infer<typeof zCollectionInfoResponseItem>;

export interface TotalBurnedCountResponse {
  data: {
    nfts_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

export const zTotalBurnedResponseItem = z
  .object({
    nfts_aggregate: z.object({ aggregate: z.object({ count: z.number() }) }),
  })
  .transform<number>((val) => val.nfts_aggregate.aggregate.count);

export interface CollectionCreatorResponse {
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

export const zCollectionCreatorResponseItem = z
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
        vmAddressByCreator: z.object({ vm_address: z.string() }),
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

export type CollectionCreator = z.infer<typeof zCollectionCreatorResponseItem>;

export interface ActivitiesCountResponse {
  data: {
    collection_transactions_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

export const zActivitiesCountResponseItem = z
  .object({
    collection_transactions_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>(
    (val) => val.collection_transactions_aggregate.aggregate.count
  );

export interface MutationEventsCountResponse {
  data: {
    collection_mutation_events_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

export const zMutationEventsCountResponseItem = z
  .object({
    collection_mutation_events_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>(
    (val) => val.collection_mutation_events_aggregate.aggregate.count
  );

export interface UniqueHoldersCountResponse {
  data: {
    nfts_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

export const zUniqueHoldersCountResponseItem = z
  .object({
    nfts_aggregate: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
  })
  .transform<number>((val) => val.nfts_aggregate.aggregate.count);

export interface ActivitiesResponse {
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

export const zActivitiesResponseItem = z
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
    isNFTBurn: data.is_nft_burn,
    isNFTMint: data.is_nft_mint,
    isNFTTransfer: data.is_nft_transfer,
    tokenId: data.nft?.token_id,
  }));

export type Activity = z.infer<typeof zActivitiesResponseItem>;

export interface CollectionMutateEventsResponse {
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

export const zCollectionMutateEventsResponse = z
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

export type CollectionMutateEvent = z.infer<
  typeof zCollectionMutateEventsResponse
>;

export interface CollectionListByAddressResponse {
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

export const zCollectionListByAddressResponse = z
  .object({
    name: z.string(),
    uri: z.string(),
    vm_address: z.object({ vm_address: z.string() }),
    nfts_aggregate: z.object({ aggregate: z.object({ count: z.number() }) }),
  })
  .transform((val) => ({
    collectionName: val.name,
    collectionAddress: val.vm_address.vm_address,
    uri: val.uri,
    hold: val.nfts_aggregate.aggregate.count,
  }));

export type CollectionByAddress = z.infer<
  typeof zCollectionListByAddressResponse
>;
