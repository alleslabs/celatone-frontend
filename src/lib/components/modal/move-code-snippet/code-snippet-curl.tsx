import type { AbiFormData, ExposedFunction, HexAddr } from "lib/types";

import { serializeAbiDataJson } from "lib/utils";

interface CurlCodeSnippetProps {
  abiData: AbiFormData;
  fn: ExposedFunction;
  moduleAddress: HexAddr;
  moduleName: string;
  restEndpoint: string;
}

export const renderCurlCodeSnippet = ({
  abiData,
  fn,
  moduleAddress,
  moduleName,
  restEndpoint,
}: CurlCodeSnippetProps) => {
  const serializedAbiDataJson = serializeAbiDataJson(fn, abiData);

  const snippet = `\n\ncurl '${restEndpoint}/initia/move/v1/accounts/${moduleAddress}/modules/${moduleName}/view_functions/${fn.name}' \\
  --data-raw '${JSON.stringify(serializedAbiDataJson)}'`;

  return {
    mode: "sh",
    name: "Curl",
    snippet,
  };
};
