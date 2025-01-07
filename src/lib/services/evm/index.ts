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
      retryOnMount: false,
      staleTime: Infinity,
    }
  );
};

export const useEvmCodesByAddress = (address: HexAddr20, enabled = true) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.EVM_CODES_BY_ADDRESS_LCD, lcdEndpoint, address],
    async () => getEvmCodesByAddress(lcdEndpoint, address),
    {
      enabled: enabled && address && isHexWalletAddress(address),
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useEvmContractInfoSequencer = (address: HexAddr20) => {
  const lcdEndpoint = useLcdEndpoint();
  const { bech32Prefix } = useCurrentChain();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.EVM_CONTRACT_INFO_SEQUENCER,
      lcdEndpoint,
      bech32Prefix,
      address,
    ],
    async () => getEvmContractInfoSequencer(lcdEndpoint, bech32Prefix, address),
    {
      enabled: address && isHexWalletAddress(address),
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};
