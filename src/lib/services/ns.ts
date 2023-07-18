import axios from "axios";

import type { Addr } from "lib/types";

export interface ICNSNamesResponse {
  names: string[];
  primary_name: string;
}

export const queryICNSNamesByAddress = async (
  baseEndpoint: string,
  address: Addr
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
): Promise<Addr> => {
  const { data } = await axios.get(`${baseEndpoint}/${name}/${bech32Prefix}`);
  return data.address;
};
