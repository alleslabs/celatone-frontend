import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://osmosis-testnet-graphql2.alleslabs.dev/v1/graphql",
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/lib/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
