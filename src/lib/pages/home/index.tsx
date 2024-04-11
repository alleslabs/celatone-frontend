import { Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { CURR_THEME } from "env";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useInternalNavigate,
  useMobile,
} from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import PageContainer from "lib/components/PageContainer";
import { ViewMore } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { RecentBlocksTable } from "lib/pages/blocks/components/RecentBlocksTable";
import { TxsTable } from "lib/pages/txs/components/TxsTable";
import { useOverviewsStats } from "lib/services/overviewService";

import { DevShortcut, TopDecorations } from "./components";
import { CardInfo } from "./components/CardInfo";

const txInfo = {
  title: "Total Transactions",
  tooltip:
    "Verified transactions track network activity and growth, indicating ecosystem health.",
};

const blockInfo = {
  title: "Latest Indexed Block Height",
  tooltip: "The latest block height indexed by the indexer.",
};

const blockTimeInfo = {
  title: "Block Time",
  tooltip: "Median time to finality of the last 100 indexed blocks.",
};

const Home = () => {
  const isMobile = useMobile();

  const router = useRouter();
  const navigate = useInternalNavigate();
  const {
    chainConfig: { prettyName },
  } = useCelatoneApp();
  const { data: overviewsStats, isLoading } = useOverviewsStats();

  const toTxs = () =>
    navigate({
      pathname: "/txs",
    });

  const toBlocks = () =>
    navigate({
      pathname: "/blocks",
    });

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_OVERVIEW);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Flex
        direction="column"
        p={{ base: 3, md: 12 }}
        mb={12}
        borderRadius="12px"
        border="0px 0px 4px 0px"
        borderColor="gray.800"
        boxShadow="0px 6px 1px 0px var(--chakra-colors-gray-800)"
        bgColor="gray.900"
        position="relative"
        overflow="hidden"
        sx={{ "& > div": { zIndex: 1 } }}
      >
        <TopDecorations />
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={5}
          zIndex={1}
        >
          <Heading as="h4" variant={{ base: "h5", md: "h4" }}>
            <Text as="span" color="accent.main">
              {prettyName}
            </Text>{" "}
            Overview
          </Heading>
          <UserDocsLink
            isButton
            isSmall
            href="introduction/user-introduction"
          />
        </Flex>
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <CardInfo
            title={txInfo.title}
            tooltip={txInfo.tooltip}
            value={overviewsStats?.txCount.toLocaleString()}
            isLoading={isLoading}
            navigate={toTxs}
          />
          <CardInfo
            title={blockInfo.title}
            tooltip={blockInfo.tooltip}
            value={overviewsStats?.latestBlock.toString()}
            isLoading={isLoading}
            navigate={toBlocks}
          />
          <CardInfo
            title={blockTimeInfo.title}
            tooltip={blockTimeInfo.tooltip}
            value={overviewsStats?.blockTime.toFixed(3).concat("s")}
            isLoading={isLoading}
            navigate={toTxs}
          />
        </Flex>
      </Flex>
      {!isMobile && (
        <section style={{ marginBottom: "48px" }}>
          <Flex gap={4} direction="column">
            <ConnectWalletAlert
              title={`Connect wallet to start using ${CURR_THEME.branding.seo.appName}`}
              subtitle="Specific use cases such as deploying new contract or sending execute messages require a wallet connection."
            />
            <DevShortcut />
          </Flex>
        </section>
      )}
      <section style={{ marginBottom: "48px" }}>
        <Heading as="h5" variant="h5" mb={5}>
          Recent Transactions
        </Heading>
        <TxsTable isViewMore />
        {overviewsStats?.txCount && overviewsStats.txCount > 5 && (
          <ViewMore onClick={toTxs} />
        )}
      </section>

      <section>
        <Heading as="h5" variant="h5" mb={5}>
          Recent Blocks
        </Heading>
        <RecentBlocksTable isViewMore />
        {overviewsStats?.latestBlock && overviewsStats.latestBlock > 5 && (
          <ViewMore onClick={toBlocks} />
        )}
      </section>
    </PageContainer>
  );
};

export default Home;
