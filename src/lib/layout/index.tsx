import { Grid, GridItem } from "@chakra-ui/react";
import type { ReactNode } from "react";

import Header from "./Header";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Grid
      templateAreas={`"header header"
    "nav main"`}
      gridTemplateRows="70px 1fr"
      gridTemplateColumns="224px 1fr"
      h="100vh"
      overflowX="hidden"
      bg="background.main"
    >
      <GridItem bg="#212121" area="header">
        <Header />
      </GridItem>
      <GridItem bg="#212121" area="nav" mt="1">
        <Navbar />
      </GridItem>
      <GridItem area="main" overflowY="auto">
        {children}
      </GridItem>
    </Grid>
  );
};

export default Layout;
