import type { Coin } from "@cosmjs/amino";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { useDummyWallet } from "../hooks";
import type {
  AccessType,
  Addr,
  ComposedMsg,
  Gas,
  HumanAddr,
  Option,
} from "lib/types";
import { composeStoreCodeMsg, composeStoreCodeProposalMsg } from "lib/utils";

interface SimulateQueryParams {
  enabled: boolean;
  messages: ComposedMsg[];
  isDummyUser?: boolean;
  onSuccess?: (gas: Gas<number> | undefined) => void;
  onError?: (err: Error) => void;
}

export const useSimulateFeeQuery = ({
  enabled,
  messages,
  isDummyUser,
  onSuccess,
  onError,
}: SimulateQueryParams) => {
  const { address, getCosmWasmClient, currentChainName, currentChainRecord } =
    useWallet();
  const { dummyWallet, dummyAddress } = useDummyWallet();

  const userAddress = isDummyUser ? dummyAddress : address || dummyAddress;

  const simulateFn = async (msgs: ComposedMsg[]) => {
    // TODO: revisit this logic
    if (!currentChainRecord?.preferredEndpoints?.rpc?.[0] || !userAddress) {
      throw new Error("No RPC endpoint or user address");
    }

    const client =
      dummyWallet && (isDummyUser || !address)
        ? await SigningCosmWasmClient.connectWithSigner(
            currentChainRecord.preferredEndpoints.rpc[0],
            dummyWallet
          )
        : await getCosmWasmClient();

    if (!client) {
      throw new Error("Fail to get SigningCosmWasmClient");
    }

    return (await client.simulate(userAddress, msgs, undefined)) as Gas;
  };

  return useQuery({
    queryKey: ["simulate", currentChainName, userAddress, messages],
    queryFn: async ({ queryKey }) => simulateFn(queryKey[3] as ComposedMsg[]),
    enabled,
    keepPreviousData: true,
    retry: false,
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
  addresses: Addr[];
  onSuccess?: (gas: Gas<number> | undefined) => void;
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
  const { address, getCosmWasmClient, currentChainName } = useWallet();

  const simulateFn = async () => {
    if (!address) throw new Error("Please check your wallet connection.");
    if (!wasmFile) throw new Error("Fail to get Wasm file");

    const client = await getCosmWasmClient();
    if (!client) throw new Error("Fail to get client");

    const submitStoreCodeMsg = async () => {
      return composeStoreCodeMsg({
        sender: address as HumanAddr,
        wasmByteCode: new Uint8Array(await wasmFile.arrayBuffer()),
        permission,
        addresses,
      });
    };
    const craftMsg = await submitStoreCodeMsg();
    return (await client.simulate(address, [craftMsg], undefined)) as Gas;
  };
  return useQuery({
    queryKey: [
      "simulate_fee_store_code",
      currentChainName,
      wasmFile,
      permission,
      addresses,
    ],
    queryFn: async () => simulateFn(),
    enabled,
    retry: false,
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
  runAs: string;
  initialDeposit: Coin;
  unpinCode: boolean;
  builder: string;
  source: string;
  codeHash: string;
  wasmFile: Option<File>;
  permission: AccessType;
  addresses: Addr[];
  onSuccess?: (gas: Gas<number> | undefined) => void;
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
  onSuccess,
  onError,
}: SimulateQueryParamsForProposalStoreCode) => {
  const { address, getCosmWasmClient, currentChainName } = useWallet();

  const simulateFn = async () => {
    if (!address) throw new Error("Please check your wallet connection.");
    if (!wasmFile) throw new Error("Fail to get Wasm file");

    const client = await getCosmWasmClient();
    if (!client) throw new Error("Fail to get client");

    const submitStoreCodeProposalMsg = async () => {
      return composeStoreCodeProposalMsg({
        proposer: address as HumanAddr,
        title,
        description,
        runAs,
        wasmByteCode: new Uint8Array(await wasmFile.arrayBuffer()),
        permission,
        addresses,
        unpinCode,
        source,
        builder,
        codeHash: Uint8Array.from(Buffer.from(codeHash, "hex")),
        initialDeposit,
      });
    };

    const craftMsg = await submitStoreCodeProposalMsg();
    return (await client.simulate(address, [craftMsg], undefined)) as Gas;
  };

  return useQuery({
    queryKey: [
      "simulate_fee_store_code_proposal",
      currentChainName,
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
    queryFn: async () => simulateFn(),
    enabled,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};
