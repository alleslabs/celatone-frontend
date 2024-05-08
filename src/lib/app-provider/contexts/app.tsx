import { useModalTheme } from "@cosmos-kit/react";
import { GraphQLClient } from "graphql-request";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import { changeFavicon } from "lib/utils";

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

const DEFAULT_STATES: AppContextInterface = {
  availableChainIds: SUPPORTED_CHAIN_IDS,
  currentChainId: "",
  chainConfig: DEFAULT_CHAIN_CONFIG,
  indexerGraphClient: new GraphQLClient(DEFAULT_CHAIN_CONFIG.indexer),
  constants: PROJECT_CONSTANTS,
  theme: DEFAULT_THEME,
};

const AppContext = createContext<AppContextInterface>(DEFAULT_STATES);

export const AppProvider = ({ children }: AppProviderProps) => {
  const { setModalTheme } = useModalTheme();

  const [states, setStates] = useState<AppContextInterface>(DEFAULT_STATES);

  // Remark: this function is only used in useSelectChain. Do not use in other places.
  const handleOnChainIdChange = useCallback((newChainId: string) => {
    const chainConfig = CHAIN_CONFIGS[newChainId] ?? DEFAULT_CHAIN_CONFIG;

    const theme = getTheme(chainConfig.chain);
    changeFavicon(theme.branding.favicon);

    setStates({
      availableChainIds: SUPPORTED_CHAIN_IDS,
      currentChainId: newChainId,
      chainConfig,
      indexerGraphClient: new GraphQLClient(chainConfig.indexer, {
        headers: {
          "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
        },
      }),
      constants: PROJECT_CONSTANTS,
      theme,
    });
  }, []);

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

  return <AppContext.Provider value={states}>{children}</AppContext.Provider>;
};

export const useCelatoneApp = (): AppContextInterface => {
  return useContext(AppContext);
};
