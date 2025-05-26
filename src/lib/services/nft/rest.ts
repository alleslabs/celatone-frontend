import type { BechAddr32, HexAddr, HexAddr32 } from "lib/types";

import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";

import type { Nft } from "../types";

import { getMoveViewJsonRest } from "../move/module/rest";
import { zNftInfoMoveRest, zNftInfoWasmRest } from "../types";
import { getContractQueryRest } from "../wasm/contract/rest";
import { getNftOwnerEvm } from "./json-rpc";
import { getNftUriEvm } from "./json-rpc";

// ############################################################
// ########################## MOVE ############################
// ############################################################
const getNftHolderMoveRest = async (endpoint: string, nftAddress: HexAddr32) =>
  getMoveViewJsonRest(
    endpoint,
    "0x1" as HexAddr,
    "object",
    "owner",
    ["0x1::nft::Nft"],
    [`"${nftAddress}"`]
  ).then((data) => parseWithError(zHexAddr, data));

const getNftInfoMoveRest = async (endpoint: string, nftAddress: HexAddr32) =>
  getMoveViewJsonRest(
    endpoint,
    "0x1" as HexAddr,
    "nft",
    "nft_info",
    [],
    [`"${nftAddress}"`]
  ).then((data) => parseWithError(zNftInfoMoveRest, data));

export const getNftByNftAddressMoveRest = async (
  endpoint: string,
  nftAddress: HexAddr32
) =>
  Promise.all([
    getNftHolderMoveRest(endpoint, nftAddress),
    getNftInfoMoveRest(endpoint, nftAddress),
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

// ############################################################
// ########################## WASM ############################
// ############################################################
const getNftInfoWasmRest = async (
  endpoint: string,
  collectionAddress: BechAddr32,
  tokenId: string
) => {
  const result = await getContractQueryRest(
    endpoint,
    collectionAddress,
    JSON.stringify({
      all_nft_info: {
        token_id: tokenId,
      },
    })
  );

  return parseWithError(zNftInfoWasmRest, result);
};

export const getNftByTokenIdWasmRest = async (
  endpoint: string,
  collectionAddress: BechAddr32,
  tokenId: string
): Promise<Nft> => {
  const info = await getNftInfoWasmRest(endpoint, collectionAddress, tokenId);

  return {
    collectionAddress,
    collectionName: undefined,
    description: undefined,
    isBurned: false,
    nftAddress: null,
    ownerAddress: info.access.owner,
    tokenId,
    uri: info.info.tokenUri,
  };
};

// ############################################################
// ########################## EVM #############################
// ############################################################
export const getNftByTokenIdEvmRest = async (
  endpoint: string,
  collectionAddress: HexAddr,
  tokenId: string
): Promise<Nft> => {
  const [uri, owner] = await Promise.all([
    getNftUriEvm(endpoint, collectionAddress, tokenId),
    getNftOwnerEvm(endpoint, collectionAddress, tokenId),
  ]);

  return {
    collectionAddress: collectionAddress as HexAddr32,
    collectionName: undefined,
    description: undefined,
    isBurned: false,
    nftAddress: null,
    ownerAddress: owner,
    tokenId,
    uri,
  };
};
