import axios from "axios";

import type { Nft } from "../types";
import { zNftsByAccountResponseSequencer } from "../types";
import type { HexAddr, HexAddr32, Nullable } from "lib/types";
import { parseWithError } from "lib/utils";

export const getNftsByAccountSequencer = async (
  endpoint: string,
  accountAddress: HexAddr,
  collectionAddress?: HexAddr32
) => {
  const nfts: Nft[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/indexer/nft/v1/tokens/by_account/${encodeURI(accountAddress)}`,
        {
          params: {
            "pagination.reverse": true,
            "pagination.key": paginationKey,
            collection_addr: collectionAddress,
          },
        }
      )
      .then(({ data }) =>
        parseWithError(zNftsByAccountResponseSequencer, data)
      );

    nfts.push(...res.nfts);

    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return {
    nfts,
    total: nfts.length,
  };
};
