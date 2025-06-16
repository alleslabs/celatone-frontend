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

  const showTypeArgsJson = serializedAbiDataJson.typeArgs.length > 0;
  const formatedTypeArgsJson = JSON.stringify(serializedAbiDataJson.typeArgs);

  const showArgsJson = serializedAbiDataJson.args.length > 0;
  const formatedArgsJson = JSON.stringify(serializedAbiDataJson.args);

  const viewSnippet = `\n\ncurl --location '${restEndpoint}/initia/move/v1/view/json' \\
--header 'Content-Type: application/json' \\
--data '{
    "address": "${moduleAddress}",
    "args": ${showArgsJson ? formatedArgsJson : "[]"},
    "function_name": "${fn.name}",
    "module_name": "${moduleName}",
    "typeArgs": ${showTypeArgsJson ? formatedTypeArgsJson : "[]"}
}'`;

  return {
    mode: "sh",
    name: "Curl",
    viewSnippet,
  };
};
