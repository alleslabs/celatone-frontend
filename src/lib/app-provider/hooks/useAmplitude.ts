import { Identify, identify, init } from "@amplitude/analytics-browser";
import { useChain } from "@cosmos-kit/react";
import { createHash } from "crypto";

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
      },
      serverUrl: "/amplitude",
    });

    const wallets = JSON.parse(localStorage.getItem("wallets") ?? "[]");

    if (address) {
      const addressHash = createHash("sha256").update(address).digest("hex");

      if (!wallets.includes(addressHash)) {
        wallets.push(addressHash);
      }
    }
    localStorage.setItem("wallets", JSON.stringify(wallets));

    const networks = JSON.parse(localStorage.getItem("networks") ?? "[]");

    if (chainName && !networks.includes(chainName)) {
      networks.push(chainName);
    }
    localStorage.setItem("networks", JSON.stringify(networks));

    // Custom user properties
    const identifyEvent = new Identify();
    identifyEvent.set("Wallets", wallets);
    identifyEvent.set("Wallets Count", wallets.length);
    identifyEvent.set("Nav Open", navOpen);
    identifyEvent.set("Dev Mode", devMode ?? "");
    identifyEvent.set("Networks", networks);
    identifyEvent.set("Networks Count", networks.length);
    identify(identifyEvent);
  }
};
