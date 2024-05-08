import axios from "axios";

import type { Option } from "lib/types";

export const getTxDataLcd = async (endpoint: string, txHash: Option<string>) =>
  axios
    .get(
      `${endpoint}/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash ?? "")}`
    )
    .then(({ data }) => data);
