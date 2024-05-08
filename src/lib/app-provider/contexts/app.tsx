import { useModalTheme } from "@cosmos-kit/react";
import { GraphQLClient } from "graphql-request";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNetworkChange } from "../hooks/useNetworkChange";
import { CHAIN_CONFIGS, DEFAULT_CHAIN_CONFIG } from "config/chain";
import type { ChainConfig } from "config/chain";
import { PROJECT_CONSTANTS } from "config/project";
import type { ProjectConstants } from "config/project";
import { DEFAULT_THEME, getTheme } from "config/theme";
import type { ThemeConfig } from "config/theme/types";
import { HASURA_ADMIN_SECRET, SUPPORTED_CHAIN_IDS } from "env";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { NetworkErrorState } from "lib/components/state/NetworkErrorState";
import { DEFAULT_ADDRESS } from "lib/data";
import {
  useAccountStore,
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
  theme: ThemeConfig;
}

const AppContext = createContext<AppContextInterface>({
  availableChainIds: [],
  currentChainId: "",
  chainConfig: DEFAULT_CHAIN_CONFIG,
  indexerGraphClient: new GraphQLClient(DEFAULT_CHAIN_CONFIG.indexer),
  constants: PROJECT_CONSTANTS,
  theme: DEFAULT_THEME,
});

export const AppProvider = observer(({ children }: AppProviderProps) => {
  const { setAccountUserKey, isAccountUserKeyExist } = useAccountStore();
  const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
  const { setContractUserKey, isContractUserKeyExist } = useContractStore();
  const { setProjectUserKey, isProjectUserKeyExist } = usePublicProjectStore();
  const { setModalTheme } = useModalTheme();

  const [currentChainName, setCurrentChainName] = useState<string>();
  const [currentChainId, setCurrentChainId] = useState("");

  // Remark: this function is only used in useSelectChain. Do not use in other places.
  const handleOnChainIdChange = useCallback((newChainId: string) => {
    const config = CHAIN_CONFIGS[newChainId];

    const theme = getTheme(config.chain);
    // Change Favicon
    const documentHead =
      document.head || document.getElementsByTagName("head")[0];

    const newFavicon = document.createElement("link");
    newFavicon.id = "favicon";
    newFavicon.rel = "shortcut icon";
    newFavicon.href = theme.branding.favicon;

    const oldFavicon = document.getElementById("favicon");
    if (oldFavicon) {
      documentHead.removeChild(oldFavicon);
    }
    documentHead.appendChild(newFavicon);

    setCurrentChainId(newChainId);
    setCurrentChainName(config?.registryChainName);
  }, []);

  const states = useMemo<AppContextInterface>(() => {
    const chainConfig = CHAIN_CONFIGS[currentChainId] ?? DEFAULT_CHAIN_CONFIG;

    return {
      availableChainIds: SUPPORTED_CHAIN_IDS,
      currentChainId,
      chainConfig,
      indexerGraphClient: new GraphQLClient(chainConfig.indexer, {
        headers: {
          "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
        },
      }),
      constants: PROJECT_CONSTANTS,
      theme: getTheme(chainConfig.chain),
    };
  }, [currentChainId]);

  useEffect(() => {
    if (currentChainName) {
      const userKey = formatUserKey(currentChainName, DEFAULT_ADDRESS);
      setAccountUserKey(userKey);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
      setProjectUserKey(userKey);
    }
  }, [
    currentChainName,
    setAccountUserKey,
    setCodeUserKey,
    setContractUserKey,
    setProjectUserKey,
  ]);

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

  if (currentChainId && !(currentChainId in CHAIN_CONFIGS))
    return <NetworkErrorState />;

  if (
    !isAccountUserKeyExist() ||
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
