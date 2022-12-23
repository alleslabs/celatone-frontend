import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

import { DUMMY_MNEMONIC } from "env";

export const useDummyWallet = () => {
  const { currentChainRecord } = useWallet();
  const [dummyWallet, setDummyWallet] = useState<DirectSecp256k1HdWallet>();
  const [dummyAddress, setDummyAddress] = useState<string>();
  useEffect(() => {
    const getData = async () => {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        DUMMY_MNEMONIC || "",
        undefined,
        currentChainRecord?.chain.bech32_prefix
      );

      setDummyWallet(wallet);

      const { address } = (await wallet.getAccounts())[0];
      setDummyAddress(address);
    };

    getData();
  }, [currentChainRecord?.chain.bech32_prefix]);

  return { dummyWallet, dummyAddress };
};
