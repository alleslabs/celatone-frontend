import { amp } from "../Amplitude";
import type { AmpEvent } from "../types";

export const trackContractStatesLoad = (
  event:
    | AmpEvent.USE_CONTRACT_STATES_DOWNLOAD
    | AmpEvent.USE_CONTRACT_STATES_LOAD_MORE,
  properties: {
    currentStates: number;
    namespaces: string[];
    namespacesCount: number;
  }
) => amp.track(event, properties);
