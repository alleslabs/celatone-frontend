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
  // eslint-disable-next-line sonarjs/cognitive-complexity
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

    const wallets = localStorage.getItem("wallets");
    if (wallets) {
      if (address) {
        const walletsJson = JSON.parse(wallets);
        const addressHash = createHash("sha256").update(address).digest("hex");

        if (!walletsJson.includes(addressHash)) {
          walletsJson.push(addressHash);
          localStorage.setItem("wallets", JSON.stringify(walletsJson));
        }
      }
    } else {
      localStorage.setItem("wallets", JSON.stringify([]));
    }

    // Custom user properties
    const identifyEvent = new Identify();
    identifyEvent.set("Wallets", wallets ?? "");
    identifyEvent.set("Wallets Number", JSON.parse(wallets ?? "").length);
    identifyEvent.set("Nav Open", navOpen);
    identifyEvent.set("Dev Mode", devMode ?? "");
    identify(identifyEvent);
  }
};
