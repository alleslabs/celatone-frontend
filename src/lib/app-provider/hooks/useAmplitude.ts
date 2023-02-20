import { init, setDeviceId, setUserId } from "@amplitude/analytics-browser";
import { useWallet } from "@cosmos-kit/react";
import { createHash } from "crypto";
import { useEffect } from "react";
import * as uuid from "uuid";

export const useAmplitude = () => {
  const { address, currentChainName } = useWallet();

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
      if (currentChainName) {
        const userId = address
          ? createHash("sha256").update(address).digest("hex")
          : undefined;
        setUserId(`${currentChainName}/${userId}`);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [address, currentChainName]);
};
