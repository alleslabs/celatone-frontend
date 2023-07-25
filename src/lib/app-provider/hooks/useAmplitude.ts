import { init, setDeviceId, setUserId } from "@amplitude/analytics-browser";
import { useChain } from "@cosmos-kit/react";
import { createHash } from "crypto";
import { useEffect } from "react";
import * as uuid from "uuid";

import type { Option } from "lib/types";

export const useAmplitude = (chainName: Option<string>) => {
  /**
   * @remarks Revisit default chain name
   */
  const { address } = useChain(chainName ?? "osmosis");
  if (typeof window !== "undefined") {
    init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? "", undefined, {
      trackingOptions: {
        deviceManufacturer: false,
        deviceModel: false,
        ipAddress: false,
        language: false,
        osName: false,
        osVersion: false,
        platform: false,
      },
      serverUrl: "/amplitude",
    });

    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = uuid.v4();
      localStorage.setItem("deviceId", deviceId);
    }
    setDeviceId(deviceId);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (chainName) {
        const userId = address
          ? createHash("sha256").update(address).digest("hex")
          : undefined;
        setUserId(`${chainName}/${userId}`);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [address, chainName]);
};
