/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

import { getIcnsNamesByAddressLcd } from "../name/lcd";
import { zAccountBech32LcdResponse, zAccountTypeLcd } from "../types";
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
    icns,
    projectInfo: null,
    publicInfo: null,
  };
};

export const getAccountTypeLcd = async (
  endpoint: string,
  address: BechAddr
) => {
  const [accountTypeLcd, isContract] = await Promise.all([
    axios
      .get(`${endpoint}/cosmos/auth/v1beta1/accounts/${encodeURI(address)}`)
      .then(({ data }) => parseWithError(zAccountTypeLcd, data)),
    axios
      .get(`${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(address)}`)
      .then(() => true)
      .catch(() => false),
  ]);

  return isContract ? AccountType.ContractAccount : accountTypeLcd;
};

export const getAccountBech32Lcd = async (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/auth/v1beta1/bech32`)
    .then(({ data }) => parseWithError(zAccountBech32LcdResponse, data));
