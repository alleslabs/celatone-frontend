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

import {
  getDebugTraceBlockByNumber,
  getDebugTraceTransaction,
  getEthCall,
  getEvmProxyTarget,
} from "./json-rpc";
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

  return useQuery(
    [CELATONE_QUERY_KEYS.EVM_PARAMS_REST, restEndpoint],
    async () => {
      if (!evm.enabled) throw new Error("EVM is not enabled (useEvmParams)");
      return getEvmParams(restEndpoint);
    },
    {
      enabled: evm.enabled,
      refetchOnWindowFocus: false,
      retry: false,
      retryOnMount: false,
      staleTime: Infinity,
    }
  );
};

export const useEvmCodesByAddress = (address: HexAddr20, enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.EVM_CODES_BY_ADDRESS_REST, restEndpoint, address],
    async () => getEvmCodesByAddress(restEndpoint, address),
    {
      enabled: enabled && address && isHexWalletAddress(address),
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useEvmContractInfoSequencer = (address: HexAddr20) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.EVM_CONTRACT_INFO_SEQUENCER,
      restEndpoint,
      bech32Prefix,
      address,
    ],
    async () =>
      getEvmContractInfoSequencer(restEndpoint, bech32Prefix, address),
    {
      enabled: address && isHexWalletAddress(address),
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useEthCall = (
  to: HexAddr20,
  data: string,
  options: UseQueryOptions<string>
) => {
  const { address } = useCurrentChain();
  const hexAddr = address
    ? zHexAddr20.parse(bech32AddressToHex(address))
    : undefined;
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery<string>(
    [
      CELATONE_QUERY_KEYS.EVM_ETH_CALL,
      evm.enabled && evm.jsonRpc,
      hexAddr,
      to,
      data,
    ],
    async () => {
      if (!evm.enabled) throw new Error("EVM is not enabled (useEthCall)");
      return getEthCall(evm.jsonRpc, hexAddr ?? null, to, data);
    },
    {
      enabled: evm.enabled && !!evm.jsonRpc,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      ...options,
    }
  );
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
  return useQuery<Nullable<ProxyResult>>(
    [
      CELATONE_QUERY_KEYS.EVM_PROXY_TARGET,
      evm.enabled && evm.jsonRpc,
      proxyAddress,
    ],
    async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useGetEvmProxyTarget)");
      return getEvmProxyTarget(evm.jsonRpc, proxyAddress);
    },
    {
      enabled: evm.enabled && !!evm.jsonRpc,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      ...options,
    }
  );
};

export const useDebugTraceTransaction = (txHash: string) => {
  const {
    chainConfig: {
      features: { evm },
    },
  } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.EVM_DEBUG_TRACE_TRANSACTION,
      evm.enabled && evm.jsonRpc,
      txHash,
    ],
    async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useDebugTraceTransaction)");
      return getDebugTraceTransaction(evm.jsonRpc, txHash);
    }
  );
};

export const useDebugTraceBlockByNumber = (height: number) => {
  const {
    chainConfig: {
      features: { evm },
    },
  } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.EVM_DEBUG_TRACE_BLOCK_BY_NUMBER,
      evm.enabled && evm.jsonRpc,
      height,
    ],
    async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useDebugTraceBlockByNumber)");
      return getDebugTraceBlockByNumber(evm.jsonRpc, height);
    }
  );
};
