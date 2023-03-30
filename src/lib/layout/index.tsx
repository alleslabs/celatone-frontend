import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { scrollToTop } from "lib/utils";

import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./navbar";
import { NewReleases } from "./NewReleases";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isMobile = useMobile();

  const [isExpand, setIsExpand] = useState(!isMobile);
  const [closeRelease, setCloseRelease] = useState(false);
  useEffect(() => {
    scrollToTop();
  }, [router.asPath]);
  return (
    <Grid
      templateAreas={
        closeRelease
          ? `"header header"
      "nav main"`
          : `"announcement announcement" "header header"
      "nav main"`
      }
      gridTemplateRows={closeRelease ? "70px 1fr" : "40px 70px 1fr"}
      gridTemplateColumns={isExpand ? "224px 1fr" : "48px 1fr"}
      h="100vh"
      overflowX="hidden"
      bg="background.main"
    >
      {!closeRelease && (
        <GridItem bg="violet.darker" area="announcement" position="relative">
          <NewReleases />
          <Flex
            onClick={() => setCloseRelease(!closeRelease)}
            position="absolute"
            top="2"
            right="3"
            cursor="pointer"
          >
            <CustomIcon
              name="close"
              color="text.main"
              _hover={{ color: "text.dark" }}
              transition="all .25s ease-in-out"
            />
          </Flex>
        </GridItem>
      )}
      <GridItem bg="pebble.900" area="header" mb="1">
        <Header />
      </GridItem>
      <GridItem bg="pebble.900" area="nav" overflowY="auto">
        <Navbar isExpand={isExpand} setIsExpand={setIsExpand} />
      </GridItem>
      <GridItem area="main" overflowY="auto" id="content">
        <div style={{ minHeight: `calc(100vh - 129px)` }}>{children}</div>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
