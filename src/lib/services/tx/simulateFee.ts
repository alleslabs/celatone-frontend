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
import { useQueryEvents } from "lib/hooks";
import { composeStoreCodeMsg, composeStoreCodeProposalMsg } from "lib/utils";
import { gzip } from "node-gzip";

interface SimulateQueryParams {
  enabled: boolean;
  extraQueryKey?: UseQueryOptions["queryKey"];
  isDummyUser?: boolean;
  messages: ComposedMsg[];
  onError?: (err: Error) => void;
  onSuccess?: (gas: Option<Gas>) => void;
  retry?: UseQueryOptions["retry"];
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

  const simulateFeeQuery = useQuery({
    enabled,
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

  useQueryEvents(simulateFeeQuery, {
    onError,
    onSuccess,
  });

  return simulateFeeQuery;
};

interface SimulateQueryParamsForStoreCode {
  addresses?: BechAddr[];
  enabled: boolean;
  permission?: AccessType;
  wasmFile: Option<File>;
}

export const useSimulateFeeForStoreCode = ({
  addresses,
  enabled,
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
  addresses: BechAddr[];
  builder: string;
  codeHash: string;
  description: string;
  enabled: boolean;
  initialDeposit: Coin;
  onError?: (err: Error) => void;
  onSuccess?: (gas: Option<Gas>) => void;
  permission: AccessType;
  precision: Option<number>;
  runAs: BechAddr;
  source: string;
  title: string;
  unpinCode: boolean;
  wasmFile: Option<File>;
}

export const useSimulateFeeForProposalStoreCode = ({
  addresses,
  builder,
  codeHash,
  description,
  enabled,
  initialDeposit,
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
