import type { Coin } from "@cosmjs/stargate";
import axios from "axios";

import type { Addr } from "lib/types";

export const getBalances = async (
  endpoint: string,
  address: Addr
): Promise<Coin[]> => {
  const { data } = await axios.get<Coin[]>(`${endpoint}/${address}`);
  return data;
};
