import { useWallet } from "@cosmos-kit/react";
import { GraphQLClient } from "graphql-request";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
  useCallback,
  useState,
  useEffect,
  useContext,
  useMemo,
  createContext,
} from "react";

import { useAmplitude } from "../hooks/useAmplitude";
import { useNetworkChange } from "../hooks/useNetworkChange";
import { CHAIN_CONFIGS, DEFAULT_CHAIN_CONFIG, PROJECT_CONSTANTS } from "config";
import type { ChainConfig, ProjectConstants } from "config/types";
import { SUPPORTED_CHAIN_IDS } from "env";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { EmptyState } from "lib/components/state/EmptyState";
import { DEFAULT_ADDRESS } from "lib/data";
import {
  useCodeStore,
  useContractStore,
  usePublicProjectStore,
} from "lib/providers/store";
import { formatUserKey } from "lib/utils";

interface AppProviderProps {
  children: ReactNode;
}

interface AppContextInterface {
  availableChainIds: string[];
  currentChainId: string;
  chainConfig: ChainConfig;
  indexerGraphClient: GraphQLClient;
  constants: ProjectConstants;
  handleOnChainIdChange: (newChainId: string) => void;
}

const AppContext = createContext<AppContextInterface>({
  availableChainIds: [],
  currentChainId: "",
  chainConfig: DEFAULT_CHAIN_CONFIG,
  indexerGraphClient: new GraphQLClient(DEFAULT_CHAIN_CONFIG.indexer),
  constants: PROJECT_CONSTANTS,
  handleOnChainIdChange: () => {},
});

export const AppProvider = observer(({ children }: AppProviderProps) => {
  const { currentChainName, setCurrentChain } = useWallet();

  const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
  const { setContractUserKey, isContractUserKeyExist } = useContractStore();
  const { setProjectUserKey, isProjectUserKeyExist } = usePublicProjectStore();

  const [currentChainId, setCurrentChainId] = useState("");

  // Remark: this function is only used in useSelectChain. Do not use in other places.
  const handleOnChainIdChange = useCallback(
    (newChainId: string) => {
      const config = CHAIN_CONFIGS[newChainId];
      setCurrentChainId(newChainId);
      setCurrentChain(config?.registryChainName);
    },
    [setCurrentChain, setCurrentChainId]
  );

  const states = useMemo<AppContextInterface>(() => {
    const chainConfig = currentChainId
      ? CHAIN_CONFIGS[currentChainId]
      : DEFAULT_CHAIN_CONFIG;

    return {
      availableChainIds: SUPPORTED_CHAIN_IDS,
      currentChainId,
      chainConfig,
      indexerGraphClient: new GraphQLClient(chainConfig?.indexer ?? ""),
      constants: PROJECT_CONSTANTS,
      handleOnChainIdChange,
    };
  }, [currentChainId, handleOnChainIdChange]);

  useEffect(() => {
    const userKey = formatUserKey(currentChainName, DEFAULT_ADDRESS);
    setCodeUserKey(userKey);
    setContractUserKey(userKey);
    setProjectUserKey(userKey);
  }, [currentChainName, setCodeUserKey, setContractUserKey, setProjectUserKey]);

  useNetworkChange(handleOnChainIdChange);

  useAmplitude();

  if (
    !isCodeUserKeyExist() ||
    !isContractUserKeyExist() ||
    !isProjectUserKeyExist() ||
    !currentChainId
  )
    return <LoadingOverlay />;

  return currentChainId in CHAIN_CONFIGS ? (
    <AppContext.Provider value={states}>{children}</AppContext.Provider>
  ) : (
    <EmptyState
      imageVariant="not-found"
      message={`‘${currentChainId}‘ is not available in local chain config`}
    />
  );
});

export const useCelatoneApp = (): AppContextInterface => {
  return useContext(AppContext);
};
