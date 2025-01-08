import { amp } from "../Amplitude";
import type { ActionAmpEvent } from "../types";
import type { AttachFundsType } from "lib/components/fund/types";

export const trackActionWithFunds = (
  event: ActionAmpEvent,
  funds: number,
  attachFundsOption: AttachFundsType,
  method: "json-input" | "schema"
) =>
  amp.track(event, {
    funds,
    attachFundsOption,
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
    method,
    isInputRequired,
  });
