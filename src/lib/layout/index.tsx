import { Box, Grid, GridItem } from "@chakra-ui/react";
import dayjs from "dayjs";
import pluginUtc from "dayjs/plugin/utc";

import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

import { useInitia, useMobile, useNavContext } from "lib/app-provider";

import { MigrationBanner } from "lib/components/MigrationBanner";
import { scrollToTop } from "lib/utils";

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
  const isInitia = useInitia();

  const defaultRow = `64px ${isInitia ? "60px" : ""} 48px 1fr`;
  const mode = useMemo(() => {
    if (isMobile)
      return {
        templateAreas: `"header"${isInitia ? `"migrationBanner"` : ""}"main"`,
        templateRows: `60px ${isInitia ? "125px" : ""} 1fr`,
        templateCols: "1fr",
        header: <MobileHeader />,
        subHeader: undefined,
      };

    return {
      templateAreas: `"header header"${isInitia ? `"migrationBanner migrationBanner"` : ""}"subheader subheader""nav main"`,
      templateRows: defaultRow,
      templateCols: isExpand ? "235px 1fr" : "48px 1fr",
      header: <Header />,
      subHeader: <SubHeader />,
    };
  }, [defaultRow, isExpand, isInitia, isMobile]);

  useEffect(() => {
    if (!(router.query.tab === "resources")) {
      scrollToTop();
    }
  }, [router.asPath, router.query.tab]);

  return (
    <Box>
      <Grid
        templateAreas={mode.templateAreas}
        gridTemplateRows={mode.templateRows}
        gridTemplateColumns={mode.templateCols}
        h="100vh"
        overflowX="hidden"
        overflowY="auto"
        bg="background.main"
      >
        <GridItem borderBottom="1px solid" borderColor="gray.700" area="header">
          {mode.header}
        </GridItem>
        <GridItem area="migrationBanner">
          {isInitia && <MigrationBanner />}
        </GridItem>
        {!isMobile && (
          <>
            <GridItem
              borderBottom="1px solid"
              borderColor="gray.700"
              area="subheader"
              py={{ base: 2, md: 0 }}
              px={{ base: 4, md: 0 }}
            >
              {mode.subHeader}
            </GridItem>
            <GridItem
              borderRight="1px solid"
              borderColor="gray.700"
              area="nav"
              overflowY="auto"
            >
              <Navbar isExpand={isExpand} setIsExpand={setIsExpand} />
            </GridItem>
          </>
        )}
        <GridItem area="main" overflowX="hidden" id="content">
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
