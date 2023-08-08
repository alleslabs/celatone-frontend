import type { Coin } from "@cosmjs/amino";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useQuery } from "@tanstack/react-query";
import { gzip } from "node-gzip";

import { CELATONE_QUERY_KEYS } from "../env";
import { useCurrentChain, useDummyWallet, useRPCEndpoint } from "../hooks";
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
  const { address, getSigningCosmWasmClient, chain } = useCurrentChain();
  const { dummyWallet, dummyAddress } = useDummyWallet();
  const rpcEndpoint = useRPCEndpoint();
  const userAddress = isDummyUser ? dummyAddress : address || dummyAddress;

  const simulateFn = async (msgs: ComposedMsg[]) => {
    // TODO: revisit this logic
    if (!userAddress) {
      throw new Error("No user address");
    }

    const client =
      dummyWallet && (isDummyUser || !address)
        ? await SigningCosmWasmClient.connectWithSigner(
            rpcEndpoint,
            dummyWallet
          )
        : await getSigningCosmWasmClient();

    if (!client) {
      throw new Error("Fail to get SigningCosmWasmClient");
    }

    return (await client.simulate(userAddress, msgs, undefined)) as Gas;
  };

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE,
      chain.chain_name,
      userAddress,
      messages,
      rpcEndpoint,
    ],
    queryFn: async ({ queryKey }) => simulateFn(queryKey[3] as ComposedMsg[]),
    enabled,
    retry: 2,
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
  addresses?: Addr[];
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
  const { address, getSigningCosmWasmClient, chain } = useCurrentChain();
  const simulateFn = async () => {
    if (!address) throw new Error("Please check your wallet connection.");
    if (!wasmFile) throw new Error("Fail to get Wasm file");

    const client = await getSigningCosmWasmClient();
    if (!client) throw new Error("Fail to get client");

    const submitStoreCodeMsg = async () => {
      return composeStoreCodeMsg({
        sender: address as HumanAddr,
        wasmByteCode: await gzip(new Uint8Array(await wasmFile.arrayBuffer())),
        permission,
        addresses,
      });
    };
    const craftMsg = await submitStoreCodeMsg();
    return (await client.simulate(address, [craftMsg], undefined)) as Gas;
  };
  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE_STORE_CODE,
      chain.chain_name,
      wasmFile,
      permission,
      addresses,
    ],
    queryFn: async () => simulateFn(),
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
  runAs: Addr;
  initialDeposit: Coin;
  unpinCode: boolean;
  builder: string;
  source: string;
  codeHash: string;
  wasmFile: Option<File>;
  permission: AccessType;
  addresses: Addr[];
  precision: Option<number>;
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
  precision,
  onSuccess,
  onError,
}: SimulateQueryParamsForProposalStoreCode) => {
  const { address, getSigningCosmWasmClient, chain } = useCurrentChain();
  const simulateFn = async () => {
    if (!address) throw new Error("Please check your wallet connection.");
    if (!wasmFile) throw new Error("Fail to get Wasm file");

    const client = await getSigningCosmWasmClient();
    if (!client) throw new Error("Fail to get client");

    const submitStoreCodeProposalMsg = async () => {
      return composeStoreCodeProposalMsg({
        proposer: address as HumanAddr,
        title,
        description,
        runAs: runAs as Addr,
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
    return (await client.simulate(address, [craftMsg], undefined)) as Gas;
  };

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE_STORE_CODE_PROPOSAL,
      chain.chain_name,
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
    retry: 2,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};
