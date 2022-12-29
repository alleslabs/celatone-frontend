import { useWallet } from "@cosmos-kit/react";
import { useCallback, useState } from "react";

import type { Gas } from "lib/types";
import type { ComposedMsg } from "lib/types/tx";

// TODO: remove this hook after migrating to useQuery version
export const useSimulateFee = () => {
  const { address, getCosmWasmClient } = useWallet();

  const [loading, setLoading] = useState(false);

  const simulate = useCallback(
    async (messages: ComposedMsg[], memo?: string) => {
      setLoading(true);
      const client = await getCosmWasmClient();
      if (!client || !address) {
        setLoading(false);
        return undefined;
      }
      try {
        const fee = (await client.simulate(address, messages, memo)) as Gas;
        setLoading(false);
        return fee;
      } catch (e) {
        setLoading(false);
        throw e;
      }
    },
    [address, getCosmWasmClient, setLoading]
  );

  return { simulate, loading };
};
