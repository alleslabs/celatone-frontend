import type { JsonFragment } from "ethers";
import type { HexAddr, HexAddr20 } from "lib/types";

import { Interface } from "ethers";
import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";

import { getEthCall } from "../evm/json-rpc";
import { zNftRoyaltyInfoEvm } from "../types/nft";

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
  // ERC-2981
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "salePrice", type: "uint256" },
    ],
    name: "royaltyInfo",
    outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as JsonFragment[];

export const getNftUriEvm = async (
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

export const getNftOwnerEvm = async (
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

export const getNftRoyaltyInfoEvm = async (
  endpoint: string,
  collectionAddress: HexAddr,
  tokenId: string
) => {
  const iface = new Interface(ERC721ViewAbi);
  const data = iface.encodeFunctionData("royaltyInfo", [tokenId, 100]);
  const result = await getEthCall(
    endpoint,
    null,
    collectionAddress as HexAddr20,
    data
  );
  return parseWithError(
    zNftRoyaltyInfoEvm,
    iface.decodeFunctionResult("royaltyInfo", result).toArray()
  );
};
