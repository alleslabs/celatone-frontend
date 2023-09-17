import { track } from "@amplitude/analytics-browser";
import { useCallback } from "react";

import type { ActionAmpEvent } from "../types";
import type { AttachFundsType } from "lib/components/fund/types";

import { useMandatoryProperties } from "./useMandatoryProperties";

export const useTrackAction = () => {
  const mandatoryProperties = useMandatoryProperties();

  const trackAction = useCallback(
    (
      event: ActionAmpEvent,
      funds: number,
      attachFundsOption: AttachFundsType
    ) =>
      track(event, {
        ...mandatoryProperties,
        funds,
        attachFundsOption,
      }),
    [mandatoryProperties]
  );

  // TODO: implement custom action here

  return { trackAction };
};
