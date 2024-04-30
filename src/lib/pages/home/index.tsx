import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";

import { HomeFull } from "./full";
import { HomeLite } from "./lite";

const Home = () => {
  const router = useRouter();
  const tier = useTierConfig({ minTier: "lite" });

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_OVERVIEW);
  }, [router.isReady]);

  return (
    <PageContainer>
      {tier === "lite" ? <HomeLite /> : <HomeFull />}
    </PageContainer>
  );
};

export default Home;
