import type { JsonFragment } from "ethers";
import type { TxDataJsonRpc, TxReceiptJsonRpcLog } from "lib/services/types";
import type {
  Coin,
  EvmToAddress,
  HexAddr20,
  JsonDataType,
  Nullable,
  Option,
} from "lib/types";

import { keccak256 } from "@initia/initia.js";
import { Interface } from "ethers";
import { big, EvmMethodId, EvmMethodName, zHexAddr20 } from "lib/types";

import { toChecksumAddress } from "./address";
import { hexToBig } from "./number";

export const getEvmMethod = (txInput: string, txTo: Nullable<HexAddr20>) => {
  if (txTo === null && txInput !== "0x") return EvmMethodName.Create;
  if (txInput === EvmMethodId.Transfer) return EvmMethodName.Transfer;
  if (txInput.startsWith(EvmMethodId.TransferErc20))
    return EvmMethodName.TransferErc20;
  if (txInput.startsWith(EvmMethodId.CallErc20Factory))
    return EvmMethodName.CallErc20Factory;
  return txInput.slice(0, 10);
};

export const extractErc20TransferInput = (input: string) => ({
  address: toChecksumAddress(zHexAddr20.parse(`0x${input.slice(34, 74)}`)),
  amount: hexToBig(input.slice(74, 138)).toString(),
});

export const getEvmToAddress = (
  evmTxData: TxDataJsonRpc
): Option<EvmToAddress> => {
  const { input, to } = evmTxData.tx;
  const method = getEvmMethod(input, to);

  if (method === EvmMethodName.Create) {
    const { contractAddress } = evmTxData.txReceipt;
    if (!contractAddress) return undefined;
    return {
      address: toChecksumAddress(contractAddress),
      evmTxHash: evmTxData.tx.hash,
      toType: EvmMethodName.Create,
    };
  }

  if (method === EvmMethodName.CallErc20Factory) {
    const { logs } = evmTxData.txReceipt;
    const contractAddress = logs[0]?.address;
    if (!contractAddress) return undefined;
    return {
      address: toChecksumAddress(zHexAddr20.parse(contractAddress)),
      toType: EvmMethodName.CallErc20Factory,
    };
  }

  if (method === EvmMethodName.TransferErc20) {
    return {
      address: extractErc20TransferInput(input).address,
      toType: null,
    };
  }

  if (to) {
    return {
      address: toChecksumAddress(to),
      toType: null,
    };
  }

  return undefined;
};

export const convertToEvmDenom = (contractAddress: HexAddr20) =>
  toChecksumAddress(contractAddress).replace("0x", "evm/");

export const getEvmAmount = (
  evmTxData: TxDataJsonRpc,
  evmDenom: Option<string>
): Coin => {
  const method = getEvmMethod(evmTxData.tx.input, evmTxData.tx.to);

  if (method === EvmMethodName.TransferErc20) {
    return {
      amount: extractErc20TransferInput(evmTxData.tx.input).amount,
      denom: evmTxData.tx.to ? convertToEvmDenom(evmTxData.tx.to) : "",
    };
  }

  return {
    amount: evmTxData.tx.value.toString(),
    denom: evmDenom ?? "",
  };
};

export const convertCosmosChainIdToEvmChainId = (chainId: string) => {
  // metamask max
  const METAMASK_MAX = "4503599627370476";

  const hash = keccak256(Buffer.from(chainId));
  const rawEvmChainId = Buffer.from(hash).readBigUInt64BE();
  return big(rawEvmChainId.toString()).mod(METAMASK_MAX).toNumber();
};

export const encodeEvmFunctionData = (
  abiSection: JsonFragment,
  values: JsonDataType[]
) => {
  const iface = new Interface([abiSection]);
  try {
    return iface.encodeFunctionData(abiSection.name ?? "", values);
  } catch {
    return undefined;
  }
};

export const decodeEvmFunctionResult = (
  abiSection: JsonFragment,
  data: string
) => {
  const iface = new Interface([abiSection]);

  const deepStringify = (v: JsonDataType): JsonDataType => {
    if (Array.isArray(v)) return v.map(deepStringify);
    if (typeof v === "boolean") return v;
    return String(v);
  };

  try {
    return iface
      .decodeFunctionResult(abiSection.name ?? "", data)
      .map(deepStringify);
  } catch {
    return undefined;
  }
};

export const formatEvmFunctionInputsArgs = (
  inputs: JsonDataType[] | undefined
) => {
  if (!inputs) return "[]";

  const deepFormat = (v: JsonDataType): JsonDataType => {
    if (Array.isArray(v)) return `[${v.map(deepFormat).join(", ")}]`;
    if (typeof v !== "boolean") return `"${v}"`;
    return v;
  };
  return `[${inputs.map(deepFormat).join(", ")}]`;
};

export const findAndDecodeEvmConstructorArgs = (
  abi: JsonFragment[],
  constructorArgs: string
) => {
  try {
    const foundTypeConstructor = abi.find(
      (item) => item.type === "constructor"
    );
    if (!foundTypeConstructor || !foundTypeConstructor.inputs?.length)
      throw new Error("No constructor found (findAndDecodeEvmConstructorArgs)");

    const iface = new Interface([foundTypeConstructor]);
    const decodedConstructorArgs = iface._decodeParams(
      iface.deploy.inputs,
      "0x" + constructorArgs
    );

    const mapDecodedConstructorArgs = decodedConstructorArgs
      .map((arg, index) => {
        if (!foundTypeConstructor.inputs?.length) return "";
        return `Arg [${index}] ${foundTypeConstructor.inputs[index].name} (${foundTypeConstructor.inputs[index].type}): ${arg}`;
      })
      .join("\n");

    return constructorArgs + "\n\n" + mapDecodedConstructorArgs;
  } catch {
    return constructorArgs;
  }
};

export const parseEvmLog = (abi: JsonFragment[], log: TxReceiptJsonRpcLog) => {
  const iface = new Interface(abi);
  try {
    return iface.parseLog(log) ?? undefined;
  } catch {
    return undefined;
  }
};

export const decodeEvmFunctionData = (abi: JsonFragment[], data: string) => {
  const iface = new Interface(abi);
  try {
    return (
      iface.parseTransaction({
        data,
      }) ?? undefined
    );
  } catch {
    return undefined;
  }
};
