import type { Addr, Nullish } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useInitia,
  useValidateAddress,
} from "lib/app-provider";
import { useL1InfoByNetworkType } from "lib/hooks";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";

import { getAddressByInitiaUsername, getInitiaUsernameByAddress } from "./rest";

export const useInitiaUsernameByAddress = (
  address: Nullish<Addr>,
  enabled = true
) => {
  const { l1Rest, l1Usernames } = useL1InfoByNetworkType();
  const isInitia = useInitia();
  const { isSomeValidAddress } = useValidateAddress();
  const formatAddress = useFormatAddresses();

  const queryFn = async () => {
    if (!address)
      throw new Error("address is undefined (useInitiaUsernameByAddress)");

    const username = await getInitiaUsernameByAddress(
      l1Rest,
      l1Usernames,
      formatAddress(address).hex
    );
    return { username };
  };

  return useQuery({
    enabled: enabled && isInitia && !!address && isSomeValidAddress(address),
    queryFn,
    queryKey: [CELATONE_QUERY_KEYS.INITIA_USERNAME_BY_ADDRESS, address],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAddressByInitiaUsername = (
  username: string,
  enabled = true
) => {
  const { l1Rest, l1Usernames } = useL1InfoByNetworkType();
  const isInitia = useInitia();
  const formatAddress = useFormatAddresses();

  const queryFn = async () => {
    const address = await getAddressByInitiaUsername(
      l1Rest,
      l1Usernames,
      username
    );
    return { address: address ? formatAddress(address).address : null };
  };
  return useQuery({
    enabled: enabled && username.length > 0 && isInitia,
    queryFn,
    queryKey: [CELATONE_QUERY_KEYS.ADDRESS_BY_INITIA_USERNAME, username],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
