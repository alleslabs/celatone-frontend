import { useWallet } from "@cosmos-kit/react";
import big from "big.js";
import { GraphQLClient } from "graphql-request";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { useEffect, useContext, useMemo, createContext } from "react";

import { getIndexerGraphClient } from "../query-client";
import type { AppConstants } from "../types";
import {
  getExplorerContractAddressUrl,
  getExplorerTxUrl,
} from "lib/app-fns/explorer";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { DEFAULT_ADDRESS, getExplorerUserAddressUrl } from "lib/data";
import { DEFAULT_CHAIN } from "lib/env";
import { useCodeStore, useContractStore } from "lib/hooks";
import type { ChainGasPrice, Token, U } from "lib/types";
import { formatUserKey } from "lib/utils";

interface AppProviderProps<Constants extends AppConstants> {
  children: ReactNode;

  fallbackGasPrice: Record<string, ChainGasPrice>;

  constants: Constants;
}

interface AppContextInterface<Constants extends AppConstants = AppConstants> {
  chainGasPrice: ChainGasPrice;
  constants: Constants;
  explorerLink: {
    contractAddr: string;
    txs: string;
    address: string;
  };
  indexerGraphClient: GraphQLClient;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppContext = createContext<AppContextInterface<any>>({
  chainGasPrice: { denom: "", gasPrice: "0" as U<Token> },
  constants: {},
  explorerLink: {
    contractAddr: "",
    txs: "",
    address: "",
  },
  indexerGraphClient: new GraphQLClient(""),
});

export const AppProvider = <Constants extends AppConstants>({
  children,
  fallbackGasPrice,
  constants,
}: AppProviderProps<Constants>) => {
  const { currentChainName, currentChainRecord, setCurrentChain } = useWallet();
  const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
  const { setContractUserKey, isContractUserKeyExist } = useContractStore();

  const chainGasPrice = useMemo(() => {
    if (
      !currentChainRecord ||
      !currentChainRecord.chain.fees ||
      !currentChainRecord.chain.fees.fee_tokens[0].average_gas_price
    )
      return fallbackGasPrice[currentChainName];
    return {
      denom: currentChainRecord.chain.fees?.fee_tokens[0].denom as string,
      gasPrice: big(
        currentChainRecord.chain.fees?.fee_tokens[0].average_gas_price ?? "0"
      ).toFixed() as U<Token>,
    };
  }, [currentChainName, currentChainRecord, fallbackGasPrice]);

  const chainBoundStates = useMemo(() => {
    return {
      explorerLink: {
        contractAddr: getExplorerContractAddressUrl(currentChainName),
        txs: getExplorerTxUrl(currentChainName),
        address: getExplorerUserAddressUrl(currentChainName),
      },
      indexerGraphClient: getIndexerGraphClient(currentChainName),
    };
  }, [currentChainName]);

  const states = useMemo<AppContextInterface<Constants>>(() => {
    return {
      chainGasPrice,
      constants,
      ...chainBoundStates,
    };
  }, [chainGasPrice, constants, chainBoundStates]);

  useEffect(() => {
    if (currentChainName) {
      const userKey = formatUserKey(currentChainName, DEFAULT_ADDRESS);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
    }
  }, [currentChainName, setCodeUserKey, setContractUserKey]);

  useEffect(() => {
    setCurrentChain(DEFAULT_CHAIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AppContent = observer(() => {
    if (isCodeUserKeyExist && isContractUserKeyExist)
      return (
        <AppContext.Provider value={states}>{children}</AppContext.Provider>
      );
    return <LoadingOverlay />;
  });

  return <AppContent />;
};

export const useApp = <
  Constants extends AppConstants
>(): AppContextInterface<Constants> => {
  return useContext(AppContext);
};
