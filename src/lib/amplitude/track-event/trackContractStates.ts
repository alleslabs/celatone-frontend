import { amp } from "../Amplitude";
import type { AmpEvent } from "../types";

export const trackContractStatesLoad = (
  event:
    | AmpEvent.USE_CONTRACT_STATES_LOAD_MORE
    | AmpEvent.USE_CONTRACT_STATES_DOWNLOAD,
  properties: {
    current_states: number;
    namespaces_count: number;
    namespaces: string[];
  }
) => amp.track(event, properties);
