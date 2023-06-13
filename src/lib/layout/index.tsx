import { Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import { useMobile } from "lib/app-provider";
import { getChainConfig } from "lib/data";
import { scrollToTop } from "lib/utils";

import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./navbar";
import SubHeader from "./SubHeader";

const getLocalIsExpand = () => {
  const state = localStorage.getItem("navbar");
  if (state === null) return null;
  return state === "expand";
};
const setLocalIsExpand = (isExpand: boolean) => {
  localStorage.setItem("navbar", isExpand ? "expand" : "collapse");
};

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isMobile = useMobile();

  const [isExpand, setIsExpand] = useState(getLocalIsExpand() ?? !isMobile);
  const handleIsExpand = (newState: boolean) => {
    setIsExpand(newState);
    setLocalIsExpand(newState);
  };

  const chainConfig = getChainConfig();

  const lightMode = {
    templateAreas: `"header""nav""main"`,
    templateRows: "70px 48px 1fr",
    templateCols: "1fr",
    navBar: <SubHeader />,
  };
  const fullMode = {
    templateAreas: `"header header""nav main"`,
    templateRows: "70px 1fr",
    templateCols: isExpand ? "224px 1fr" : "48px 1fr",
    navBar: <Navbar isExpand={isExpand} setIsExpand={handleIsExpand} />,
  };

  const mode = chainConfig.isWasm ? fullMode : lightMode;

  useEffect(() => {
    scrollToTop();
  }, [router.asPath]);
  return (
    <Grid
      templateAreas={mode.templateAreas}
      gridTemplateRows={mode.templateRows}
      gridTemplateColumns={mode.templateCols}
      h="100vh"
      overflowX="hidden"
      bg="background.main"
    >
      <GridItem bg="gray.900" area="header" mb={1}>
        <Header />
      </GridItem>
      <GridItem bg="gray.900" area="nav" overflowY="auto">
        {mode.navBar}
      </GridItem>
      <GridItem area="main" overflowY="auto" id="content">
        <div style={{ minHeight: `calc(100vh - 129px)` }}>{children}</div>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
