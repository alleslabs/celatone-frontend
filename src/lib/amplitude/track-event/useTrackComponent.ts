import { track } from "@amplitude/analytics-browser";
import { useCallback } from "react";

import { AmpEvent } from "../types";

import { useMandatoryProperties } from "./useMandatoryProperties";

export const useTrackComponent = () => {
  const mandatoryProperties = useMandatoryProperties();

  const trackInvalidState = useCallback(
    (title: string) =>
      track(AmpEvent.INVALID_STATE, { ...mandatoryProperties, title }),
    [mandatoryProperties]
  );

  return {
    trackInvalidState,
  };
};
