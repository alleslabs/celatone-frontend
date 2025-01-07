import { getMoveViewJsonLcd } from "../move/module/lcd";
import type { Nft } from "../types";
import { zNftInfoLcd } from "../types";
import { zHexAddr } from "lib/types";
import type { HexAddr, HexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";

export const getNftHolderLcd = async (
  endpoint: string,
  nftAddress: HexAddr32
) =>
  getMoveViewJsonLcd(
    endpoint,
    "0x1" as HexAddr,
    "object",
    "owner",
    ["0x1::nft::Nft"],
    [`"${nftAddress}"`]
  ).then((data) => parseWithError(zHexAddr, data));

export const getNftInfoLcd = async (endpoint: string, nftAddress: HexAddr32) =>
  getMoveViewJsonLcd(
    endpoint,
    "0x1" as HexAddr,
    "nft",
    "nft_info",
    [],
    [`"${nftAddress}"`]
  ).then((data) => parseWithError(zNftInfoLcd, data));

export const getNftByNftAddressLcd = async (
  endpoint: string,
  nftAddress: HexAddr32
) =>
  Promise.all([
    getNftHolderLcd(endpoint, nftAddress),
    getNftInfoLcd(endpoint, nftAddress),
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
