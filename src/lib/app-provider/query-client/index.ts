import { GraphQLClient } from "graphql-request";

export const GRAPH_URL: Record<string, string> = {
  osmosistestnet: "https://osmosis-testnet-graphql.alleslabs.dev/v1/graphql",
  /**
   * Revisit graphql for terra2 mainnet and keplr key for testnet (currently non-existent)
   */
  terra2: "https://terra-testnet-graphql.alleslabs.dev/console",
  terra2testnet: "https://terra-testnet-graphql.alleslabs.dev/console",
};

export const getIndexerGraphClient = (currentChainName: string) =>
  new GraphQLClient(GRAPH_URL[currentChainName]);
