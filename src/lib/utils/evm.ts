import type { TxDataJsonRpc } from "lib/services/types";
import type {
  Coin,
  EvmToAddress,
  HexAddr20,
  Nullable,
  Option,
} from "lib/types";
import { big, EvmMethodId, EvmMethodName, zHexAddr20 } from "lib/types";

import { keccak256 } from "@initia/initia.js";
import type { JsonFragment } from "ethers";
import { Interface } from "ethers";
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

export const isEvmSingleCreate = (txInput: string, txTo: Nullable<HexAddr20>) =>
  txTo === null && txInput.startsWith(EvmMethodId.SingleCreate);

export const extractErc20TransferInput = (input: string) => ({
  address: toChecksumAddress(zHexAddr20.parse(`0x${input.slice(34, 74)}`)),
  amount: hexToBig(input.slice(74, 138)).toString(),
});

export const getEvmToAddress = (
  evmTxData: TxDataJsonRpc
): Option<EvmToAddress> => {
  const { to, input } = evmTxData.tx;
  const method = getEvmMethod(input, to);

  if (method === EvmMethodName.Create) {
    const { contractAddress } = evmTxData.txReceipt;
    if (!contractAddress) return undefined;
    return {
      toType: EvmMethodName.Create,
      address: toChecksumAddress(contractAddress),
      evmTxHash: !isEvmSingleCreate(input, to) ? evmTxData.tx.hash : null,
    };
  }

  if (method === EvmMethodName.CallErc20Factory) {
    const { logs } = evmTxData.txReceipt;
    const contractAddress = logs[0]?.address;
    if (!contractAddress) return undefined;
    return {
      toType: EvmMethodName.CallErc20Factory,
      address: toChecksumAddress(zHexAddr20.parse(contractAddress)),
    };
  }

  if (method === EvmMethodName.TransferErc20) {
    return {
      toType: null,
      address: extractErc20TransferInput(input).address,
    };
  }

  if (to) {
    return {
      toType: null,
      address: toChecksumAddress(to),
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
  values: unknown[]
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
  try {
    return iface
      .decodeFunctionResult(abiSection.name ?? "", data)
      .map((v) => v.toString());
  } catch {
    return undefined;
  }
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
