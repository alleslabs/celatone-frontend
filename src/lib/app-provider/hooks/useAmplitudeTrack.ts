import { track } from "@amplitude/analytics-browser";
import { createHash } from "crypto";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { useCelatoneApp } from "../contexts";
import { AmpEvent } from "lib/services/amplitude";

import { useCurrentChain } from "./useCurrentChain";
import { useMobile } from "./useMediaQuery";

export const useAmplitudeTrack = () => {
  const { isExpand, isDevMode, currentChainId } = useCelatoneApp();
  const { address } = useCurrentChain();
  const isMobile = useMobile();
  const router = useRouter();

  const walletAddress = address
    ? createHash("sha256").update(address).digest("hex")
    : "Not Connected";

  const mandatoryEvents = useMemo(
    () => ({
      page: router.pathname.replace("/[network]", ""),
      walletAddress,
      chain: currentChainId,
      mobile: isMobile,
      navOpen: isExpand,
      devMode: isDevMode,
    }),
    [
      currentChainId,
      isDevMode,
      isExpand,
      isMobile,
      router.pathname,
      walletAddress,
    ]
  );

  // To Query
  const ampTrackToQuery = useCallback(
    (contract: boolean, msg: boolean, section?: string) => {
      track(AmpEvent.TO_QUERY, {
        ...mandatoryEvents,
        contract,
        msg,
        section,
      });
    },
    [mandatoryEvents]
  );

  return { ampTrackToQuery };
};
