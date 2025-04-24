/* eslint-disable no-use-before-define */
import type { BrowserClient } from "@amplitude/analytics-types";
import type { Nullable } from "lib/types";

import { createInstance, Identify } from "@amplitude/analytics-browser";
import { userAgentEnrichmentPlugin } from "@amplitude/plugin-user-agent-enrichment-browser";

import type { AmpEvent } from "./types";

interface MandatoryProperties {
  chain: Nullable<string>;
  devSidebar: Nullable<boolean>;
  mobile: Nullable<boolean>;
  navSidebar: Nullable<boolean>;
  page: Nullable<string>;
  prevPathname: Nullable<string>;
  projectSidebar: Nullable<boolean>;
  rawAddressHash: Nullable<string>;
}

class Amplitude {
  private static amplitude: Amplitude;

  private client?: BrowserClient;

  private mandatoryProperties: MandatoryProperties;

  private constructor() {
    if (typeof window !== "undefined") {
      this.client = createInstance();
      this.client.add(
        userAgentEnrichmentPlugin({
          deviceManufacturer: true,
          deviceModel: true,
          osName: true,
          osVersion: true,
        })
      );

      this.client.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? "", {
        defaultTracking: {
          attribution: true,
          fileDownloads: true,
          formInteractions: true,
          pageViews: false,
          sessions: true,
        },
        serverUrl: "/amplitude",
        trackingOptions: {
          ipAddress: false,
          language: true,
          platform: true,
        },
      });
    }

    this.mandatoryProperties = {
      chain: null,
      devSidebar: null,
      mobile: null,
      navSidebar: null,
      page: null,
      prevPathname: null,
      projectSidebar: null,
      rawAddressHash: null,
    };
  }

  public static getInstance() {
    if (!Amplitude.amplitude) Amplitude.amplitude = new Amplitude();
    return Amplitude.amplitude;
  }

  public setMandatoryProperties(
    properties: Omit<MandatoryProperties, "prevPathname">
  ) {
    const { page, ...rest } = properties;
    const prevPathname = this.mandatoryProperties.page;
    this.mandatoryProperties = {
      page,
      prevPathname,
      ...rest,
    };
  }

  public setUserIdentity(
    wallets: string[],
    networks: string[],
    navSidebar: boolean,
    devSidebar: boolean,
    projectSidebar: boolean
  ) {
    // Custom user properties
    const identifyEvent = new Identify();
    identifyEvent.set("Wallets", wallets);
    identifyEvent.set("Wallets Count", wallets.length);
    identifyEvent.set("Networks", networks);
    identifyEvent.set("Networks Count", networks.length);
    identifyEvent.set("Nav Sidebar", navSidebar);
    identifyEvent.set("Dev Sidebar", devSidebar);
    identifyEvent.set("Project Sidebar", projectSidebar);

    this.client?.identify(identifyEvent);
  }

  public track(event: AmpEvent, properties?: Record<string, unknown>) {
    this.client?.track(event, {
      ...this.mandatoryProperties,
      ...properties,
    });
  }
}

export const amp = Amplitude.getInstance();
