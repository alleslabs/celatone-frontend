import axios from "axios";

import {
  zCollectionByCollectionAddressResponseSequencer,
  zCollectionsByAccountResponseSequencer,
} from "../types";
import type { HexAddr, HexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";

export const getCollectionsByAccountSequencer = async (
  endpoint: string,
  accountAddress: HexAddr
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/collections/by_account/${encodeURI(accountAddress)}`,
      {
        params: {
          "pagination.count_total": false,
          "pagination.reverse": true,
        },
      }
    )
    .then(({ data }) =>
      parseWithError(zCollectionsByAccountResponseSequencer, data)
    );

export const getCollectionByCollectionAddressSequence = async (
  endpoint: string,
  collectionAddress: HexAddr32
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/collections/${encodeURI(collectionAddress)}`
    )
    .then(({ data }) =>
      parseWithError(zCollectionByCollectionAddressResponseSequencer, data)
    );
