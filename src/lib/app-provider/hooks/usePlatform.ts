import { useMemo } from "react";

export const usePlatform = () => {
  return useMemo(() => {
    if (typeof navigator === "undefined") {
      return "Unknown";
    }
    const { userAgent } = navigator;
    const isMac = /Mac OS X/.test(userAgent);
    return isMac ? "Mac" : "Windows";
  }, []);
};

export const useIsMac = () => {
  return usePlatform() === "Mac";
};
