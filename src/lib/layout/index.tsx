import { Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

import { useMobile, useNavContext } from "lib/app-provider";
import { scrollToTop } from "lib/utils";

import Footer from "./Footer";
import Header from "./Header";
import MobileHeader from "./mobile/MobileHeader";
import Navbar from "./navbar";
import SubHeader from "./subheader";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isMobile = useMobile();
  const { isExpand, setIsExpand } = useNavContext();

  const defaultRow = "64px 48px 1fr";
  const mode = useMemo(() => {
    if (isMobile)
      return {
        header: <MobileHeader />,
        subHeader: undefined,
        templateAreas: `"header""main"`,
        templateCols: "1fr",
        templateRows: "60px 1fr",
      };

    return {
      header: <Header />,
      subHeader: <SubHeader />,
      templateAreas: `"header header""subheader subheader""nav main"`,
      templateCols: isExpand ? "235px 1fr" : "48px 1fr",
      templateRows: defaultRow,
    };
  }, [isExpand, isMobile]);

  useEffect(() => {
    if (!(router.query.tab === "resources")) {
      scrollToTop();
    }
  }, [router.asPath, router.query.tab]);

  return (
    <Grid
      gridTemplateColumns={mode.templateCols}
      gridTemplateRows={mode.templateRows}
      bg="background.main"
      h="100vh"
      templateAreas={mode.templateAreas}
      overflowX="hidden"
      overflowY="scroll"
    >
      <GridItem area="header" borderBottom="1px solid" borderColor="gray.700">
        {mode.header}
      </GridItem>
      {!isMobile && (
        <>
          <GridItem
            area="subheader"
            px={{ base: 4, md: 0 }}
            py={{ base: 2, md: 0 }}
            borderBottom="1px solid"
            borderColor="gray.700"
          >
            {mode.subHeader}
          </GridItem>
          <GridItem
            area="nav"
            borderColor="gray.700"
            borderRight="1px solid"
            overflowY="auto"
          >
            <Navbar isExpand={isExpand} setIsExpand={setIsExpand} />
          </GridItem>
        </>
      )}
      <GridItem id="content" area="main" overflowX="hidden">
        <div style={{ minHeight: "calc(100vh - 129px)", position: "relative" }}>
          {children}
        </div>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
