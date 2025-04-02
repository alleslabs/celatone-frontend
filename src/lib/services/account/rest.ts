import type { BechAddr } from "lib/types";

import axios from "axios";
import { AccountType } from "lib/types";
import { parseWithError } from "lib/utils";

import type { AccountData } from "../types";

import { getIcnsNamesByAddressRest } from "../name/rest";
import { zAccountBech32RestResponse, zAccountTypeRest } from "../types";

export const getAccountDataRest = async (
  endpoint: string,
  address: BechAddr
): Promise<AccountData> => {
  const icns = await getIcnsNamesByAddressRest(endpoint, address);

  // TODO: Implement this function
  return {
    projectInfo: null,
    publicInfo: null,
    icns,
  };
};

export const getAccountTypeRest = async (
  endpoint: string,
  address: BechAddr
) => {
  const [accountTypeRest, isContract] = await Promise.all([
    axios
      .get(`${endpoint}/cosmos/auth/v1beta1/accounts/${encodeURI(address)}`)
      .then(({ data }) => parseWithError(zAccountTypeRest, data)),
    axios
      .get(`${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(address)}`)
      .then(() => true)
      .catch(() => false),
  ]);

  return isContract ? AccountType.ContractAccount : accountTypeRest;
};

export const getAccountBech32Rest = async (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/auth/v1beta1/bech32`)
    .then(({ data }) => parseWithError(zAccountBech32RestResponse, data));
