import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useInitia,
  useValidateAddress,
} from "lib/app-provider";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import type { Addr, Nullish } from "lib/types";

import { getAddressByInitiaUsername, getInitiaUsernameByAddress } from "./lcd";

export const useInitiaUsernameByAddress = (
  address: Nullish<Addr>,
  enabled = true
) => {
  const { isSomeValidAddress } = useValidateAddress();
  const formatAddress = useFormatAddresses();

  const isInitia = useInitia();
  const queryFn = async () => {
    if (!address)
      throw new Error("address is undefined (useInitiaUsernameByAddress)");

    const username = await getInitiaUsernameByAddress(
      formatAddress(address).hex
    );
    return { username };
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.INITIA_USERNAME_BY_ADDRESS, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
      enabled:
        !!enabled && !!isInitia && !!address && isSomeValidAddress(address),
      retry: 1,
    }
  );
};

export const useAddressByInitiaUsername = (
  username: string,
  enabled = true
) => {
  const isInitia = useInitia();
  const formatAddress = useFormatAddresses();

  const queryFn = async () => {
    const address = await getAddressByInitiaUsername(username);
    return { address: address ? formatAddress(address).address : null };
  };
  return useQuery(
    [CELATONE_QUERY_KEYS.ADDRESS_BY_INITIA_USERNAME, username],
    queryFn,
    {
      refetchOnWindowFocus: false,
      enabled: !!enabled && !!isInitia,
      retry: 1,
    }
  );
};
