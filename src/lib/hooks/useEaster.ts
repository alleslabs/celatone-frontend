import { useEffect } from "react";

import { JENNIE_THEME } from "config/theme/jennie";
import { useCelatoneApp } from "lib/app-provider";

export const useEaster = (keyword: string) => {
  const { currentChainId, setTheme } = useCelatoneApp();
  useEffect(() => {
    if (currentChainId === "initiation-1" && keyword === "jennie")
      setTheme(JENNIE_THEME);
  }, [currentChainId, keyword, setTheme]);
};
