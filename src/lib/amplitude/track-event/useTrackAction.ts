import { track } from "@amplitude/analytics-browser";
import { useCallback } from "react";

import type { ActionAmpEvent } from "../types";
import type { AttachFundsType } from "lib/components/fund/types";

import { useMandatoryProperties } from "./useMandatoryProperties";

export const useTrackAction = () => {
  const mandatoryProperties = useMandatoryProperties();

  const trackActionWithFunds = useCallback(
    (
      event: ActionAmpEvent,
      funds: number,
      attachFundsOption: AttachFundsType,
      method: "json-input" | "schema"
    ) =>
      track(event, {
        ...mandatoryProperties,
        funds,
        attachFundsOption,
        method,
      }),
    [mandatoryProperties]
  );

  const trackAction = useCallback(
    (event: ActionAmpEvent, method: "json-input" | "schema") =>
      track(event, {
        ...mandatoryProperties,
        method,
      }),
    [mandatoryProperties]
  );

  const trackActionQuery = useCallback(
    (
      event: ActionAmpEvent,
      method: "json-input" | "schema",
      isInputRequired: boolean
    ) =>
      track(event, {
        ...mandatoryProperties,
        method,
        isInputRequired,
      }),
    [mandatoryProperties]
  );

  // TODO: implement custom action here

  return { trackAction, trackActionWithFunds, trackActionQuery };
};
