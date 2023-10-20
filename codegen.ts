import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * @remarks Update schema when it is needed
 */
const config: CodegenConfig = {
  schema: "http://localhost:8080/v1/graphql",
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
