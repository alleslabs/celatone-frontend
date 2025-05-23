import { useCelatoneApp, useGas } from "lib/app-provider";
import { getArgType, serializeAbiDataJson } from "lib/utils";

import type { CodeSnippetBaseProps } from "../types";

export const useCodeSnippetCli = ({
  abiData,
  fn,
  moduleAddress,
  moduleName,
}: CodeSnippetBaseProps) => {
  const {
    chainConfig: { chain, rpc: rpcEndpoint },
    currentChainId,
  } = useCelatoneApp();
  const gasPrice = useGas();
  const gasPriceStr = `${gasPrice.tokenPerGas}${gasPrice.denom}`;

  const daemonName = `${chain}d`;

  const argTypes = fn.params.map((param) => getArgType(param));
  const isHiddenCLI = argTypes.some(
    (argType) =>
      argType === "vector" ||
      argType === "option" ||
      argType === "object" ||
      argType === "fixed_point32" ||
      argType === "fixed_point64" ||
      argType === "decimal128" ||
      argType === "decimal256"
  );

  const serializedAbiDataJson = serializeAbiDataJson(fn, abiData);
  const showTypeArgsJson = serializedAbiDataJson.typeArgs.length > 0;
  const showArgsJson = serializedAbiDataJson.args.length > 0;

  const argsWithTypes = Object.values(abiData.args).map((arg, index) => {
    const argType = argTypes[index];
    return `${argType}:${arg}`;
  });

  const typeArgsFlags = showTypeArgsJson
    ? `\n\t--type-args '${serializedAbiDataJson.typeArgs.map((val) => val.replace(/^"|"$/g, "")).join(" ")}' \\`
    : "";
  const argsFlags = showArgsJson
    ? `\n\t--args '[${argsWithTypes.map((val) => JSON.stringify(val)).join(",")}]' \\`
    : "";

  const executeSnippet = `export WALLET_NAME='<your-wallet-name>'\n
    export CHAIN_ID='${currentChainId}'\n
    export RPC_URL='${rpcEndpoint}'\n
    export MODULE_ADDRESS='${moduleAddress}'\n
    export MODULE_NAME='${moduleName}'\n
    export MODULE_FN='${fn.name}'\n
    ${daemonName} keys add --recover $WALLET_NAME\n
    ${daemonName} tx move execute $MODULE_ADDRESS \\
        $MODULE_NAME \\
        $MODULE_FN \\${typeArgsFlags}${argsFlags}
        --from $WALLET_NAME \\
        --chain-id $CHAIN_ID \\
        --node $RPC_URL \\
        --gas auto \\
        --gas-prices ${gasPriceStr} \\
        --gas-adjustment 1.5`;

  const viewSnippet = `export CHAIN_ID='${currentChainId}'\n
  export MODULE_ADDRESS='${moduleAddress}'\n
  export MODULE_NAME='${moduleName}'\n
  export MODULE_FN='${fn.name}'\n
  export RPC_URL='${rpcEndpoint}'\n
  ${daemonName} query move view $MODULE_ADDRESS \\
      $MODULE_NAME \\
      $MODULE_FN \\${typeArgsFlags}${argsFlags}
      --chain-id $CHAIN_ID \\
      --node $RPC_URL`;

  return {
    executeSnippet,
    isHidden: isHiddenCLI,
    mode: "sh",
    name: "CLI",
    viewSnippet,
  };
};
