import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { TierSwitcher } from "lib/components/TierSwitcher";

import { HomeFull } from "./full";
import { HomeLite } from "./lite";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_OVERVIEW);
  }, [router.isReady]);

  return <TierSwitcher full={<HomeFull />} lite={<HomeLite />} />;
};

export default Home;
