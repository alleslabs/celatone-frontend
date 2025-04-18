import type { HexAddr, HexAddr32 } from "lib/types";

import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";

import type { Nft } from "../types";

import { getMoveViewJsonRest } from "../move/module/rest";
import { zNftInfoRest } from "../types";

export const getNftHolderRest = async (
  endpoint: string,
  nftAddress: HexAddr32
) =>
  getMoveViewJsonRest(
    endpoint,
    "0x1" as HexAddr,
    "object",
    "owner",
    ["0x1::nft::Nft"],
    [`"${nftAddress}"`]
  ).then((data) => parseWithError(zHexAddr, data));

export const getNftInfoRest = async (endpoint: string, nftAddress: HexAddr32) =>
  getMoveViewJsonRest(
    endpoint,
    "0x1" as HexAddr,
    "nft",
    "nft_info",
    [],
    [`"${nftAddress}"`]
  ).then((data) => parseWithError(zNftInfoRest, data));

export const getNftByNftAddressRest = async (
  endpoint: string,
  nftAddress: HexAddr32
) =>
  Promise.all([
    getNftHolderRest(endpoint, nftAddress),
    getNftInfoRest(endpoint, nftAddress),
  ]).then<Nft>(([holder, info]) => ({
    collectionAddress: info.collection,
    collectionName: undefined,
    description: info.description,
    isBurned: false,
    nftAddress,
    ownerAddress: holder,
    tokenId: info.tokenId,
    uri: info.uri,
  }));
