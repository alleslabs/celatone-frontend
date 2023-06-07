import { Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import { useMobile } from "lib/app-provider";
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

  const [isExpand, setIsExpand] = useState(false);
  const isMobile = useMobile();

  const mobile = {
    templateAreas: `"header""subheader""main"`,
    templateRows: "60px 56px 1fr",
    templateCols: "1fr",
    subHeader: <Searchbar />,
  };
  const fullMode = {
    templateAreas: `"header header""subheader subheader""nav main"`,
    templateRows: "70px 48px 1fr",
    templateCols: isExpand ? "224px 1fr" : "48px 1fr",
    subHeader: <SubHeader />,
  };

  const mode = (() => {
    return isMobile ? mobile : fullMode;
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
        area="subheader"
        mb="1"
        overflowY={isMobile ? "visible" : "auto"}
        py={{ base: 2, md: 0 }}
        px={{ base: 4, md: 0 }}
      >
        {mode.subHeader}
      </GridItem>
      {!isMobile && (
        <GridItem
          bg={{ base: "background.main", md: "gray.900" }}
          area="nav"
          overflowY={isMobile ? "visible" : "auto"}
        >
          <Navbar isExpand={isExpand} setIsExpand={setIsExpand} />
        </GridItem>
      )}
      <GridItem area="main" overflowY="auto" overflowX="hidden" id="content">
        <div style={{ minHeight: `calc(100vh - 129px)` }}>{children}</div>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
