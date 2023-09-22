import { track } from "@amplitude/analytics-browser";
import { useCallback } from "react";

import { AmpEvent } from "../types";

import { useMandatoryProperties } from "./useMandatoryProperties";

export const useTrackTx = () => {
  const mandatoryProperties = useMandatoryProperties();

  const trackTxSucceed = useCallback(
    () => track(AmpEvent.TX_SUCCEED, { ...mandatoryProperties }),
    [mandatoryProperties]
  );

  const trackTxFailed = useCallback(
    () => track(AmpEvent.TX_FAILED, { ...mandatoryProperties }),
    [mandatoryProperties]
  );

  const trackTxRejected = useCallback(
    () => track(AmpEvent.TX_REJECTED, { ...mandatoryProperties }),
    [mandatoryProperties]
  );

  return { trackTxSucceed, trackTxFailed, trackTxRejected };
};
