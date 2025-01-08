import type { Coin } from "@cosmjs/stargate";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { gzip } from "node-gzip";

import { useCelatoneApp } from "lib/app-provider/contexts";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import {
  useCurrentChain,
  useDummyWallet,
  useSimulateFee,
} from "lib/app-provider/hooks";
import type { AccessType, BechAddr, ComposedMsg, Gas, Option } from "lib/types";
import { composeStoreCodeMsg, composeStoreCodeProposalMsg } from "lib/utils";

interface SimulateQueryParams {
  enabled: boolean;
  messages: ComposedMsg[];
  isDummyUser?: boolean;
  retry?: UseQueryOptions["retry"];
  extraQueryKey?: UseQueryOptions["queryKey"];
  onSuccess?: (gas: Option<Gas>) => void;
  onError?: (err: Error) => void;
}

export const useSimulateFeeQuery = ({
  enabled,
  messages,
  isDummyUser,
  retry = 2,
  extraQueryKey = [],
  onSuccess,
  onError,
}: SimulateQueryParams) => {
  const {
    chainConfig: { rpc: rpcEndpoint },
  } = useCelatoneApp();
  const { address } = useCurrentChain();
  const { dummyAddress } = useDummyWallet();
  const simulateFee = useSimulateFee();

  const simulateFn = async () => {
    const userAddress = isDummyUser ? dummyAddress : address;
    if (!userAddress)
      throw new Error("No address provided (useSimulateFeeQuery)");
    return simulateFee({ address: userAddress, messages, isDummyUser });
  };

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE,
      rpcEndpoint,
      messages,
      address,
      isDummyUser,
      ...extraQueryKey,
    ],
    queryFn: simulateFn,
    enabled,
    retry,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};

interface SimulateQueryParamsForStoreCode {
  enabled: boolean;
  wasmFile: Option<File>;
  permission: AccessType;
  addresses?: BechAddr[];
  onSuccess?: (gas: Option<Gas>) => void;
  onError?: (err: Error) => void;
}

export const useSimulateFeeForStoreCode = ({
  enabled,
  wasmFile,
  permission,
  addresses,
  onSuccess,
  onError,
}: SimulateQueryParamsForStoreCode) => {
  const { address, chainId } = useCurrentChain();
  const simulateFee = useSimulateFee();

  const simulateFn = async () => {
    if (!address)
      throw new Error("No address provided (useSimulateFeeForStoreCode)");
    if (!wasmFile)
      throw new Error("No Wasm file provided (useSimulateFeeForStoreCode)");

    const submitStoreCodeMsg = async () => {
      return composeStoreCodeMsg({
        sender: address,
        wasmByteCode: await gzip(new Uint8Array(await wasmFile.arrayBuffer())),
        permission,
        addresses,
      });
    };
    const craftMsg = await submitStoreCodeMsg();
    return simulateFee({ address, messages: [craftMsg] });
  };
  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE_STORE_CODE,
      chainId,
      wasmFile,
      permission,
      addresses,
    ],
    queryFn: simulateFn,
    enabled,
    retry: 2,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};

interface SimulateQueryParamsForProposalStoreCode {
  enabled: boolean;
  title: string;
  description: string;
  runAs: BechAddr;
  initialDeposit: Coin;
  unpinCode: boolean;
  builder: string;
  source: string;
  codeHash: string;
  wasmFile: Option<File>;
  permission: AccessType;
  addresses: BechAddr[];
  precision: Option<number>;
  onSuccess?: (gas: Option<Gas>) => void;
  onError?: (err: Error) => void;
}

export const useSimulateFeeForProposalStoreCode = ({
  enabled,
  title,
  description,
  runAs,
  initialDeposit,
  unpinCode,
  builder,
  source,
  codeHash,
  wasmFile,
  permission,
  addresses,
  precision,
  onSuccess,
  onError,
}: SimulateQueryParamsForProposalStoreCode) => {
  const { address, chainId } = useCurrentChain();
  const simulateFee = useSimulateFee();

  const simulateFn = async () => {
    if (!address)
      throw new Error(
        "No address provided (useSimulateFeeForProposalStoreCode)"
      );
    if (!wasmFile)
      throw new Error(
        "No Wasm file provided (useSimulateFeeForProposalStoreCode)"
      );

    const submitStoreCodeProposalMsg = async () => {
      return composeStoreCodeProposalMsg({
        proposer: address,
        title,
        description,
        runAs,
        wasmByteCode: await gzip(new Uint8Array(await wasmFile.arrayBuffer())),
        permission,
        addresses,
        unpinCode,
        source,
        builder,
        codeHash: Uint8Array.from(Buffer.from(codeHash, "hex")),
        initialDeposit,
        precision,
      });
    };

    const craftMsg = await submitStoreCodeProposalMsg();
    return simulateFee({ address, messages: [craftMsg] });
  };

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE_STORE_CODE_PROPOSAL,
      chainId,
      runAs,
      initialDeposit,
      unpinCode,
      builder,
      source,
      codeHash,
      wasmFile,
      permission,
      addresses,
      enabled,
    ],
    queryFn: simulateFn,
    enabled,
    retry: 2,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};
