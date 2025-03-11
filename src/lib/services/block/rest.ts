import axios from "axios";

import { parseWithError } from "lib/utils";
import { zBlockDataResponseRest, zBlockRest } from "../types";

export const getLatestBlockRest = async (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/base/tendermint/v1beta1/blocks/latest`)
    .then(({ data }) => parseWithError(zBlockRest, data).block.header.height);

export const getBlockDataRest = async (endpoint: string, height: number) =>
  axios
    .get(
      `${endpoint}/cosmos/tx/v1beta1/txs/block/${encodeURIComponent(height)}`
    )
    .then(({ data }) => parseWithError(zBlockDataResponseRest, data));
