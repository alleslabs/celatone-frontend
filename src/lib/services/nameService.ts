import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { AddressReturnType } from "lib/app-provider";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
  useGetAddressType,
} from "lib/app-provider";
import type { BechAddr, BechAddr32, Option } from "lib/types";

import type { ICNSNamesResponse } from "./ns";
import { queryAddressByICNSName, queryICNSNamesByAddress } from "./ns";
import { queryContract } from "./wasm/contract";

export const useICNSNamesByAddress = (
  address: Option<BechAddr>
): UseQueryResult<ICNSNamesResponse> => {
  const resolverEndpoint = useBaseApiRoute("icns_names");
  const getAddressType = useGetAddressType();
  const addressType = getAddressType(address);

  const queryFn = async (): Promise<ICNSNamesResponse> => {
    if (!address) throw new Error("address is undefined");
    const icnsNames = await queryICNSNamesByAddress(resolverEndpoint, address);
    const primaryIndex = icnsNames.names.indexOf(icnsNames.primary_name);
    if (primaryIndex > -1) {
      icnsNames.names.splice(primaryIndex, 1);
      icnsNames.names.unshift(icnsNames.primary_name);
    }
    return icnsNames;
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.ICNS_NAMES_BY_ADDRESS, resolverEndpoint, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
      enabled:
        addressType === "contract_address" || addressType === "user_address",
      retry: 1,
    }
  );
};

interface AddressByICNSInternal {
  address: BechAddr;
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
    // Strip bech32 prefix to allow searching with .prefix (e.g. example.osmo)
    const [stripPrefixName] = queryKey[2].split(`.${bech32Prefix}`);
    const icnsAddress = await queryAddressByICNSName(
      queryKey[1],
      stripPrefixName,
      queryKey[3]
    );
    let addressType = getAddressType(icnsAddress);
    if (addressType === "contract_address") {
      const contractData = await queryContract(
        lcdEndpoint,
        icnsAddress as BechAddr32
      );
      if (!contractData) addressType = "user_address";
    }
    return {
      address: icnsAddress,
      addressType,
    };
  };

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.ADDRESS_BY_ICNS_NAME,
      resolverEndpoint,
      name,
      bech32Prefix,
    ],
    queryFn,
    refetchOnWindowFocus: false,
    enabled: Boolean(name),
    retry: 1,
  });
};
