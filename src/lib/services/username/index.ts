import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useLcdEndpoint, useValidateAddress } from "lib/app-provider";
import type { HexAddr, Option } from "lib/types";

import { getAddressByInitiaUsername, getInitiaUsernameByAddress } from "./lcd";

export interface InitiaUsernameByAddressResponse {
  username: string;
}

export interface AddressByInitiaUsernameResponse {
  address: Option<HexAddr>;
}

export const useInitiaUsernameByAddress = (
  address: Option<HexAddr>,
  enabled = true
): UseQueryResult<InitiaUsernameByAddressResponse> => {
  const lcdEndpoint = useLcdEndpoint();

  const { isSomeValidAddress } = useValidateAddress();

  const queryFn = async (): Promise<InitiaUsernameByAddressResponse> => {
    if (!address) throw new Error("address is undefined");
    const username = await getInitiaUsernameByAddress(lcdEndpoint, address);
    if (username === null) {
      throw new Error("No username found for the given address");
    }
    return { username };
  };

  return useQuery([lcdEndpoint, address], queryFn, {
    refetchOnWindowFocus: false,
    enabled: enabled && address && isSomeValidAddress(address),
    retry: 1,
  });
};

export const useAddressByInitiaUsername = (
  username: string,
  enabled = true
): UseQueryResult<AddressByInitiaUsernameResponse> => {
  const lcdEndpoint = useLcdEndpoint();

  const queryFn = async (): Promise<AddressByInitiaUsernameResponse> => {
    // if (!username) throw new Error("address is undefined");
    const address = await getAddressByInitiaUsername(lcdEndpoint, username);
    if (address === null) {
      throw new Error("No username found for the given address");
    }
    return { address: address as HexAddr };
  };
  return useQuery([lcdEndpoint, username], queryFn, {
    refetchOnWindowFocus: false,
    enabled,
    retry: 1,
  });
};
