import { track as amplitudeTrack } from "@amplitude/analytics-browser";
import { useCallback } from "react";

import type { AmpEvent, ActionAmpEvent, SpecialAmpEvent } from "../types";

import { useMandatoryProperties } from "./useMandatoryProperties";
import { useTrackAction } from "./useTrackAction";
import { useTrackComponent } from "./useTrackComponent";
import { useTrackExternal } from "./useTrackExternal";
import { useTrackInteraction } from "./useTrackInteraction";
import { useTrackToPage } from "./useTrackToPage";
import { useTrackTx } from "./useTrackTx";

export const useTrack = () => {
  const mandatoryProperties = useMandatoryProperties();

  const trackAction = useTrackAction();
  const trackComponent = useTrackComponent();
  const trackExternal = useTrackExternal();
  const trackInteraction = useTrackInteraction();
  const trackToPage = useTrackToPage();
  const trackTx = useTrackTx();

  const track = useCallback(
    (
      event: Exclude<AmpEvent, ActionAmpEvent | SpecialAmpEvent>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties?: Record<string, any>
    ) => {
      amplitudeTrack(event, {
        ...mandatoryProperties,
        ...properties,
      });
    },
    [mandatoryProperties]
  );

  return {
    track,
    ...trackAction,
    ...trackComponent,
    ...trackExternal,
    ...trackInteraction,
    ...trackToPage,
    ...trackTx,
  };
};
