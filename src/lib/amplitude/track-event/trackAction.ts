import type { AttachFundsType } from "lib/components/fund/types";

import type { ActionAmpEvent } from "../types";

import { amp } from "../Amplitude";

export const trackActionWithFunds = (
  event: ActionAmpEvent,
  funds: number,
  attachFundsOption: AttachFundsType,
  method: "json-input" | "schema"
) =>
  amp.track(event, {
    attachFundsOption,
    funds,
    method,
  });

export const trackAction = (
  event: ActionAmpEvent,
  method: "json-input" | "schema"
) =>
  amp.track(event, {
    method,
  });

export const trackActionQuery = (
  event: ActionAmpEvent,
  method: "json-input" | "schema",
  isInputRequired: boolean
) =>
  amp.track(event, {
    isInputRequired,
    method,
  });
