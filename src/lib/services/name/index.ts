import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useCurrentChain,
  useGetAddressType,
} from "lib/app-provider";
import type { BechAddr, BechAddr32, Option } from "lib/types";

import { getAddressByIcnsNameRest, getIcnsNamesByAddressRest } from "./rest";
import { getContractRest } from "../wasm/contract/rest";

export const useIcnsNamesByAddressRest = (
  address: Option<BechAddr>,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const queryFn = async () => {
    if (!address) throw new Error("address is undefined");
    const icnsNames = await getIcnsNamesByAddressRest(restEndpoint, address);
    const primaryIndex = icnsNames.names.indexOf(icnsNames.primaryName);

    if (primaryIndex > -1) {
      icnsNames.names.splice(primaryIndex, 1);
      icnsNames.names.unshift(icnsNames.primaryName);
    }

    return icnsNames;
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.ICNS_NAMES_BY_ADDRESS_REST, restEndpoint, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
      enabled,
      retry: 1,
    }
  );
};

export const useAddressByIcnsNameRest = (name: string, enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const getAddressType = useGetAddressType();
  const { bech32Prefix } = useCurrentChain();
  const queryFn = async () => {
    // Strip bech32 prefix to allow searching with .prefix (e.g. example.osmo)
    const [stripPrefixName] = name.split(`.${bech32Prefix}`);
    const { address: icnsAddress } = await getAddressByIcnsNameRest(
      restEndpoint,
      stripPrefixName,
      bech32Prefix
    );
    let addressType = getAddressType(icnsAddress);
    if (addressType === "contract_address") {
      const contractData = await getContractRest(
        restEndpoint,
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
      CELATONE_QUERY_KEYS.ADDRESS_BY_ICNS_NAME_REST,
      restEndpoint,
      name,
      bech32Prefix,
    ],
    queryFn,
    refetchOnWindowFocus: false,
    enabled: enabled && Boolean(name),
    retry: 1,
  });
};
