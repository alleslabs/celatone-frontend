import { zTxReceiptJsonRpc } from "lib/services/types";
import { HexAddr20, Nullable, zHex } from "lib/types";
import { parseWithError } from "lib/utils";
import { requestJsonRpc } from ".";

export const getEthCall = (
  endpoint: string,
  from: Nullable<HexAddr20>,
  to: HexAddr20,
  data: string
) =>
  requestJsonRpc(endpoint, "eth_call", [{ from, to, data }, "latest"]).then(
    (result) => parseWithError(zHex, result)
  );

export const getEthGetTransactionReceipt = (endpoint: string, txHash: string) =>
  requestJsonRpc(endpoint, "eth_getTransactionReceipt", [txHash]).then(
    (result) => parseWithError(zTxReceiptJsonRpc, result)
  );

export const getEthGetCode = (endpoint: string, address: HexAddr20) =>
  requestJsonRpc(endpoint, "eth_getCode", [address, "latest"]).then((result) =>
    parseWithError(zHex, result)
  );

export const getEthGetStorageAt = (
  endpoint: string,
  address: HexAddr20,
  position: string
) =>
  requestJsonRpc(endpoint, "eth_getStorageAt", [
    address,
    position,
    "latest",
  ]).then((result) => parseWithError(zHex, result));
