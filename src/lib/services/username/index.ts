import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useInitia,
  useValidateAddress,
} from "lib/app-provider";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import type { Addr, Nullish } from "lib/types";

import { useL1InfoByNetworkType } from "./hooks";
import { getAddressByInitiaUsername, getInitiaUsernameByAddress } from "./rest";

export const useInitiaUsernameByAddress = (
  address: Nullish<Addr>,
  enabled = true
) => {
  const getL1InfoByNetworkType = useL1InfoByNetworkType();
  const isInitia = useInitia();
  const { isSomeValidAddress } = useValidateAddress();
  const formatAddress = useFormatAddresses();

  const queryFn = async () => {
    if (!address)
      throw new Error("address is undefined (useInitiaUsernameByAddress)");

    const { l1Rest, l1Usernames } = getL1InfoByNetworkType();
    const username = await getInitiaUsernameByAddress(
      l1Rest,
      l1Usernames,
      formatAddress(address).hex
    );
    return { username };
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.INITIA_USERNAME_BY_ADDRESS, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
      enabled: enabled && isInitia && !!address && isSomeValidAddress(address),
      retry: 1,
    }
  );
};

export const useAddressByInitiaUsername = (
  username: string,
  enabled = true
) => {
  const getL1InfoByNetworkType = useL1InfoByNetworkType();
  const isInitia = useInitia();
  const formatAddress = useFormatAddresses();

  const queryFn = async () => {
    const { l1Rest, l1Usernames } = getL1InfoByNetworkType();
    const address = await getAddressByInitiaUsername(
      l1Rest,
      l1Usernames,
      username
    );
    return { address: address ? formatAddress(address).address : null };
  };
  return useQuery(
    [CELATONE_QUERY_KEYS.ADDRESS_BY_INITIA_USERNAME, username],
    queryFn,
    {
      refetchOnWindowFocus: false,
      enabled: enabled && username.length > 0 && isInitia,
      retry: 1,
    }
  );
};
