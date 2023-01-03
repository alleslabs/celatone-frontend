import { Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { scrollTop } from "lib/utils/scrollTop";

import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  useEffect(() => {
    scrollTop();
  }, [router.asPath]);
  return (
    <Grid
      templateAreas={`"header header"
    "nav main" `}
      gridTemplateRows="70px 1fr"
      gridTemplateColumns="224px 1fr"
      h="100vh"
      overflowX="hidden"
      bg="background.main"
    >
      <GridItem bg="#212121" area="header" mb="1">
        <Header />
      </GridItem>
      <GridItem bg="#212121" area="nav">
        <Navbar />
      </GridItem>
      <GridItem area="main" overflowY="auto" id="content">
        <div style={{ minHeight: `calc(100vh - 230px)` }}>{children}</div>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
