import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useCurrentChain,
  useLcdEndpoint,
} from "lib/app-provider";
import type { HexAddr20 } from "lib/types";
import { isHexWalletAddress } from "lib/utils";

import {
  getEvmCodesByAddress,
  getEvmContractInfoSequencer,
  getEvmDenomByAddressLcd,
  getEvmParams,
} from "./lcd";

export const useEvmParams = () => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.EVM_PARAMS_LCD, lcdEndpoint],
    async () => getEvmParams(lcdEndpoint),
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
      retryOnMount: false,
    }
  );
};

export const useEvmCodesByAddress = (address: HexAddr20, enabled = true) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.EVM_CODES_BY_ADDRESS_LCD, lcdEndpoint, address],
    async () => getEvmCodesByAddress(lcdEndpoint, address),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: enabled && address && isHexWalletAddress(address),
    }
  );
};

export const useEvmContractInfoSequencer = (address: HexAddr20) => {
  const lcdEndpoint = useLcdEndpoint();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.EVM_CONTRACT_INFO_SEQUENCER,
      lcdEndpoint,
      prefix,
      address,
    ],
    async () => getEvmContractInfoSequencer(lcdEndpoint, prefix, address),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: address && isHexWalletAddress(address),
    }
  );
};

export const useEvmDenomByAddressLcd = (address: HexAddr20) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.EVM_DENOM_BY_ADDRESS_LCD, lcdEndpoint, address],
    async () => getEvmDenomByAddressLcd(lcdEndpoint, address),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: address && isHexWalletAddress(address),
    }
  );
};
