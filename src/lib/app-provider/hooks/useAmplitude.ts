import { init, setDeviceId, setUserId } from "@amplitude/analytics-browser";
import { State } from "@cosmos-kit/core";
import { useWallet } from "@cosmos-kit/react";
import { createHash } from "crypto";
import { useEffect } from "react";

export const useAmplitude = () => {
  const { address, currentChainName, state } = useWallet();

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
      deviceId = window.crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }
    setDeviceId(deviceId);
  }

  useEffect(() => {
    if (state === State.Done) {
      const userId = address
        ? createHash("sha256").update(address).digest("hex")
        : undefined;
      setUserId(`${currentChainName}/${userId}`);
    }
  }, [address, currentChainName, state]);
};
