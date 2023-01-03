import { Box } from "@chakra-ui/react";

// import { PastTransaction } from "./components/PastTransaction";
import { QuickMenu } from "./components/QuickMenu";
import { RecentActivities } from "./components/RecentActivities";

const Home = () => {
  return (
    <Box mx="1">
      <QuickMenu />
      <RecentActivities />
      {/* <PastTransaction /> */}
    </Box>
  );
};

export default Home;
