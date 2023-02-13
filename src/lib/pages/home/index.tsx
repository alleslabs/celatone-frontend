import { Box } from "@chakra-ui/react";

// import { PastTransaction } from "./components/PastTransaction";
import { CelatoneSeo } from "lib/components/Seo";

import { QuickMenu } from "./components/QuickMenu";
import { RecentActivities } from "./components/RecentActivities";

const Home = () => (
  <Box m="1">
    <CelatoneSeo />
    <QuickMenu />
    <RecentActivities />
    {/* <PastTransaction /> */}
  </Box>
);

export default Home;
