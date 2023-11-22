import { amp } from "../Amplitude";
import type { AmpEvent } from "../types";

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
