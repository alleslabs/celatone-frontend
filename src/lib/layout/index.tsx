import { Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

import { useCelatoneApp, useMobile, useWasmConfig } from "lib/app-provider";
import { useLocalStorage } from "lib/hooks/useLocalStorage";
import { scrollToTop } from "lib/utils";

import Footer from "./Footer";
import Header from "./Header";
import MobileHeader from "./mobile/MobileHeader";
import Navbar from "./navbar";
import SubHeader from "./SubHeader";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const {
    chainConfig: { hasSubHeader },
  } = useCelatoneApp();
  const router = useRouter();
  const isMobile = useMobile();
  const wasm = useWasmConfig({ shouldRedirect: false });

  const [isExpand, setIsExpand] = useLocalStorage("navbar", !isMobile);
  const defaultRow = "70px 48px 1fr";
  const mode = useMemo(() => {
    if (hasSubHeader) {
      if (isMobile)
        return {
          templateAreas: `"header""main"`,
          templateRows: "60px 1fr",
          templateCols: "1fr",
          header: <MobileHeader />,
          subHeader: undefined,
        };

      if (wasm.enabled)
        return {
          templateAreas: `"header header""subheader subheader""nav main"`,
          templateRows: defaultRow,
          templateCols: isExpand ? "224px 1fr" : "48px 1fr",
          header: <Header />,
          subHeader: <SubHeader />,
        };

      return {
        templateAreas: `"header""nav""main"`,
        templateRows: defaultRow,
        templateCols: "1fr",
        navBar: <SubHeader />,
      };
    }

    if (isMobile)
      return {
        templateAreas: `"header""main"`,
        templateRows: "60px 1fr",
        templateCols: "1fr",
        header: <MobileHeader />,
        subHeader: undefined,
      };

    if (wasm.enabled)
      return {
        templateAreas: `"header header""nav main"`,
        templateRows: "70px 1fr",
        templateCols: isExpand ? "224px 1fr" : "48px 1fr",
        header: <Header />,
        subHeader: undefined,
      };

    return {
      templateAreas: `"header""nav""main"`,
      templateRows: defaultRow,
      templateCols: "1fr",
      navBar: <SubHeader />,
    };
  }, [isMobile, wasm.enabled, isExpand, hasSubHeader]);

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
      overflowY="scroll"
      bg="background.main"
    >
      <GridItem bg="gray.900" area="header" mb={1}>
        {mode.header}
      </GridItem>
      {!isMobile && (
        <>
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
          <GridItem bg={{ base: "background.main", md: "gray.900" }} area="nav">
            <Navbar isExpand={isExpand} setIsExpand={setIsExpand} />
          </GridItem>
        </>
      )}
      <GridItem area="main" overflowX="hidden" id="content">
        <div style={{ minHeight: `calc(100vh - 129px)` }}>{children}</div>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
