import { useMemo } from "react";

export const usePlatform = () => {
  return useMemo(() => {
    if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
      return "Mac";
    }
    return "Windows";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigator]);
};

export const useIsMac = () => {
  return usePlatform() === "Mac";
};
