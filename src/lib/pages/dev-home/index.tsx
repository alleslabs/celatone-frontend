import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { QuickMenu } from "./components/QuickMenu";
import { RecentActivities } from "./components/RecentActivities";

const DevHome = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_OVERVIEW);
  }, [router.isReady]);

  return (
    <Box mx={1}>
      <QuickMenu />
      <RecentActivities />
    </Box>
  );
};

export default DevHome;
