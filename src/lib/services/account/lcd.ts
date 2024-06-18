/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

import { getIcnsNamesByAddressLcd } from "../name/lcd";
import { zAccountTypeLcd } from "../types";
import type { AccountData } from "../types";
import { AccountType } from "lib/types";
import type { BechAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getAccountDataLcd = async (
  endpoint: string,
  address: BechAddr
): Promise<AccountData> => {
  const icns = await getIcnsNamesByAddressLcd(endpoint, address);

  // TODO: Implement this function
  return {
    projectInfo: null,
    publicInfo: null,
    icns,
  };
};

export const getAccountTypeLcd = async (
  endpoint: string,
  address: BechAddr
) => {
  const accountTypeLcd = await axios
    .get(`${endpoint}/cosmos/auth/v1beta1/accounts/${address}`)
    .then((res) => parseWithError(zAccountTypeLcd, res.data));

  const isContract = await axios
    .get(`${endpoint}/cosmwasm/wasm/v1/contract/${address}`)
    .then(() => true)
    .catch(() => false);

  return isContract ? AccountType.ContractAccount : accountTypeLcd;
};
