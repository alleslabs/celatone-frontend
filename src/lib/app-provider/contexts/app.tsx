import { useWallet } from "@cosmos-kit/react";
import { GraphQLClient } from "graphql-request";
import type { ReactNode } from "react";
import { useEffect, useContext, useMemo, createContext } from "react";

import { getIndexerGraphClient } from "../query-client";
import type { AppConstants } from "../types";
import {
  getExplorerContractAddressUrl,
  getExplorerTxUrl,
} from "lib/app-fns/explorer";
import { DEFAULT_ADDRESS, getExplorerUserAddressUrl } from "lib/data";
import { useCodeStore, useContractStore } from "lib/hooks";
import type { ChainGas, Gas } from "lib/types";
import { formatUserKey } from "lib/utils";

interface AppProviderProps<Constants extends AppConstants> {
  children: ReactNode;

  fallbackGasRegistry: Record<string, ChainGas>;

  constants: Constants;
}

interface AppContextInterface<Constants extends AppConstants = AppConstants> {
  chainGas: ChainGas;
  constants: Constants;
  explorerLink: {
    contractAddr: string;
    txs: string;
    address: string;
  };
  indexerGraphClient: GraphQLClient;
  userKey: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppContext = createContext<AppContextInterface<any>>({
  chainGas: { denom: "", gasPrice: 0 as Gas },
  constants: {},
  explorerLink: {
    contractAddr: "",
    txs: "",
    address: "",
  },
  indexerGraphClient: new GraphQLClient(""),
  userKey: "",
});

export const AppProvider = <Constants extends AppConstants>({
  children,
  fallbackGasRegistry,
  constants,
}: AppProviderProps<Constants>) => {
  const { currentChainName, currentChainRecord } = useWallet();
  const { setCodeUserKey } = useCodeStore();
  const { setContractUserKey } = useContractStore();

  const chainGas = useMemo(() => {
    if (
      !currentChainRecord ||
      !currentChainRecord.chain.fees ||
      !currentChainRecord.chain.fees.fee_tokens[0].average_gas_price
    )
      return fallbackGasRegistry[currentChainName];
    return {
      denom: currentChainRecord.chain.fees?.fee_tokens[0].denom as string,
      gasPrice: currentChainRecord.chain.fees?.fee_tokens[0]
        .average_gas_price as Gas<number>,
    };
  }, [currentChainName, currentChainRecord, fallbackGasRegistry]);

  const chainBoundStates = useMemo(() => {
    return {
      explorerLink: {
        contractAddr: getExplorerContractAddressUrl(currentChainName),
        txs: getExplorerTxUrl(currentChainName),
        address: getExplorerUserAddressUrl(currentChainName),
      },
      indexerGraphClient: getIndexerGraphClient(currentChainName),
      userKey: formatUserKey(currentChainName, DEFAULT_ADDRESS),
    };
  }, [currentChainName]);

  const states = useMemo<AppContextInterface<Constants>>(() => {
    return {
      chainGas,
      constants,
      ...chainBoundStates,
    };
  }, [chainGas, constants, chainBoundStates]);

  useEffect(() => {
    if (currentChainName) {
      const userKey = formatUserKey(currentChainName, DEFAULT_ADDRESS);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
    }
  }, [currentChainName, setCodeUserKey, setContractUserKey]);

  return <AppContext.Provider value={states}>{children}</AppContext.Provider>;
};

export const useApp = <
  Constants extends AppConstants
>(): AppContextInterface<Constants> => {
  return useContext(AppContext);
};
