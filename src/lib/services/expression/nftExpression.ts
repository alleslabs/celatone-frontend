import type { HexAddr, HexAddr32 } from "lib/types";
import { isHexModuleAddress, isTxHash } from "lib/utils";

export const getCollectionsExpression = (search = "") => {
  if (search.trim().length === 0) return {};

  return {
    _or: [{ name: { _iregex: search } }, { id: { _eq: search.toLowerCase() } }],
  };
};

export const getCollectionActivitiesExpression = (
  collectionAddress: HexAddr32,
  search = ""
) => {
  const isNftAddress = isHexModuleAddress(search);
  const isHash = isTxHash(search);

  const tokenIdSearch = isNftAddress
    ? { nft_id: { _eq: search.toLowerCase() } }
    : { nft: { token_id: { _iregex: search } } };
  const txHashSearch = {
    transaction: {
      hash: {
        _eq: `\\x${search.toLowerCase()}`,
      },
    },
  };

  const searchOption = isHash ? txHashSearch : tokenIdSearch;

  return {
    collection_id: { _eq: collectionAddress },
    ...(search ? { _and: searchOption } : {}),
  };
};

export const getNftsExpression = (
  collectionAddress: HexAddr32,
  search = ""
) => {
  const orExpression = {
    _or: [
      { token_id: { _iregex: search } },
      ...(isHexModuleAddress(search)
        ? [{ id: { _eq: search.toLowerCase() } }]
        : []),
    ],
  };

  return {
    collection: { _eq: collectionAddress },
    is_burned: { _eq: false },
    ...(search.trim().length > 0 ? orExpression : {}),
  };
};

export const getNftsByAccountExpression = (
  accountAddress: HexAddr,
  collectionAddress?: HexAddr32,
  search = ""
) => {
  const orExpression = {
    _or: [
      { token_id: { _iregex: search } },
      ...(isHexModuleAddress(search)
        ? [{ id: { _eq: search.toLowerCase() } }]
        : []),
    ],
  };

  const collectionExpression = {
    collection: { _eq: collectionAddress?.toLowerCase() },
  };

  return {
    owner: { _eq: accountAddress },
    is_burned: { _eq: false },
    ...(collectionAddress ? collectionExpression : {}),
    ...(search.trim().length > 0 ? orExpression : {}),
  };
};
