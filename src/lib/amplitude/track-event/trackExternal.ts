import type { Dict } from "lib/types";

import { amp } from "../Amplitude";
import { AmpEvent } from "../types";

export const trackMintScan = (
  type: string,
  properties?: Dict<string, unknown>,
  section?: string
) =>
  amp.track(AmpEvent.MINTSCAN, {
    properties,
    section,
    type,
  });

export const trackWebsite = (url: string, section?: string) =>
  amp.track(AmpEvent.WEBSITE, {
    section,
    url,
  });

export const trackSocial = (url: string, section?: string) =>
  amp.track(AmpEvent.SOCIAL, {
    section,
    url,
  });
