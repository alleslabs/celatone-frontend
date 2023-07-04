import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * @remarks Update schema when it is needed
 */
const config: CodegenConfig = {
  schema: "https://osmo-test-5-graphql.alleslabs.dev/v1/graphql",
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
