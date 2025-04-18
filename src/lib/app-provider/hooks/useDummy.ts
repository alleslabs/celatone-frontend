import type { BechAddr20 } from "lib/types";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { DUMMY_MNEMONIC } from "env";
import { getCustomedSigningCosmwasm } from "lib/providers/cosmos-kit/options";
import { useCallback, useEffect, useState } from "react";

import { useCelatoneApp } from "../contexts";
import { useCurrentChain } from "./useCurrentChain";

export const useDummyWallet = () => {
  const { bech32Prefix } = useCurrentChain();
  const [dummyWallet, setDummyWallet] = useState<DirectSecp256k1HdWallet>();
  const [dummyAddress, setDummyAddress] = useState<BechAddr20>();

  useEffect(() => {
    (async () => {
      if (DUMMY_MNEMONIC) {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
          DUMMY_MNEMONIC,
          {
            prefix: bech32Prefix,
          }
        );

        setDummyWallet(wallet);

        const { address } = (await wallet.getAccounts())[0];
        setDummyAddress(address as BechAddr20);
      }
    })();
  }, [bech32Prefix]);

  return { dummyAddress, dummyWallet };
};

export const useGetDummyClient = () => {
  const { dummyWallet } = useDummyWallet();
  const {
    chainConfig: { rpc: rpcEndpoint },
  } = useCelatoneApp();

  return useCallback(async () => {
    if (!dummyWallet) throw new Error("No dummy wallet provided");

    return SigningCosmWasmClient.connectWithSigner(
      rpcEndpoint,
      dummyWallet,
      getCustomedSigningCosmwasm()
    );
  }, [dummyWallet, rpcEndpoint]);
};
