import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useCurrentChain,
} from "lib/app-provider";
import type { HexAddr20 } from "lib/types";
import { isHexWalletAddress } from "lib/utils";

import {
  getEvmCodesByAddress,
  getEvmContractInfoSequencer,
  getEvmParams,
} from "./lcd";

export const useEvmParams = () => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

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
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

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
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
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
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: address && isHexWalletAddress(address),
    }
  );
};
