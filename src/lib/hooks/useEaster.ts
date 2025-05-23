import { JENNIE_THEME } from "config/theme/jennie";
import { useCelatoneApp } from "lib/app-provider";
import { useEffect } from "react";

export const useEaster = (keyword: string) => {
  const { currentChainId, setTheme } = useCelatoneApp();
  useEffect(() => {
    if (currentChainId === "initiation-2" && keyword.toLowerCase() === "jennie")
      setTheme(JENNIE_THEME);
  }, [currentChainId, keyword, setTheme]);
};
