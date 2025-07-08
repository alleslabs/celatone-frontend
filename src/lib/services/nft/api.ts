import type { Addr, HexAddr, HexAddr32 } from "lib/types";

import axios from "axios";
import { GLYPH_API_URL } from "env";
import { parseWithError } from "lib/utils";

import {
  zMetadata,
  zNft,
  zNftMintInfoResponse,
  zNftMutateEventsResponse,
  zNftsByAccountAddressResponse,
  zNftsResponse,
  zNftTxsResponse,
} from "../types";
import { getIpfsUrl } from "../utils";

export const getNftsByCollectionAddress = async (
  endpoint: string,
  collectionAddress: HexAddr32,
  search: string,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}/${encodeURI(collectionAddress)}`, {
      params: {
        limit,
        offset,
        search,
      },
    })
    .then(({ data }) => parseWithError(zNftsResponse, data));

export const getNftByNftAddress = async (
  endpoint: string,
  collectionAddress: HexAddr32,
  nftAddress: HexAddr32
) =>
  axios
    .get(
      `${endpoint}/${encodeURI(collectionAddress)}/nft/${encodeURI(nftAddress)}`
    )
    .then(({ data }) => parseWithError(zNft, data));

export const getNftsByAccountAddress = async (
  endpoint: string,
  accountAddress: HexAddr,
  limit: number,
  offset: number,
  collectionAddress?: HexAddr32,
  search?: string
) =>
  axios
    .get(`${endpoint}/account/${encodeURI(accountAddress)}`, {
      params: {
        collection_address: collectionAddress,
        limit,
        offset,
        search,
      },
    })
    .then(({ data }) => parseWithError(zNftsByAccountAddressResponse, data));

export const getNftMintInfo = async (endpoint: string, nftAddress: HexAddr32) =>
  axios
    .get(`${endpoint}/nft/${encodeURI(nftAddress)}/mint-info`)
    .then(({ data }) => parseWithError(zNftMintInfoResponse, data));

export const getMetadata = async (uri: string) => {
  const baseUrl = getIpfsUrl(uri);

  const tryFetch = async (url: string) => {
    const { data } = await axios.get(url);
    return parseWithError(zMetadata, data);
  };

  try {
    return await tryFetch(baseUrl);
  } catch (error) {
    // Retry with .json suffix only for ipfs:// URIs
    if (uri.startsWith("ipfs://")) {
      return await tryFetch(`${baseUrl}.json`);
    }
    throw error;
  }
};

export const getGlyphImage = (
  chainId: string,
  collectionAddress: Addr,
  objectAddress: string,
  width = "",
  height = ""
) =>
  axios
    .get<Blob>(
      `${GLYPH_API_URL}/${chainId}/${collectionAddress}/${objectAddress}?width=${width}&height=${height}`,
      {
        responseType: "blob",
      }
    )
    .then(({ data }) => data);

export const getNftTxs = async (
  endpoint: string,
  nftAddress: HexAddr32,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}/nft/${encodeURI(nftAddress)}/txs`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zNftTxsResponse, data));

export const getNftMutateEvents = async (
  endpoint: string,
  nftAddress: HexAddr32,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}/nft/${encodeURI(nftAddress)}/mutate-events`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zNftMutateEventsResponse, data));
