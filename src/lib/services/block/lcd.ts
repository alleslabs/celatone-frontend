import axios from "axios";

import { parseWithError } from "lib/utils";
import { zBlockDataResponseLcd, zBlockLcd } from "../types";

export const getLatestBlockLcd = async (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/base/tendermint/v1beta1/blocks/latest`)
    .then(({ data }) => parseWithError(zBlockLcd, data).block.header.height);

export const getBlockDataLcd = async (endpoint: string, height: number) =>
  axios
    .get(
      `${endpoint}/cosmos/tx/v1beta1/txs/block/${encodeURIComponent(height)}`
    )
    .then(({ data }) => parseWithError(zBlockDataResponseLcd, data));
