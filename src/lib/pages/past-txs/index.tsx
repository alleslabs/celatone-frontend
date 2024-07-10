import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { TierSwitcher } from "lib/components/TierSwitcher";

import { PastTxsFull } from "./full";
import { PastTxsLite } from "./lite";

const PastTxs = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_PAST_TXS);
  }, [router.isReady]);

  return <TierSwitcher full={<PastTxsFull />} lite={<PastTxsLite />} />;
};

export default PastTxs;
