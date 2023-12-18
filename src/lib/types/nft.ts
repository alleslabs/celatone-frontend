import type { SnakeToCamelCaseNested } from "./converter";
import type { Message } from "./tx";

export interface Collection {
  name: string;
  uri: string;
  description: string;
  vm_address: {
    vm_address: string;
  };
  nfts: NFT[];
}

export type NFTCollection = SnakeToCamelCaseNested<Collection>;

export interface NFT {
  token_id: string;
  uri: string;
}

export type NFTToken = SnakeToCamelCaseNested<NFT>;

export interface Metadata {
  description: string;
  image: string;
  image_data: string;
  name: string;
}

export type NFTMetadata = SnakeToCamelCaseNested<Metadata>;

export interface TotalBurn {
  nfts_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export type NFTTotalBurn = SnakeToCamelCaseNested<TotalBurn>;

export interface CollectionCreator {
  vmAddressByCreator: {
    vm_address: string;
  };
  collection_transactions: [
    {
      transaction: {
        hash: string;
        block: {
          height: number;
          timestamp: string;
        };
      };
    },
  ];
}

export type NFTCollectionCreator = SnakeToCamelCaseNested<CollectionCreator>;

export interface CollectionActivitiesCount {
  collection_transactions_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface CollectionMutateEventsCount {
  collection_mutation_events_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface CollectionUniqueHoldersCount {
  nfts_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface CollectionActivities {
  collection_transactions: {
    transaction: Activity;
  }[];
}

export interface Activity {
  block: { timestamp: string };
  hash: string;
  messages: Message[];
}

export type NFTCollectionActivities =
  SnakeToCamelCaseNested<CollectionActivities>;
