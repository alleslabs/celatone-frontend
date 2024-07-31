/* eslint-disable sonarjs/no-duplicate-string */
import { z } from "zod";

import { getMoveViewJson } from "../move/module/lcd";
import type { CollectionByCollectionAddressResponse } from "../types";
import { zHexAddr } from "lib/types";
import type { HexAddr, HexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";

export const getCollectionByCollectionAddressLcd = async (
  endpoint: string,
  collectionAddress: HexAddr32
) =>
  Promise.all([
    getMoveViewJson(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "name",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(z.string(), name)),
    getMoveViewJson(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "description",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(z.string(), name)),
    getMoveViewJson(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "uri",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(z.string(), name)),
    getMoveViewJson(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "creator",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(zHexAddr, name)),
  ]).then<CollectionByCollectionAddressResponse>(
    ([name, description, uri, creatorAddress]) => ({
      data: {
        name,
        description,
        uri,
        createdHeight: null,
        creatorAddress,
      },
    })
  );
