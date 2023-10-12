import { track } from "@amplitude/analytics-browser";
import { useCallback } from "react";

import { AmpEvent } from "../types";
import type { Dict } from "lib/types";

import { useMandatoryProperties } from "./useMandatoryProperties";

export const useTrackExternal = () => {
  const mandatoryProperties = useMandatoryProperties();

  const trackMintScan = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (type: string, properties?: Dict<string, any>, section?: string) => {
      track(AmpEvent.MINTSCAN, {
        ...mandatoryProperties,
        type,
        properties,
        section,
      });
    },
    [mandatoryProperties]
  );

  const trackWebsite = useCallback(
    (url: string, section?: string) =>
      track(AmpEvent.WEBSITE, {
        ...mandatoryProperties,
        url,
        section,
      }),
    [mandatoryProperties]
  );

  const trackSocial = useCallback(
    (url: string, section?: string) =>
      track(AmpEvent.SOCIAL, {
        ...mandatoryProperties,
        url,
        section,
      }),
    [mandatoryProperties]
  );

  const trackCelatone = useCallback(
    (url: string, section?: string) =>
      track(AmpEvent.CELATONE, {
        ...mandatoryProperties,
        url,
        section,
      }),
    [mandatoryProperties]
  );

  return {
    trackMintScan,
    trackWebsite,
    trackSocial,
    trackCelatone,
  };
};
