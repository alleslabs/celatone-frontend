import type { TxDataJsonRpc } from "lib/services/types";
import { EvmMethodId, EvmMethodName } from "lib/types";
import type { Coin, HexAddr20, Option } from "lib/types";

import { toChecksumAddress } from "./address";
import { hexToBig } from "./number";

export const getEvmMethod = (txInput: string) => {
  if (txInput === EvmMethodId.Transfer) return EvmMethodName.Transfer;
  if (txInput.startsWith(EvmMethodId.TransferErc20))
    return EvmMethodName.TransferErc20;
  if (txInput.startsWith(EvmMethodId.Create)) return EvmMethodName.Create;
  if (txInput.startsWith(EvmMethodId.CallErc20Factory))
    return EvmMethodName.CallErc20Factory;
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

  if (method === EvmMethodName.TransferErc20) {
    return {
      address: `0x${input.slice(34, 74)}` as HexAddr20,
      type: "user_address",
      isCreatedContract: false,
    };
  }

  if (method === EvmMethodName.Create) {
    const { contractAddress } = evmTxData.txReceipt;
    if (!contractAddress) return undefined;
    return {
      address: contractAddress,
      type: "evm_contract_address",
      isCreatedContract: true,
    };
  }

  if (method === EvmMethodName.CallErc20Factory) {
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

  if (method === EvmMethodName.TransferErc20) {
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
