import type { UseQueryOptions } from "@tanstack/react-query";
import type { HexAddr20, Nullable } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useCurrentChain,
  useEvmConfig,
} from "lib/app-provider";
import { zHexAddr20 } from "lib/types";
import { bech32AddressToHex, isHexWalletAddress } from "lib/utils";

import type { ProxyResult } from "./json-rpc/proxy/types";

import { getEthCall, getEvmProxyTarget } from "./json-rpc";
import {
  getEvmCodesByAddress,
  getEvmContractInfoSequencer,
  getEvmParams,
} from "./rest";

export const useEvmParams = () => {
  const {
    chainConfig: {
      features: { evm },
      rest: restEndpoint,
    },
  } = useCelatoneApp();

  return useQuery({
    enabled: evm.enabled,
    queryFn: async () => {
      if (!evm.enabled) throw new Error("EVM is not enabled (useEvmParams)");
      return getEvmParams(restEndpoint);
    },
    queryKey: [CELATONE_QUERY_KEYS.EVM_PARAMS_REST, restEndpoint, evm.enabled],
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
    staleTime: Infinity,
  });
};

export const useEvmCodesByAddress = (address: HexAddr20, enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery({
    enabled: enabled && address && isHexWalletAddress(address),
    queryFn: async () => getEvmCodesByAddress(restEndpoint, address),
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_CODES_BY_ADDRESS_REST,
      restEndpoint,
      address,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useEvmContractInfoSequencer = (address: HexAddr20) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_CONTRACT_INFO_SEQUENCER,
      indexerEndpoint,
      bech32Prefix,
      address,
    ],
    queryFn: async () =>
      getEvmContractInfoSequencer(indexerEndpoint, bech32Prefix, address),
    enabled: address && isHexWalletAddress(address),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useEthCall = (
  to: HexAddr20,
  data: string,
  options: Partial<UseQueryOptions<string>>
) => {
  const { address } = useCurrentChain();
  const from = address
    ? zHexAddr20.parse(bech32AddressToHex(address))
    : undefined;
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery<string>({
    enabled: evm.enabled && !!evm.jsonRpc,
    queryFn: async () => {
      if (!evm.enabled) throw new Error("EVM is not enabled (useEthCall)");
      return getEthCall(evm.jsonRpc, from ?? null, to, data);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_ETH_CALL,
      evm.enabled && !!evm.jsonRpc,
      from,
      to,
      data,
    ],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
};

export const useGetEvmProxyTarget = (
  proxyAddress: HexAddr20,
  options?: UseQueryOptions<Nullable<ProxyResult>>
) => {
  const {
    chainConfig: {
      features: { evm },
    },
  } = useCelatoneApp();
  return useQuery<Nullable<ProxyResult>>({
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useGetEvmProxyTarget)");
      return getEvmProxyTarget(evm.jsonRpc, proxyAddress);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_PROXY_TARGET,
      evm.enabled && evm.jsonRpc,
      proxyAddress,
    ],

    enabled: evm.enabled && !!evm.jsonRpc,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
};
