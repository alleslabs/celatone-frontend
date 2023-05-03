import { useWallet } from "@cosmos-kit/react";
import { GraphQLClient } from "graphql-request";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
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
import { useInternalNavigate } from "../hooks/useInternalNavigate";
import { useNetworkChange } from "../hooks/useNetworkChange";
import { CHAIN_CONFIGS, DEFAULT_CHAIN_CONFIG, PROJECT_CONSTANTS } from "config";
import type { ChainConfig, ProjectConstants } from "config/types";
import { SUPPORTED_CHAIN_IDS } from "env";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
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
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { currentChainName, setCurrentChain } = useWallet();

  const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
  const { setContractUserKey, isContractUserKeyExist } = useContractStore();
  const { setProjectUserKey, isProjectUserKeyExist } = usePublicProjectStore();

  const [currentChainId, setCurrentChainId] = useState(SUPPORTED_CHAIN_IDS[0]);

  const handleOnChainIdChange = useCallback(
    (newChainId: string) => {
      const config = CHAIN_CONFIGS[newChainId];
      setCurrentChain(config?.registryChainName);
      setCurrentChainId(newChainId);

      navigate({
        pathname: router.pathname.replace("/[network]", ""),
        query: {
          ...router.query,
          network: newChainId,
        },
      });
    },
    [navigate, router, setCurrentChain]
  );

  const chainConfig = CHAIN_CONFIGS[currentChainId] ?? DEFAULT_CHAIN_CONFIG;
  const indexerGraphClient = useMemo(
    () => new GraphQLClient(chainConfig.indexer),
    [chainConfig.indexer]
  );

  const states = useMemo<AppContextInterface>(
    () => ({
      availableChainIds: SUPPORTED_CHAIN_IDS,
      currentChainId,
      chainConfig,
      indexerGraphClient,
      constants: PROJECT_CONSTANTS,
      handleOnChainIdChange,
    }),
    [chainConfig, currentChainId, handleOnChainIdChange, indexerGraphClient]
  );

  useEffect(() => {
    if (currentChainName) {
      const userKey = formatUserKey(currentChainName, DEFAULT_ADDRESS);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
      setProjectUserKey(userKey);
    }
  }, [currentChainName, setCodeUserKey, setContractUserKey, setProjectUserKey]);

  useNetworkChange(SUPPORTED_CHAIN_IDS, handleOnChainIdChange);

  useAmplitude();

  if (
    !isCodeUserKeyExist() ||
    !isContractUserKeyExist() ||
    !isProjectUserKeyExist()
  )
    return <LoadingOverlay />;

  return CHAIN_CONFIGS[currentChainId] ? (
    <AppContext.Provider value={states}>{children}</AppContext.Provider>
  ) : (
    // TODO: fix to a proper component
    <div>Seomthing went wrong</div>
  );
});

export const useApp = (): AppContextInterface => {
  return useContext(AppContext);
};
