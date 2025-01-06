import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { useEffect, useState } from "react";

import { useCelatoneApp } from "../contexts";
import { DUMMY_MNEMONIC } from "env";
import { getCustomedSigningCosmwasm } from "lib/providers/cosmos-kit/options";
import type { BechAddr20 } from "lib/types";

import { useCurrentChain } from "./useCurrentChain";

export const useDummyWallet = () => {
  const { bech32Prefix } = useCurrentChain();
  const {
    chainConfig: { rpc: rpcEndpoint },
  } = useCelatoneApp();
  const [dummyWallet, setDummyWallet] = useState<DirectSecp256k1HdWallet>();
  const [dummyAddress, setDummyAddress] = useState<BechAddr20>();
  const [dummyClient, setDummyClient] = useState<SigningCosmWasmClient>();

  const { registry, aminoTypes } = getCustomedSigningCosmwasm();

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
        const client = await SigningCosmWasmClient.connectWithSigner(
          rpcEndpoint,
          wallet,
          {
            registry,
            aminoTypes,
          }
        );
        setDummyClient(client);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bech32Prefix, rpcEndpoint]);

  return { dummyWallet, dummyAddress, dummyClient };
};
