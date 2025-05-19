import type { JsonFragment } from "ethers";
import type { BechAddr32, HexAddr, HexAddr20, HexAddr32 } from "lib/types";

import { Interface } from "ethers";
import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";

import type { Nft } from "../types";

import { getEthCall } from "../evm/json-rpc";
import { getMoveViewJsonRest } from "../move/module/rest";
import { getCollectionByCollectionAddressWasmRest } from "../nft-collection/rest";
import { zNftInfoMoveRest, zNftInfoWasmRest } from "../types";
import { getContractQueryRest } from "../wasm/contract/rest";

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
  const [collection, info] = await Promise.all([
    getCollectionByCollectionAddressWasmRest(endpoint, collectionAddress),
    getNftInfoWasmRest(endpoint, collectionAddress, tokenId),
  ]);

  return {
    collectionAddress,
    collectionName: undefined,
    description: collection.description,
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
const ERC721ViewAbi = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as JsonFragment[];

const getNftUriEvmRest = async (
  endpoint: string,
  collectionAddress: HexAddr,
  tokenId: string
) => {
  const iface = new Interface(ERC721ViewAbi);
  const data = iface.encodeFunctionData("tokenURI", [tokenId]);
  const result = await getEthCall(
    endpoint,
    null,
    collectionAddress as HexAddr20,
    data
  );
  return iface.decodeFunctionResult("tokenURI", result).toString();
};

const getNftOwnerEvmRest = async (
  endpoint: string,
  collectionAddress: HexAddr,
  tokenId: string
) => {
  const iface = new Interface(ERC721ViewAbi);
  const data = iface.encodeFunctionData("ownerOf", [tokenId]);
  const result = await getEthCall(
    endpoint,
    null,
    collectionAddress as HexAddr20,
    data
  );
  return zHexAddr.parse(
    iface.decodeFunctionResult("ownerOf", result).toString()
  );
};

export const getNftByTokenIdEvmRest = async (
  endpoint: string,
  collectionAddress: HexAddr,
  tokenId: string
): Promise<Nft> => {
  const [uri, owner] = await Promise.all([
    getNftUriEvmRest(endpoint, collectionAddress, tokenId),
    getNftOwnerEvmRest(endpoint, collectionAddress, tokenId),
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
