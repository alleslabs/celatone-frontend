import { GraphQLClient } from "graphql-request";

export const GRAPH_URL: Record<string, string> = {
  /**
   * Revisit graphql for terra2 mainnet and osmosis mainnet
   */
  osmosis: "https://osmosis-mainnet-graphql.alleslabs.dev/v1/graphql",
  osmosistestnet5: "https://osmo-test-5-graphql.alleslabs.dev/v1/graphql",
  terra2testnet: "https://terra-testnet-graphql.alleslabs.dev/v1/graphql",
  sei: "https://pacific-1-graphql.alleslabs.dev/v1/graphql",
  seitestnet2: "https://atlantic-2-graphql.alleslabs.dev/v1/graphql",
};

export const getIndexerGraphClient = (currentChainName: string) =>
  new GraphQLClient(GRAPH_URL[currentChainName]);
