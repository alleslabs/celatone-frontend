import { GraphQLClient } from "graphql-request";

export const GRAPH_URL: Record<string, string> = {
  /**
   * Revisit graphql for terra2 mainnet and osmosis mainnet
   */
  osmosis: "https://osmosis-mainnet-graphql.alleslabs.dev/v1/graphql",
  osmosistestnet: "http://34.87.166.219/v1/graphql",
  terra2testnet: "https://terra-testnet-graphql.alleslabs.dev/v1/graphql",
};

export const getIndexerGraphClient = (currentChainName: string) =>
  new GraphQLClient(GRAPH_URL[currentChainName]);
