import type { ChainConfig } from "@alleslabs/shared";
import { useModalTheme } from "@cosmos-kit/react";
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
import type { ProjectConstants } from "config/project";
import { PROJECT_CONSTANTS } from "config/project";
import { FALLBACK_THEME, getTheme } from "config/theme";
import type { ThemeConfig } from "config/theme/types";
import { SUPPORTED_CHAIN_IDS } from "env";
import { changeFavicon } from "lib/utils";

import { DEFAULT_CHAIN_CONFIG } from "./default";

interface AppContextInterface {
  availableChainIds: string[];
  chainConfig: ChainConfig;
  constants: ProjectConstants;
  currentChainId: string;
  isHydrated: boolean;
  setTheme: (newTheme: ThemeConfig) => void;
  theme: ThemeConfig;
}

interface AppProviderProps {
  children: ReactNode;
}

const DEFAULT_STATES: AppContextInterface = {
  availableChainIds: SUPPORTED_CHAIN_IDS,
  chainConfig: DEFAULT_CHAIN_CONFIG,
  constants: PROJECT_CONSTANTS,
  currentChainId: "",
  isHydrated: false,
  setTheme: () => {},
  theme: FALLBACK_THEME,
};

const AppContext = createContext<AppContextInterface>(DEFAULT_STATES);

export const AppProvider = observer(({ children }: AppProviderProps) => {
  const { setModalTheme } = useModalTheme();
  const { chainConfigs, supportedChainIds } = useChainConfigs();

  const [states, setStates] = useState<AppContextInterface>(DEFAULT_STATES);

  // Remark: this function is only used in useNetworkChange. Do not use in other places.
  const handleOnChainIdChange = useCallback(
    (newChainId: string) => {
      const chainConfig = chainConfigs[newChainId];
      // TODO: Will handle chain config not found case in the future.
      if (!chainConfig) {
        setStates({
          ...DEFAULT_STATES,
          currentChainId: newChainId,
          isHydrated: true,
        });

        return;
      }

      const theme = getTheme(chainConfig.chain);
      changeFavicon(theme.branding.favicon);

      setStates({
        availableChainIds: supportedChainIds,
        chainConfig,
        constants: PROJECT_CONSTANTS,
        currentChainId: newChainId,
        isHydrated: true,
        setTheme: (newTheme: ThemeConfig) =>
          setStates((prev) => ({ ...prev, theme: newTheme })),
        theme,
      });
    },
    [chainConfigs, supportedChainIds]
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

  return <AppContext.Provider value={states}>{children}</AppContext.Provider>;
});

export const useCelatoneApp = (): AppContextInterface => {
  return useContext(AppContext);
};
