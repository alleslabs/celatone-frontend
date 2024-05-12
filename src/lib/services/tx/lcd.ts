import axios from "axios";

export const getTxDataLcd = async (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`)
    .then(({ data }) => data);
