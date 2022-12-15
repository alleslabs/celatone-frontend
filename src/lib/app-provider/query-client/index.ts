import { GraphQLClient } from "graphql-request";

export const GRAPH_URL: Record<string, string> = {
  osmosistestnet: "https://osmosis-testnet-graphql.alleslabs.dev/v1/graphql",
  terra2: "https://phoenix-lcd.terra.dev",
};

export const getIndexerGraphClient = (currentChainName: string) =>
  new GraphQLClient(GRAPH_URL[currentChainName]);
