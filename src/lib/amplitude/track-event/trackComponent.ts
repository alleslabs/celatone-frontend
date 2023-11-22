import { amp } from "../Amplitude";
import { AmpEvent } from "../types";

export const trackInvalidState = (title: string) =>
  amp.track(AmpEvent.INVALID_STATE, { title });
