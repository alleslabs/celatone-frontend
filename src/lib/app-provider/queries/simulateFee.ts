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
import { composeStoreCodeMsg } from "lib/utils";

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
  addresses: Record<"address", Addr>[];
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

    const submitWhitelistProposalMsg = async () => {
      return composeStoreCodeMsg({
        sender: address as HumanAddr,
        wasmByteCode: new Uint8Array(await wasmFile.arrayBuffer()),
        permission,
        addresses: addresses.map((addr) => addr.address),
      });
    };
    const craftMsg = await submitWhitelistProposalMsg();
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
