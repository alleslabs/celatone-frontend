import type { Addr32, BechAddr32, HexAddr } from "lib/types";

import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";
import { z } from "zod";

import { getMoveViewJsonRest } from "../move/module/rest";
import {
  type CollectionByCollectionAddressResponse,
  zCollectionByCollectionAddressResponseWasm,
} from "../types";
import { getContractQueryRest } from "../wasm/contract/rest";

export const getCollectionByCollectionAddressMoveRest = (
  endpoint: string,
  collectionAddress: Addr32
) =>
  Promise.all([
    getMoveViewJsonRest(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "name",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(z.string(), name)),
    getMoveViewJsonRest(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "description",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(z.string(), name)),
    getMoveViewJsonRest(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "uri",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(z.string(), name)),
    getMoveViewJsonRest(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "creator",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(zHexAddr, name)),
  ]).then<CollectionByCollectionAddressResponse>(
    ([name, description, uri, creatorAddress]) => ({
      createdHeight: null,
      creatorAddress,
      currentSupply: undefined,
      description,
      name,
      uri,
    })
  );

export const getCollectionByCollectionAddressWasmRest = async (
  endpoint: string,
  collectionAddress: BechAddr32
) => {
  const result = await getContractQueryRest(
    endpoint,
    collectionAddress,
    JSON.stringify({ collection_info: {} })
  );

  return parseWithError(zCollectionByCollectionAddressResponseWasm, result);
};
