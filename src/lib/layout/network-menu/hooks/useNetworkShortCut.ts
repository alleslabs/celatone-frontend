import { useIsMac } from "lib/app-provider";
import { useEffect } from "react";

export const useNetworkShortCut = (onToggle: () => void) => {
  const isMac = useIsMac();

  useEffect(() => {
    const openSearchHandler = (event: KeyboardEvent) => {
      const specialKey = isMac ? event.metaKey : event.ctrlKey;
      if (event.key === `/` && specialKey) {
        event.preventDefault();
        onToggle();
      }
    };
    document.addEventListener("keydown", openSearchHandler);

    return () => document.removeEventListener("keydown", openSearchHandler);
  }, [isMac, onToggle]);
};
