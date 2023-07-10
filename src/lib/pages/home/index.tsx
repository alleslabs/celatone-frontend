import DevHome from "../dev-home";
import NetworkOverview from "../network-overview";
import { useCelatoneApp } from "lib/app-provider";

const Home = () => {
  const {
    chainConfig: { hasSubHeader },
  } = useCelatoneApp();

  if (hasSubHeader) return <NetworkOverview />;
  return <DevHome />;
};

export default Home;
