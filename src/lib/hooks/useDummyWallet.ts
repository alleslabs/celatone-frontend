import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

import { DUMMY_MNEMONIC } from "env";
import type { HumanAddr } from "lib/types";

export const useDummyWallet = () => {
  const { currentChainRecord } = useWallet();
  const [dummyWallet, setDummyWallet] = useState<DirectSecp256k1HdWallet>();
  const [dummyAddress, setDummyAddress] = useState<HumanAddr>();
  useEffect(() => {
    (async () => {
      if (DUMMY_MNEMONIC) {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
          DUMMY_MNEMONIC,
          {
            prefix: currentChainRecord?.chain.bech32_prefix,
          }
        );

        setDummyWallet(wallet);

        const { address } = (await wallet.getAccounts())[0];
        setDummyAddress(address as HumanAddr);
      }
    })();
  }, [currentChainRecord?.chain.bech32_prefix]);

  return { dummyWallet, dummyAddress };
};
