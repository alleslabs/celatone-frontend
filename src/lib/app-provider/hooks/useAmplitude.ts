import { Identify, identify, init } from "@amplitude/analytics-browser";
import { useChain } from "@cosmos-kit/react";
import { createHash } from "crypto";
import * as uuid from "uuid";

import type { Option } from "lib/types";

export const useAmplitude = ({
  chainName,
  navOpen,
  devMode,
}: {
  chainName: Option<string>;
  navOpen: boolean;
  devMode: Option<boolean>;
}) => {
  /**
   * @remarks Revisit default chain name
   */
  const { address } = useChain(chainName ?? "osmosis");

  if (typeof window !== "undefined") {
    init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? "", undefined, {
      trackingOptions: {
        attribution: true,
        navOpen,
        devMode,
      },
      serverUrl: "/amplitude",
    });

    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = uuid.v4();
      localStorage.setItem("deviceId", deviceId);
    }

    const identifyEvent = new Identify();
    if (address)
      identifyEvent.append(
        deviceId,
        createHash("sha256").update(address).digest("hex")
      );

    identify(identifyEvent);
  }
};
