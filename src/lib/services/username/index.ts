import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useInitia,
  useValidateAddress,
} from "lib/app-provider";
import type { Addr, Option } from "lib/types";

import { getAddressByInitiaUsername, getInitiaUsernameByAddress } from "./lcd";

export const useInitiaUsernameByAddress = (
  address: Option<Addr>,
  enabled = true
) => {
  const { isSomeValidAddress } = useValidateAddress();
  const isInitia = useInitia();
  const queryFn = async () => {
    if (!address) throw new Error("address is undefined");
    const username = await getInitiaUsernameByAddress(address);
    if (username === null) {
      throw new Error("No username found for the given address");
    }
    return { username };
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.INITIA_USERNAME_BY_ADDRESS, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
      enabled: enabled && isInitia && address && isSomeValidAddress(address),
      retry: 1,
    }
  );
};

export const useAddressByInitiaUsername = (
  username: string,
  enabled = true
) => {
  const isInitia = useInitia();
  const queryFn = async () => {
    // if (!username) throw new Error("address is undefined");
    const address = await getAddressByInitiaUsername(username);
    if (address === null) {
      throw new Error("No username found for the given address");
    }
    return { address };
  };
  return useQuery(
    [CELATONE_QUERY_KEYS.ADDRESS_BY_INITIA_USERNAME, username],
    queryFn,
    {
      refetchOnWindowFocus: false,
      enabled: enabled && isInitia,
      retry: 1,
    }
  );
};
