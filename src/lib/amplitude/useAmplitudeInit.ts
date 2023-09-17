import { Identify, identify, init } from "@amplitude/analytics-browser";
import { createHash } from "crypto";

import { useCelatoneApp, useNavContext } from "lib/app-provider/contexts";
import { useCurrentChain } from "lib/app-provider/hooks";
import { useLocalStorage } from "lib/hooks/useLocalStorage";

export const useAmplitudeInit = () => {
  const { currentChainId } = useCelatoneApp();
  const { address } = useCurrentChain();
  const { isDevMode, isExpand } = useNavContext();
  const [wallets, setWallets] = useLocalStorage<string[]>("wallets", []);
  const [networks, setNetworks] = useLocalStorage<string[]>("networks", []);

  if (typeof window !== "undefined") {
    init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? "", undefined, {
      trackingOptions: {
        attribution: true,
        region: false,
        ipAddress: false,
      },
      // serverUrl: "/amplitude",
    });

    if (address) {
      const addressHash = createHash("sha256").update(address).digest("hex");

      if (!wallets.includes(addressHash)) {
        setWallets([...wallets, addressHash]);
      }
    }

    if (!networks.includes(currentChainId)) {
      setNetworks([...networks, currentChainId]);
    }

    // Custom user properties
    const identifyEvent = new Identify();
    identifyEvent.set("Wallets", wallets);
    identifyEvent.set("Wallets Count", wallets.length);
    identifyEvent.set("Nav Open", isExpand);
    identifyEvent.set("Dev Mode", isDevMode ?? "");
    identifyEvent.set("Networks", networks);
    identifyEvent.set("Networks Count", networks.length);
    identify(identifyEvent);
  }
};
