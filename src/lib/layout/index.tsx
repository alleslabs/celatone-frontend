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
import Searchbar from "./Searchbar";
import SubHeader from "./SubHeader";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isMobile = useMobile();

  const [isExpand, setIsExpand] = useState(!isMobile);
  const chainConfig = getChainConfig();

  const mobile = {
    templateAreas: `"header""nav""main"`,
    templateRows: "60px 56px 1fr",
    templateCols: "1fr",
    navBar: <Searchbar />,
  };
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
    navBar: <Navbar isExpand={isExpand} setIsExpand={setIsExpand} />,
  };

  const mode = (() => {
    if (isMobile) return mobile;
    return chainConfig.isWasm ? fullMode : lightMode;
  })();

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
      <GridItem
        bg={{ base: "background.main", md: "gray.900" }}
        area="nav"
        overflowY={isMobile ? "visible" : "auto"}
        py={{ base: 2, md: 0 }}
        px={{ base: 4, md: 0 }}
      >
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
