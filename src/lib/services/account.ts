import axios from "axios";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import type { Balance, HumanAddr, Option } from "lib/types";

export const getAccountBalanceInfo = async (
  walletAddr: HumanAddr,
  chainName: Option<string>,
  chainId: Option<string>
): Promise<Balance[]> => {
  if (!chainName || !chainId)
    throw new Error("Invalid chain (getAccountBalanceInfo)");

  const { data } = await axios.get<Balance[]>(
    `${CELATONE_API_ENDPOINT}/balances/${getChainApiPath(
      chainName
    )}/${chainId}/${walletAddr}`
  );
  return data;
};
