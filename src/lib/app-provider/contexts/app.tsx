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

import type { ProjectConstants } from "config/project";
import { PROJECT_CONSTANTS } from "config/project";
import { FALLBACK_THEME, getTheme } from "config/theme";
import type { ThemeConfig } from "config/theme/types";
import { changeFavicon } from "lib/utils";

import { DEFAULT_CHAIN_CONFIG } from "./default";
import { useChainConfigs } from "../hooks/useChainConfigs";
import { useNetworkChange } from "../hooks/useNetworkChange";

interface AppProviderProps {
  children: ReactNode;
}

interface AppContextInterface {
  isHydrated: boolean;
  currentChainId: string;
  chainConfig: ChainConfig;
  constants: ProjectConstants;
  theme: ThemeConfig;
  setTheme: (newTheme: ThemeConfig) => void;
}

const DEFAULT_STATES: AppContextInterface = {
  isHydrated: false,
  currentChainId: "",
  chainConfig: DEFAULT_CHAIN_CONFIG,
  constants: PROJECT_CONSTANTS,
  theme: FALLBACK_THEME,
  setTheme: () => {},
};

const AppContext = createContext<AppContextInterface>(DEFAULT_STATES);

export const AppProvider = observer(({ children }: AppProviderProps) => {
  const { setModalTheme } = useModalTheme();
  const { chainConfigs } = useChainConfigs();

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
        isHydrated: true,
        currentChainId: newChainId,
        chainConfig,
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

  return <AppContext.Provider value={states}>{children}</AppContext.Provider>;
});

export const useCelatoneApp = (): AppContextInterface => {
  return useContext(AppContext);
};
