import axios from "axios";
import { parseWithError } from "lib/utils";

import { zBlockDataResponseRest, zBlockRest } from "../types";
import { queryWithArchivalFallback } from "../utils";

export const getLatestBlockRest = (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/base/tendermint/v1beta1/blocks/latest`)
    .then(({ data }) => parseWithError(zBlockRest, data).block.header.height);

export const getBlockDataRest = (endpoint: string, height: number) => {
  const fetch = (endpoint: string) =>
    axios
      .get(
        `${endpoint}/cosmos/tx/v1beta1/txs/block/${encodeURIComponent(height)}`
      )
      .then(({ data }) => parseWithError(zBlockDataResponseRest, data));

  return queryWithArchivalFallback(endpoint, fetch);
};
