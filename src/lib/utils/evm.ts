/* eslint-disable sonarjs/no-duplicate-string */

import type { TxDataJsonRpc } from "lib/services/types";
import type { Coin, HexAddr20, Option } from "lib/types";

import { toChecksumAddress } from "./address";
import { hexToBig } from "./number";

enum EvmMethod {
  transfer = "0x",
  transferErc20 = "0xa9059cbb",
  create = "0x60806040",
  callErc20Factory = "0x06ef1a86",
}

export const getEvmMethod = (txInput: string) => {
  if (txInput === EvmMethod.transfer) return "transfer";
  if (txInput.startsWith(EvmMethod.transferErc20)) return "transfer ERC20";
  if (txInput.startsWith(EvmMethod.create)) return "create";
  if (txInput.startsWith(EvmMethod.callErc20Factory))
    return "call ERC20 factory";
  return txInput.slice(0, 10);
};

export const convertToEvmDenom = (contractAddress: HexAddr20) =>
  toChecksumAddress(contractAddress).replace("0x", "evm/");

export interface EvmToAddress {
  address: HexAddr20;
  type: "user_address" | "evm_contract_address";
  isCreatedContract: boolean;
}

export const getEvmToAddress = (
  evmTxData: Option<TxDataJsonRpc>
): Option<EvmToAddress> => {
  if (!evmTxData) return undefined;

  const { to, input } = evmTxData.tx;
  const method = getEvmMethod(input);

  if (method === "transfer ERC20") {
    return {
      address: `0x${input.slice(34, 74)}` as HexAddr20,
      type: "user_address",
      isCreatedContract: false,
    };
  }

  if (method === "create") {
    const { contractAddress } = evmTxData.txReceipt;
    if (!contractAddress) return undefined;
    return {
      address: contractAddress,
      type: "evm_contract_address",
      isCreatedContract: true,
    };
  }

  if (method === "call ERC20 factory") {
    const { logs } = evmTxData.txReceipt;
    const contractAddress = logs[0]?.address;
    if (!contractAddress) return undefined;
    return {
      address: contractAddress as HexAddr20,
      type: "evm_contract_address",
      isCreatedContract: true,
    };
  }

  if (to) {
    return {
      address: to,
      type: "user_address",
      isCreatedContract: false,
    };
  }

  return undefined;
};

export const getEvmAmount = (
  evmTxData: TxDataJsonRpc,
  evmDenom: Option<string>
): Coin => {
  const method = getEvmMethod(evmTxData.tx.input);

  if (method === "transfer ERC20") {
    return {
      amount: hexToBig(evmTxData.tx.input.slice(74, 138)).toString(),
      denom: evmTxData.tx.to ? convertToEvmDenom(evmTxData.tx.to) : "",
    };
  }

  return {
    amount: evmTxData.tx.value.toString(),
    denom: evmDenom ?? "",
  };
};
