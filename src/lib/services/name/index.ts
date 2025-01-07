import { useQuery } from "@tanstack/react-query";

import { getContractLcd } from "../wasm/contract/lcd";
import {
  CELATONE_QUERY_KEYS,
  useCurrentChain,
  useGetAddressType,
  useLcdEndpoint,
} from "lib/app-provider";
import type { BechAddr, BechAddr32, Option } from "lib/types";

import { getAddressByIcnsNameLcd, getIcnsNamesByAddressLcd } from "./lcd";

export const useIcnsNamesByAddressLcd = (
  address: Option<BechAddr>,
  enabled = true
) => {
  const endpoint = useLcdEndpoint();

  const queryFn = async () => {
    if (!address) throw new Error("address is undefined");
    const icnsNames = await getIcnsNamesByAddressLcd(endpoint, address);
    const primaryIndex = icnsNames.names.indexOf(icnsNames.primaryName);

    if (primaryIndex > -1) {
      icnsNames.names.splice(primaryIndex, 1);
      icnsNames.names.unshift(icnsNames.primaryName);
    }

    return icnsNames;
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.ICNS_NAMES_BY_ADDRESS_LCD, endpoint, address],
    queryFn,
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useAddressByIcnsNameLcd = (name: string, enabled = true) => {
  const lcdEndpoint = useLcdEndpoint();
  const getAddressType = useGetAddressType();
  const { bech32Prefix } = useCurrentChain();
  const queryFn = async () => {
    // Strip bech32 prefix to allow searching with .prefix (e.g. example.osmo)
    const [stripPrefixName] = name.split(`.${bech32Prefix}`);
    const { address: icnsAddress } = await getAddressByIcnsNameLcd(
      lcdEndpoint,
      stripPrefixName,
      bech32Prefix
    );
    let addressType = getAddressType(icnsAddress);
    if (addressType === "contract_address") {
      const contractData = await getContractLcd(
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
    enabled: enabled && Boolean(name),
    queryFn,
    queryKey: [
      CELATONE_QUERY_KEYS.ADDRESS_BY_ICNS_NAME_LCD,
      lcdEndpoint,
      name,
      bech32Prefix,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
