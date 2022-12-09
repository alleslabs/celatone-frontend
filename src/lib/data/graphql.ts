import { GraphQLClient } from "graphql-request";

export const GRAPH_URL =
  "https://osmosis-testnet-graphql.alleslabs.dev/v1/graphql";

export const indexerGraphClient = new GraphQLClient(GRAPH_URL);
