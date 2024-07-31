import { useModalTheme } from "@cosmos-kit/react";
import { GraphQLClient } from "graphql-request";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useChainConfigs } from "../hooks/useChainConfigs";
import { useNetworkChange } from "../hooks/useNetworkChange";
import { FALLBACK_CHAIN_CONFIG } from "config/chain";
import type { ChainConfig } from "config/chain";
import { PROJECT_CONSTANTS } from "config/project";
import type { ProjectConstants } from "config/project";
import { FALLBACK_THEME, getTheme } from "config/theme";
import type { ThemeConfig } from "config/theme/types";
import {
  FALLBACK_SUPPORTED_CHAIN_ID,
  HASURA_ADMIN_SECRET,
  SUPPORTED_CHAIN_IDS,
} from "env";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { useChainConfigStore } from "lib/providers/store";
import { changeFavicon } from "lib/utils";

interface AppProviderProps {
  children: ReactNode;
}

interface AppContextInterface {
  isHydrated: boolean;
  availableChainIds: string[];
  currentChainId: string;
  chainConfig: ChainConfig;
  indexerGraphClient: GraphQLClient;
  constants: ProjectConstants;
  theme: ThemeConfig;
  setTheme: (newTheme: ThemeConfig) => void;
}

const DEFAULT_STATES: AppContextInterface = {
  isHydrated: false,
  availableChainIds: SUPPORTED_CHAIN_IDS,
  currentChainId: FALLBACK_SUPPORTED_CHAIN_ID,
  chainConfig: FALLBACK_CHAIN_CONFIG,
  indexerGraphClient: new GraphQLClient(FALLBACK_CHAIN_CONFIG.indexer, {
    headers: {
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    },
  }),
  constants: PROJECT_CONSTANTS,
  theme: FALLBACK_THEME,
  setTheme: () => {},
};

const AppContext = createContext<AppContextInterface>(DEFAULT_STATES);

export const AppProvider = observer(({ children }: AppProviderProps) => {
  const { setModalTheme } = useModalTheme();
  const { chainConfigs } = useChainConfigs();
  const { isHydrated: isChainConfigStoreHydrated } = useChainConfigStore();

  const [states, setStates] = useState<AppContextInterface>(DEFAULT_STATES);

  // Remark: this function is only used in useSelectChain. Do not use in other places.
  const handleOnChainIdChange = useCallback(
    (newChainId: string) => {
      const chainConfig = chainConfigs[newChainId] ?? FALLBACK_CHAIN_CONFIG;

      const theme = getTheme(chainConfig.chain);
      changeFavicon(theme.branding.favicon);

      setStates({
        isHydrated: true,
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
        setTheme: (newTheme: ThemeConfig) =>
          setStates((prev) => ({ ...prev, theme: newTheme })),
      });
    },
    [chainConfigs]
  );

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

  if (!isChainConfigStoreHydrated) return <LoadingOverlay />;
  return <AppContext.Provider value={states}>{children}</AppContext.Provider>;
});

export const useCelatoneApp = (): AppContextInterface => {
  return useContext(AppContext);
};
