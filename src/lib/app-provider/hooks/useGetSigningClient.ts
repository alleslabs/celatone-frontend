/* eslint-disable */
import type { WalletClient } from "@cosmos-kit/core";

import { useCurrentChain } from "./useCurrentChain";
import { useCallback } from "react";
import { useWalletClient } from "@cosmos-kit/react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useRpcEndpoint } from "./useRpcEndpoint_";
import { getCustomedSigningCosmwasm } from "lib/providers/cosmos-kit/options";

type MergedWalletClient =
  | WalletClient
  // | import("@cosmos-kit/cosmostation-extension/cjs/extension/client").CosmostationClient
  | import("@cosmos-kit/keplr-extension/cjs/extension/client").KeplrClient
  | import("@cosmos-kit/station-extension/cjs/extension/client").StationClient;

export const isLedger = async <T extends MergedWalletClient>(
  walletClient: T,
  chainID: string
) => {
  // mostly everything else
  if ("client" in walletClient && "getKey" in walletClient.client) {
    const key = await walletClient.client.getKey(chainID);
    return key.isNanoLedger;
  }

  // cosmostation
  // if ("client" in walletClient && "cosmos" in walletClient.client) {
  //   const account = await walletClient.client.cosmos.request({
  //     method: "cos_account",
  //     params: { chainName: chainID },
  //   });
  //   return Boolean(account.isLedger);
  // }

  return false;
};

export const useGetSigningClient = () => {
  const { client: walletClient } = useWalletClient();
  const {
    chain: { chain_id: chainId },
    getSigningCosmWasmClient,
  } = useCurrentChain();
  const rpcEndpoint = useRpcEndpoint();

  return async () => {
    if (walletClient && (await isLedger(walletClient, chainId))) {
      const signer =
        walletClient.getOfflineSignerAmino?.(chainId) ??
        (await walletClient.getOfflineSigner?.(chainId, "amino"));

      if (!signer || !("signAmino" in signer)) return undefined;

      return SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        signer,
        getCustomedSigningCosmwasm()
      );
    }
    return await getSigningCosmWasmClient();
  };
};
