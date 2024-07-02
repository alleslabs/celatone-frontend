import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";

import { PastTxsFull } from "./full";
import { PastTxsLite } from "./lite";

const PastTxs = () => {
  const router = useRouter();
  const isFullTier = useTierConfig() === "full";

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_PAST_TXS);
  }, [router.isReady]);

  return isFullTier ? <PastTxsFull /> : <PastTxsLite />;
};

export default PastTxs;
