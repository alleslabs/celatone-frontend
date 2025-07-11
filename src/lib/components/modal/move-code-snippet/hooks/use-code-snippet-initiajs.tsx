import { useCelatoneApp, useGas } from "lib/app-provider";
import { serializeAbiDataJson } from "lib/utils";

import type { CodeSnippetBaseProps } from "../types";

export const useCodeSnippetInitiaJs = ({
  abiData,
  fn,
  moduleAddress,
  moduleName,
}: CodeSnippetBaseProps) => {
  const {
    chainConfig: { rest: restEndpoint },
    currentChainId,
  } = useCelatoneApp();

  const gasPrice = useGas();
  const gasPriceStr = `${gasPrice.tokenPerGas}${gasPrice.denom}`;

  const serializedAbiDataJson = serializeAbiDataJson(fn, abiData);

  const showTypeArgsJson = serializedAbiDataJson.typeArgs.length > 0;
  const formatedTypeArgsJson = JSON.stringify(serializedAbiDataJson.typeArgs);

  const showArgsJson = serializedAbiDataJson.args.length > 0;
  const formatedArgsJson = JSON.stringify(serializedAbiDataJson.args);

  const executeCodeSnippet = `import {
  RESTClient,
  Wallet,
  MnemonicKey,
  MsgExecuteJSON,
} from '@initia/initia.js';

const client = new RESTClient('${restEndpoint}', {
  chainId: '${currentChainId}',
  gasPrices: '${gasPriceStr}',
  gasAdjustment: '2.0',
});
const key = new MnemonicKey({
  mnemonic: "<MNEMONIC>",
});
const wallet = new Wallet(client, key);
const msg = new MsgExecuteJSON(
  key.accAddress,
  '${moduleAddress}',
  '${moduleName}',
  '${fn.name}',
  ${showTypeArgsJson ? formatedTypeArgsJson : "[]"},
  ${showArgsJson ? formatedArgsJson : "[]"}
);

const execute = async () => {
  const signedTx = await wallet.createAndSignTx({
      msgs: [msg],
  });

  const broadcastResult = await client.tx.broadcast(signedTx);
  console.log(broadcastResult);
};
execute();`;

  const viewCodeSnippet = `import { RESTClient } from '@initia/initia.js'
const client = new RESTClient('${restEndpoint}', {
    chainId: '${currentChainId}',
});
const moduleAddress =
"${moduleAddress}";
const moduleName = "${moduleName}";
const fnName = "${fn.name}";
const viewModule = async (moduleAddress, moduleName, fnName) => {
    const viewResult = await client.move.viewJSON(
        moduleAddress,
        moduleName,
        fnName,
        ${showTypeArgsJson ? formatedTypeArgsJson : "[]"},
        ${showArgsJson ? formatedArgsJson : "[]"}
    )
    console.log(viewResult);
};\n
viewModule(moduleAddress, moduleName, fnName);`;

  return {
    executeCodeSnippet,
    mode: "javascript",
    name: "InitiaJS",
    viewCodeSnippet,
  };
};
