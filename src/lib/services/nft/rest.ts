import { zHexAddr } from "lib/types";
import type { HexAddr, HexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";
import { getMoveViewJsonRest } from "../move/module/rest";
import type { Nft } from "../types";
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
    uri: info.uri,
    tokenId: info.tokenId,
    description: info.description,
    isBurned: false,
    ownerAddress: holder,
    nftAddress,
    collectionAddress: info.collection,
    collectionName: undefined,
  }));
