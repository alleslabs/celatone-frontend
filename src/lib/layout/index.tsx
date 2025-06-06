import type { ReactNode } from "react";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import dayjs from "dayjs";
import pluginUtc from "dayjs/plugin/utc";
import { useMobile, useNavContext } from "lib/app-provider";
import { scrollToTop } from "lib/utils";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import Footer from "./Footer";
import Header from "./Header";
import MobileHeader from "./mobile/MobileHeader";
import Navbar from "./navbar";
import SubHeader from "./subheader";

dayjs.extend(pluginUtc);

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isMobile = useMobile();
  const { isExpand, setIsExpand } = useNavContext();

  const defaultRow = `65px 48px 1fr`;
  const mode = useMemo(() => {
    if (isMobile)
      return {
        header: <MobileHeader />,
        subHeader: undefined,
        templateAreas: `"header""main"`,
        templateCols: "1fr",
        templateRows: `60px 1fr`,
      };

    return {
      header: <Header />,
      subHeader: <SubHeader />,
      templateAreas: `"header header""subheader subheader""nav main"`,
      templateCols: isExpand ? "235px 1fr" : "48px 1fr",
      templateRows: defaultRow,
    };
  }, [defaultRow, isExpand, isMobile]);

  useEffect(() => {
    if (!(router.query.tab === "resources")) {
      scrollToTop();
    }
  }, [router.asPath, router.query.tab]);

  return (
    <Box>
      <Grid
        bg="background.main"
        gridTemplateColumns={mode.templateCols}
        gridTemplateRows={mode.templateRows}
        h="100vh"
        overflowX="hidden"
        overflowY="auto"
        templateAreas={mode.templateAreas}
      >
        <GridItem area="header" borderBottomWidth="1px" borderColor="gray.700">
          {mode.header}
        </GridItem>
        {!isMobile && (
          <>
            <GridItem
              area="subheader"
              borderBottomWidth="1px"
              borderColor="gray.700"
              px={{ base: 4, md: 0 }}
              py={{ base: 2, md: 0 }}
            >
              {mode.subHeader}
            </GridItem>
            <GridItem
              area="nav"
              borderColor="gray.700"
              borderRightWidth="1px"
              overflowY="auto"
            >
              <Navbar isExpand={isExpand} setIsExpand={setIsExpand} />
            </GridItem>
          </>
        )}
        <GridItem id="content" area="main" overflowX="hidden">
          <div
            style={{ minHeight: "calc(100vh - 129px)", position: "relative" }}
          >
            {children}
          </div>
          <Footer />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Layout;
