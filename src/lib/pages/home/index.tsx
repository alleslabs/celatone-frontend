import { Box } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

// import { PastTransaction } from "./components/PastTransaction";
import { QuickMenu } from "./components/QuickMenu";
import { RecentActivities } from "./components/RecentActivities";

const Home = () => (
  <Box mx="1">
    <NextSeo
      title="Home"
      description="Explore, deploy, interact, and organize CosmWasm contracts with ease using Celatone. Our tool makes it easy to interact with smart contracts on various networks."
      openGraph={{
        url: "https://www.url.ie/a",
        title: "Home",
        description:
          "Explore, deploy, interact, and organize CosmWasm contracts with ease using Celatone. Our tool makes it easy to interact with smart contracts on various networks.",
        images: [
          {
            url: "https://assets.alleslabs.dev/branding/banners/celatone-cover.jpg",
            width: 1200,
            height: 630,
            alt: "Celatone, simplify your smart contract experience",
          },
        ],
      }}
      twitter={{
        handle: "@celatone_",
        cardType: "summary_large_image",
      }}
    />
    <QuickMenu />
    <RecentActivities />
    {/* <PastTransaction /> */}
  </Box>
);

export default Home;
