import { amp } from "../Amplitude";
import { AmpEvent } from "../types";

export const trackTxSucceed = () => amp.track(AmpEvent.TX_SUCCEED);

export const trackTxFailed = () => amp.track(AmpEvent.TX_FAILED);

export const trackTxRejected = () => amp.track(AmpEvent.TX_REJECTED);
