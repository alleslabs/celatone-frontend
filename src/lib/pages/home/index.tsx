import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import NetworkOverview from "../network-overview";
import { useWasmConfig } from "lib/app-provider";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { QuickMenu } from "./components/QuickMenu";
import { RecentActivities } from "./components/RecentActivities";

const Home = () => {
  const router = useRouter();
  const { enabled: isWasm } = useWasmConfig();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_OVERVIEW);
  }, [router.isReady]);

  return isWasm ? (
    <Box mx="1">
      <QuickMenu />
      <RecentActivities />
    </Box>
  ) : (
    <NetworkOverview />
  );
};

export default Home;
