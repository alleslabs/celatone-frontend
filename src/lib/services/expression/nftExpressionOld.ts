import type { HexAddr, HexAddr32 } from "lib/types";
import { isHexModuleAddress, isTxHash } from "lib/utils";

export const getCollectionsExpressionOld = (search = "") => {
  if (search.trim().length === 0) return {};

  return {
    _or: [
      { name: { _iregex: search } },
      { vm_address: { vm_address: { _eq: search.toLowerCase() } } },
    ],
  };
};

export const getCollectionActivitiesExpressionOld = (
  collectionAddress: HexAddr32,
  search = ""
) => {
  const isNftAddress = isHexModuleAddress(search);
  const isHash = isTxHash(search);

  const tokenIdSearch = {
    nft: isNftAddress
      ? { vm_address: { vm_address: { _eq: search.toLowerCase() } } }
      : { token_id: { _iregex: search } },
  };
  const txHashSearch = {
    transaction: {
      hash: {
        _eq: `\\x${search.toLowerCase()}`,
      },
    },
  };

  const searchOption = isHash ? txHashSearch : tokenIdSearch;

  return {
    collection: { vm_address: { vm_address: { _eq: collectionAddress } } },
    ...(search ? { _and: searchOption } : {}),
  };
};

export const getNftsExpressionOld = (
  collectionAddress: HexAddr32,
  search = ""
) => {
  const orExpression = {
    _or: [
      { token_id: { _iregex: search } },
      ...(isHexModuleAddress(search)
        ? [{ vm_address: { vm_address: { _eq: search.toLowerCase() } } }]
        : []),
    ],
  };

  return {
    collectionByCollection: {
      vm_address: { vm_address: { _eq: collectionAddress } },
    },
    is_burned: { _eq: false },
    ...(search.trim().length > 0 ? orExpression : {}),
  };
};

export const getNftsByAccountExpressionOld = (
  accountAddress: HexAddr,
  collectionAddress?: HexAddr32,
  search = ""
) => {
  const orExpression = {
    _or: [
      { token_id: { _iregex: search } },
      ...(isHexModuleAddress(search)
        ? [{ vm_address: { vm_address: { _eq: search.toLowerCase() } } }]
        : []),
    ],
  };

  return {
    vmAddressByOwner: { vm_address: { _eq: accountAddress } },
    is_burned: { _eq: false },
    ...(collectionAddress
      ? {
          collectionByCollection: {
            vm_address: {
              vm_address: { _eq: collectionAddress.toLowerCase() },
            },
          },
        }
      : {}),
    ...(search.trim().length > 0 ? orExpression : {}),
  };
};
