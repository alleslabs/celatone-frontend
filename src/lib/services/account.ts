import axios from "axios";

import type { Addr, Balance } from "lib/types";

export const getAccountBalanceInfo = async (
  baseApiRoute: string,
  walletAddr: Addr
): Promise<Balance[]> => {
  const { data } = await axios.get<Balance[]>(`${baseApiRoute}/${walletAddr}`);
  return data;
};
