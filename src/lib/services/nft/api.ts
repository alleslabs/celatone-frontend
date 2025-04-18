import type { HexAddr, HexAddr32 } from "lib/types";

import axios from "axios";
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

export const getMetadata = async (uri: string) =>
  axios.get(uri).then(({ data }) => parseWithError(zMetadata, data));

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
