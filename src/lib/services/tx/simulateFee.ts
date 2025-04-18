import type { Coin } from "@cosmjs/stargate";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { AccessType, BechAddr, ComposedMsg, Gas, Option } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import {
  useCurrentChain,
  useDummyWallet,
  useSimulateFee,
} from "lib/app-provider/hooks";
import { composeStoreCodeMsg, composeStoreCodeProposalMsg } from "lib/utils";
import { gzip } from "node-gzip";

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
  extraQueryKey = [],
  isDummyUser,
  messages,
  onError,
  onSuccess,
  retry = 2,
}: SimulateQueryParams) => {
  const { address, chainId } = useCurrentChain();
  const { dummyAddress } = useDummyWallet();
  const simulateFee = useSimulateFee();

  const simulateFn = async () => {
    const userAddress = isDummyUser ? dummyAddress : address;
    if (!userAddress)
      throw new Error("No address provided (useSimulateFeeQuery)");
    return simulateFee({ address: userAddress, isDummyUser, messages });
  };

  return useQuery({
    enabled,
    onError,
    onSuccess,
    queryFn: simulateFn,
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE,
      chainId,
      messages,
      address,
      isDummyUser,
      ...extraQueryKey,
    ],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry,
  });
};

interface SimulateQueryParamsForStoreCode {
  enabled: boolean;
  wasmFile: Option<File>;
  permission?: AccessType;
  addresses?: BechAddr[];
  onSuccess?: (gas: Option<Gas>) => void;
  onError?: (err: Error) => void;
}

export const useSimulateFeeForStoreCode = ({
  addresses,
  enabled,
  onError,
  onSuccess,
  permission,
  wasmFile,
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
        addresses,
        permission,
        sender: address,
        wasmByteCode: await gzip(new Uint8Array(await wasmFile.arrayBuffer())),
      });
    };
    const craftMsg = await submitStoreCodeMsg();
    return simulateFee({ address, messages: [craftMsg] });
  };
  return useQuery({
    enabled,
    onError,
    onSuccess,
    queryFn: simulateFn,
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE_STORE_CODE,
      chainId,
      wasmFile,
      permission,
      addresses,
    ],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 2,
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
  addresses,
  builder,
  codeHash,
  description,
  enabled,
  initialDeposit,
  onError,
  onSuccess,
  permission,
  precision,
  runAs,
  source,
  title,
  unpinCode,
  wasmFile,
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
        addresses,
        builder,
        codeHash: Uint8Array.from(Buffer.from(codeHash, "hex")),
        description,
        initialDeposit,
        permission,
        precision,
        proposer: address,
        runAs,
        source,
        title,
        unpinCode,
        wasmByteCode: await gzip(new Uint8Array(await wasmFile.arrayBuffer())),
      });
    };

    const craftMsg = await submitStoreCodeProposalMsg();
    return simulateFee({ address, messages: [craftMsg] });
  };

  return useQuery({
    enabled,
    onError,
    onSuccess,
    queryFn: simulateFn,
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
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
