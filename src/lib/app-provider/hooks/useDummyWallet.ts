import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { useEffect, useState } from "react";

import { DUMMY_MNEMONIC } from "env";
import type { HumanAddr } from "lib/types";

import { useCurrentChain } from "./useCurrentChain";

export const useDummyWallet = () => {
  const { chain } = useCurrentChain();
  const [dummyWallet, setDummyWallet] = useState<DirectSecp256k1HdWallet>();
  const [dummyAddress, setDummyAddress] = useState<HumanAddr>();
  useEffect(() => {
    (async () => {
      if (DUMMY_MNEMONIC) {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
          DUMMY_MNEMONIC,
          {
            prefix: chain.bech32_prefix,
          }
        );

        setDummyWallet(wallet);

        const { address } = (await wallet.getAccounts())[0];
        setDummyAddress(address as HumanAddr);
      }
    })();
  }, [chain.bech32_prefix]);

  return { dummyWallet, dummyAddress };
};
