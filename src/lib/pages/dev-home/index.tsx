import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import NetworkOverview from "../network-overview";
import { getChainConfig } from "lib/data";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { QuickMenu } from "./components/QuickMenu";
import { RecentActivities } from "./components/RecentActivities";

const DevHome = () => {
  const router = useRouter();
  const chainConfig = getChainConfig();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_OVERVIEW);
  }, [router.isReady]);

  return chainConfig.isWasm ? (
    <Box mx={1}>
      <QuickMenu />
      <RecentActivities />
    </Box>
  ) : (
    <NetworkOverview />
  );
};

export default DevHome;
