import type { AmpEvent } from "../types";

import { amp } from "../Amplitude";

export const trackContractStatesLoad = (
  event:
    | AmpEvent.USE_CONTRACT_STATES_LOAD_MORE
    | AmpEvent.USE_CONTRACT_STATES_DOWNLOAD,
  properties: {
    currentStates: number;
    namespacesCount: number;
    namespaces: string[];
  }
) => amp.track(event, properties);
