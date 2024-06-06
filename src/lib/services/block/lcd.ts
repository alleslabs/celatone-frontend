import axios from "axios";

import { zBlockDataResponseLcd, zBlockLcd } from "../types";
import { parseWithError } from "lib/utils";

export const getLatestBlockLcd = async (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/base/tendermint/v1beta1/blocks/latest`)
    .then(({ data }) => parseWithError(zBlockLcd, data).block.header.height);

export const getBlockDataLcd = async (endpoint: string, height: number) => {
  return axios
    .get(
      `${endpoint}/cosmos/tx/v1beta1/txs/block/${encodeURIComponent(height)}`
    )
    .then(({ data }) => parseWithError(zBlockDataResponseLcd, data));
};
