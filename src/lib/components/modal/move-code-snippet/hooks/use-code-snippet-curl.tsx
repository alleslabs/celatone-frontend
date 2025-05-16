import { useCelatoneApp } from "lib/app-provider";
import { serializeAbiDataJson } from "lib/utils";

import type { CodeSnippetBaseProps } from "../types";

export const useSnippetCurl = ({
  abiData,
  fn,
  moduleAddress,
  moduleName,
}: CodeSnippetBaseProps) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const serializedAbiDataJson = serializeAbiDataJson(fn, abiData);

  const viewSnippet = `\n\ncurl '${restEndpoint}/initia/move/v1/accounts/${moduleAddress}/modules/${moduleName}/view_functions/${fn.name}' \\
    --data-raw '${JSON.stringify(serializedAbiDataJson)}'`;

  return {
    mode: "sh",
    name: "Curl",
    viewSnippet,
  };
};
