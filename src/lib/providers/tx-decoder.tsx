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
    chainConfig: {
      features: { evm },
      network_type,
      rest: restEndpoint,
    },
  } = useCelatoneApp();

  const txDecoder = useMemo(
    () =>
      new TxDecoder({
        jsonRpcUrl: evm.enabled ? evm.jsonRpc : undefined,
        registryUrl:
          network_type === "mainnet"
            ? INITIA_REGISTRY_URL
            : INITIA_TESTNET_REGISTRY_URL,
        restUrl: restEndpoint,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network_type, restEndpoint, JSON.stringify(evm)]
  );

  return (
    <TxDecoderContext.Provider value={{ txDecoder }}>
      {children}
    </TxDecoderContext.Provider>
  );
};
