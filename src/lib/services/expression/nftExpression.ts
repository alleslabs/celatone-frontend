import type { HexAddr32 } from "lib/types";
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
