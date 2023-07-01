import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { AddressReturnType } from "lib/app-provider";
import {
  useBaseApiRoute,
  useCurrentChain,
  useGetAddressType,
} from "lib/app-provider";
import type { Addr, ContractAddr } from "lib/types";

import { queryContract } from "./contract";
import type { ICNSNamesResponse } from "./ns";
import { queryAddressByICNSName, queryICNSNamesByAddress } from "./ns";

export const useICNSNamesByAddress = (
  address: Addr
): UseQueryResult<ICNSNamesResponse> => {
  const resolverEndpoint = useBaseApiRoute("icns_names");
  const getAddressType = useGetAddressType();
  const addressType = getAddressType(address);

  return useQuery({
    queryKey: ["icns_names", resolverEndpoint, address],
    queryFn: async () => queryICNSNamesByAddress(resolverEndpoint, address),
    refetchOnWindowFocus: false,
    enabled:
      addressType === "contract_address" || addressType === "user_address",
    retry: 1,
  });
};

interface AddressByICNSInternal {
  address: Addr;
  addressType: AddressReturnType;
}

export const useAddressByICNSName = (
  name: string
): UseQueryResult<AddressByICNSInternal> => {
  const resolverEndpoint = useBaseApiRoute("icns_address");
  const lcdEndpoint = useBaseApiRoute("rest");
  const getAddressType = useGetAddressType();
  const {
    chain: { bech32_prefix: bech32Prefix },
  } = useCurrentChain();

  const queryFn = async ({
    queryKey,
  }: QueryFunctionContext<string[]>): Promise<AddressByICNSInternal> => {
    const icnsAddress = await queryAddressByICNSName(
      queryKey[1],
      queryKey[2],
      queryKey[3]
    );
    let addressType = getAddressType(icnsAddress);
    if (addressType === "contract_address") {
      const contractData = await queryContract(
        lcdEndpoint,
        icnsAddress as ContractAddr
      );
      if (!contractData) addressType = "user_address";
    }
    return {
      address: icnsAddress,
      addressType,
    };
  };

  return useQuery({
    queryKey: ["icns_address", resolverEndpoint, name, bech32Prefix],
    queryFn,
    refetchOnWindowFocus: false,
    enabled: Boolean(name),
    retry: 1,
  });
};
