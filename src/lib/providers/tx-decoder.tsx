import type { Option } from "lib/types";

import { TxDecoder } from "@initia/tx-decoder";
import { useCelatoneApp } from "lib/app-provider";
import { INITIA_REGISTRY_URL, INITIA_TESTNET_REGISTRY_URL } from "lib/data";
import { createContext, useContext, useMemo } from "react";

interface TxDecoderContextValue {
  txDecoder: TxDecoder;
}

const TxDecoderContext =
  createContext<Option<TxDecoderContextValue>>(undefined);

export const useTxDecoderContext = () => {
  const context = useContext(TxDecoderContext);
  if (!context) {
    throw new Error(
      "useTxDecoderContext must be used within TxDecoderProvider"
    );
  }
  return context;
};

export const TxDecoderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    chainConfig: { network_type, rest: restEndpoint },
  } = useCelatoneApp();

  const txDecoder = useMemo(
    () =>
      new TxDecoder({
        registryUrl:
          network_type === "mainnet"
            ? INITIA_REGISTRY_URL
            : INITIA_TESTNET_REGISTRY_URL,
        restUrl: restEndpoint,
      }),
    [network_type, restEndpoint]
  );

  return (
    <TxDecoderContext.Provider value={{ txDecoder }}>
      {children}
    </TxDecoderContext.Provider>
  );
};
