import axios from "axios";

import { zBlockLcd } from "../types";
import { parseWithError } from "lib/utils";

export const getLatestBlockLcd = async (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/base/tendermint/v1beta1/blocks/latest`)
    .then(({ data }) => parseWithError(zBlockLcd, data).block.header.height);
