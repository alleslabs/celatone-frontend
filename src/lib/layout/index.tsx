import { Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import { scrollToTop } from "lib/utils";

import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./navbar";
import SubHeader from "./SubHeader";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const [isExpand, setIsExpand] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, [router.asPath]);

  return (
    <Grid
      templateAreas={`"header header""subheader subheader""nav main"`}
      gridTemplateRows="70px 48px 1fr"
      gridTemplateColumns={isExpand ? "224px 1fr" : "48px 1fr"}
      h="100vh"
      overflowX="hidden"
      bg="background.main"
    >
      <GridItem bg="gray.900" area="header" mb={1}>
        <Header />
      </GridItem>
      <GridItem bg="gray.900" area="subheader" mb="1">
        <SubHeader />
      </GridItem>
      <GridItem bg="gray.900" area="nav" overflowY="auto">
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
