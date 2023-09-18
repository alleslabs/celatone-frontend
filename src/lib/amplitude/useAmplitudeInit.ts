import { Identify, identify, init } from "@amplitude/analytics-browser";
import { fromBech32 } from "@cosmjs/encoding";

import { useCelatoneApp, useNavContext } from "lib/app-provider/contexts";
import { useCurrentChain } from "lib/app-provider/hooks";
import { useLocalStorage } from "lib/hooks/useLocalStorage";
import { sha256Hex } from "lib/utils";

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
      serverUrl: "/amplitude",
    });

    // TODO: make util function
    if (address) {
      const rawAddressHash = sha256Hex(fromBech32(address).data);

      if (!wallets.includes(rawAddressHash)) {
        setWallets([...wallets, rawAddressHash]);
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
