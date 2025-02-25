/* eslint-disable sonarjs/no-duplicate-string */
import { z } from "zod";

import { zHexAddr } from "lib/types";
import type { HexAddr, HexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";
import { getMoveViewJsonLcd } from "../move/module/lcd";
import type { CollectionByCollectionAddressResponse } from "../types";

export const getCollectionByCollectionAddressLcd = async (
  endpoint: string,
  collectionAddress: HexAddr32
) =>
  Promise.all([
    getMoveViewJsonLcd(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "name",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(z.string(), name)),
    getMoveViewJsonLcd(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "description",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(z.string(), name)),
    getMoveViewJsonLcd(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "uri",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(z.string(), name)),
    getMoveViewJsonLcd(
      endpoint,
      "0x1" as HexAddr,
      "collection",
      "creator",
      ["0x1::collection::Collection"],
      [`"${collectionAddress}"`]
    ).then((name) => parseWithError(zHexAddr, name)),
  ]).then<CollectionByCollectionAddressResponse>(
    ([name, description, uri, creatorAddress]) => ({
      name,
      description,
      uri,
      createdHeight: null,
      creatorAddress,
    })
  );
