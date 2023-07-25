import { useModalTheme } from "@cosmos-kit/react";
import { GraphQLClient } from "graphql-request";
import { observer } from "mobx-react-lite";
import type { Dispatch, ReactNode, SetStateAction } from "react";
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
import { CHAIN_CONFIGS, DEFAULT_CHAIN_CONFIG } from "config/chain";
import type { ChainConfig } from "config/chain";
import { PROJECT_CONSTANTS } from "config/project";
import type { ProjectConstants } from "config/project";
import { SUPPORTED_CHAIN_IDS } from "env";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { NetworkErrorState } from "lib/components/state/NetworkErrorState";
import { DEFAULT_ADDRESS } from "lib/data";
import { useLocalStorage } from "lib/hooks/useLocalStorage";
import {
  useCodeStore,
  useContractStore,
  usePublicProjectStore,
} from "lib/providers/store";
import type { Option } from "lib/types";
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
  isExpand: boolean;
  isDevMode: Option<boolean>;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
  setIsDevMode: Dispatch<SetStateAction<Option<boolean>>>;
}

const AppContext = createContext<AppContextInterface>({
  availableChainIds: [],
  currentChainId: "",
  chainConfig: DEFAULT_CHAIN_CONFIG,
  indexerGraphClient: new GraphQLClient(DEFAULT_CHAIN_CONFIG.indexer),
  constants: PROJECT_CONSTANTS,
  isExpand: false,
  isDevMode: undefined,
  setIsExpand: () => {},
  setIsDevMode: () => {},
});

export const AppProvider = observer(({ children }: AppProviderProps) => {
  const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
  const { setContractUserKey, isContractUserKeyExist } = useContractStore();
  const { setProjectUserKey, isProjectUserKeyExist } = usePublicProjectStore();
  const { setModalTheme } = useModalTheme();

  const [currentChainName, setCurrentChainName] = useState<string>();
  const [currentChainId, setCurrentChainId] = useState("");

  // TODO - Revisit localstorage
  const [isDevMode, setIsDevMode] = useLocalStorage<Option<boolean>>(
    "devMode",
    undefined
  );
  const [isExpand, setIsExpand] = useLocalStorage("navbar", false);

  // Remark: this function is only used in useSelectChain. Do not use in other places.
  const handleOnChainIdChange = useCallback((newChainId: string) => {
    const config = CHAIN_CONFIGS[newChainId];
    setCurrentChainId(newChainId);
    setCurrentChainName(config?.registryChainName);
  }, []);

  const states = useMemo<AppContextInterface>(() => {
    const chainConfig = CHAIN_CONFIGS[currentChainId] ?? DEFAULT_CHAIN_CONFIG;

    return {
      availableChainIds: SUPPORTED_CHAIN_IDS,
      currentChainId,
      chainConfig,
      indexerGraphClient: new GraphQLClient(chainConfig.indexer),
      constants: PROJECT_CONSTANTS,
      isDevMode,
      isExpand,
      setIsDevMode,
      setIsExpand,
    };
  }, [currentChainId, isDevMode, isExpand, setIsDevMode, setIsExpand]);

  useEffect(() => {
    if (currentChainName) {
      const userKey = formatUserKey(currentChainName, DEFAULT_ADDRESS);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
      setProjectUserKey(userKey);
    }
  }, [currentChainName, setCodeUserKey, setContractUserKey, setProjectUserKey]);

  // Disable "Leave page" alert
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.stopImmediatePropagation();
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("cosmology-ui-theme") !== "dark") {
      setModalTheme("dark");
    }
  }, [setModalTheme]);

  useNetworkChange(handleOnChainIdChange);

  useAmplitude({
    chainName: currentChainName,
    navOpen: isExpand,
    devMode: isDevMode,
  });

  if (currentChainId && !(currentChainId in CHAIN_CONFIGS))
    return <NetworkErrorState />;

  if (
    !isCodeUserKeyExist() ||
    !isContractUserKeyExist() ||
    !isProjectUserKeyExist() ||
    !currentChainId
  )
    return <LoadingOverlay />;

  return <AppContext.Provider value={states}>{children}</AppContext.Provider>;
});

export const useCelatoneApp = (): AppContextInterface => {
  return useContext(AppContext);
};
