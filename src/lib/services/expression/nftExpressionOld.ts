import { useMemo } from "react";

import type { HexAddr, HexAddr32 } from "lib/types";
import { isHexModuleAddress, isTxHash } from "lib/utils";

export const useCollectionsExpressionOld = (search = "") =>
  useMemo(() => {
    if (search.trim().length === 0) return {};

    return {
      _or: [
        { name: { _iregex: search } },
        { vm_address: { vm_address: { _eq: search.toLowerCase() } } },
      ],
    };
  }, [search]);

export const useCollectionActivitiesExpressionOld = (
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

  return useMemo(
    () => ({
      collection: { vm_address: { vm_address: { _eq: collectionAddress } } },
      ...(search ? { _and: searchOption } : {}),
    }),
    [collectionAddress, search, searchOption]
  );
};

export const useNftsExpressionOld = (
  collectionAddress: HexAddr32,
  search = ""
) =>
  useMemo(() => {
    const orExpression = {
      _or: [
        { token_id: { _iregex: search } },
        ...(isHexModuleAddress(search)
          ? [{ vm_address: { vm_address: { _eq: search.toLowerCase() } } }]
          : []),
      ],
    };

    return {
      collection: { _eq: collectionAddress },
      is_burned: { _eq: false },
      ...(search.trim().length > 0 ? orExpression : {}),
    };
  }, [collectionAddress, search]);

export const useNftsByAccountExpressionOld = (
  accountAddress: HexAddr,
  collectionAddress?: HexAddr32,
  search = ""
) =>
  useMemo(() => {
    const collectionExpression = collectionAddress
      ? [
          {
            vm_address: {
              vm_address: { _eq: collectionAddress.toLowerCase() },
            },
          },
        ]
      : [];
    const orExpression = {
      _or: [{ token_id: { _iregex: search } }, ...collectionExpression],
    };

    return {
      vmAddressByOwner: { vm_address: { _eq: accountAddress } },
      is_burned: { _eq: false },
      ...(search.trim().length > 0 ? orExpression : {}),
    };
  }, [accountAddress, collectionAddress, search]);
