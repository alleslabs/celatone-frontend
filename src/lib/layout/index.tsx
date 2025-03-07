import { Box, Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import pluginUtc from "dayjs/plugin/utc";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

import { useInitia, useMobile, useNavContext } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
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

  const defaultRow = "64px 48px 1fr";
  const mode = useMemo(() => {
    if (isMobile)
      return {
        templateAreas: `"header""main"`,
        templateRows: "60px 1fr",
        templateCols: "1fr",
        header: <MobileHeader />,
        subHeader: undefined,
      };

    return {
      templateAreas: `"header header""subheader subheader""nav main"`,
      templateRows: defaultRow,
      templateCols: isExpand ? "235px 1fr" : "48px 1fr",
      header: <Header />,
      subHeader: <SubHeader />,
    };
  }, [isExpand, isMobile]);

  useEffect(() => {
    if (!(router.query.tab === "resources")) {
      scrollToTop();
    }
  }, [router.asPath, router.query.tab]);

  const date = dayjs
    .utc(new Date("2025-03-18T03:00:00Z"))
    .local()
    .format("MMMM DD, YYYY, h:mm A (UTCZ)");

  return (
    <Box>
      {isInitia && (
        <Flex
          py={{
            base: 3,
            md: 2,
          }}
          px={3}
          bg="primary.darker"
          justifyContent="center"
          flexDirection={{ base: "column", md: "row" }}
          gap={{
            base: 2,
            md: 6,
          }}
          alignItems={{
            base: "flex-end",
            md: "center",
          }}
        >
          <Text variant="body2">
            Initia Wallet extension is being deprecated. Existing extension
            users must migrate before {date} to be eligible for future
            incentives.
          </Text>
          <Link
            href="https://migration.initia.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              rightIcon={<CustomIcon name="launch" boxSize={2.5} />}
            >
              Migrate Wallet
            </Button>
          </Link>
        </Flex>
      )}
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
