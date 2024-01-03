import axios from "axios";

import type { BechAddr } from "lib/types";

export interface ICNSNamesResponse {
  names: string[];
  primary_name: string;
}

export const queryICNSNamesByAddress = async (
  baseEndpoint: string,
  address: BechAddr
) => {
  const { data } = await axios.get<ICNSNamesResponse>(
    `${baseEndpoint}/${address}`
  );
  return data;
};

export const queryAddressByICNSName = async (
  baseEndpoint: string,
  name: string,
  bech32Prefix: string
): Promise<BechAddr> => {
  const { data } = await axios.get(`${baseEndpoint}/${name}/${bech32Prefix}`);
  return data.address;
};
