import type { AmpEvent } from "../types";

import { amp } from "../Amplitude";

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
