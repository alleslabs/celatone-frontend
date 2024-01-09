import { useMemo } from "react";

import { isHex32Address, isTxHash } from "lib/utils";

export const useCollectionActivitiesExpression = (
  collectionAddress: string,
  search = ""
) => {
  const isNftAddress = isHex32Address(search);
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
      _and: search ? searchOption : {},
    }),
    [collectionAddress, search, searchOption]
  );
};
