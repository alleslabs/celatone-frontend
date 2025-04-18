import type { HexAddr, HexAddr32 } from "lib/types";

import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";
import { z } from "zod";

import type { CollectionByCollectionAddressResponse } from "../types";

import { getMoveViewJsonRest } from "../move/module/rest";

export const getCollectionByCollectionAddressRest = async (
  endpoint: string,
  collectionAddress: HexAddr32
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
      description,
      name,
      uri,
    })
  );
