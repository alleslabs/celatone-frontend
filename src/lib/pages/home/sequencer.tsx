import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { RecentBlocksTableSequencer } from "../blocks/components/RecentBlocksTableSequencer";
import { TxsTableSequencer } from "../txs/components/TxsTableSequencer";
import {
  useCelatoneApp,
  useInternalNavigate,
  useMobile,
} from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import PageContainer from "lib/components/PageContainer";
import { ViewMore } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import {
  useBlockTimeAverageSequencer,
  useLatestBlockLcd,
} from "lib/services/block";
import { useOverviewsStats } from "lib/services/stats";

import { DevShortcut } from "./components";
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

export const HomeSequencer = () => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const {
    chainConfig: { prettyName },
    theme,
  } = useCelatoneApp();

  const { data: overviewsStats, isLoading: isOverviewsStatesLoading } =
    useOverviewsStats();
  const { data: latestBlock, isLoading: isLatestBlockLoading } =
    useLatestBlockLcd();
  const { data: blockTimeAverage, isLoading: isBlockTimeAverageLoading } =
    useBlockTimeAverageSequencer();

  const toTxs = () =>
    navigate({
      pathname: "/txs",
    });

  const toBlocks = () =>
    navigate({
      pathname: "/blocks",
    });

  return (
    <PageContainer>
      <Flex
        direction="column"
        mb={12}
        position="relative"
        overflow="hidden"
        sx={{ "& > div": { zIndex: 1 } }}
      >
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
          <UserDocsLink isButton href="introduction/overview" />
        </Flex>
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <CardInfo
            title={txInfo.title}
            tooltip={txInfo.tooltip}
            value={overviewsStats?.txCount?.toString()}
            isLoading={isOverviewsStatesLoading}
            navigate={toTxs}
          />
          <CardInfo
            title={blockInfo.title}
            tooltip={blockInfo.tooltip}
            value={latestBlock?.toString()}
            isLoading={isLatestBlockLoading}
            navigate={toBlocks}
          />
          <CardInfo
            title={blockTimeInfo.title}
            tooltip={blockTimeInfo.tooltip}
            value={blockTimeAverage?.avgBlockTime?.toFixed(3).concat("s")}
            isLoading={isBlockTimeAverageLoading}
            navigate={toTxs}
          />
        </Flex>
      </Flex>
      {!isMobile && (
        <Box as="section" mb="48px">
          <Flex gap={4} direction="column">
            <Heading as="h5" variant="h5">
              Dev Shortcuts
            </Heading>
            <ConnectWalletAlert
              title={`Connect wallet to start using ${theme.branding.seo.appName}`}
              subtitle="Specific use cases such as deploying new contract or sending execute messages require a wallet connection."
            />
            <DevShortcut />
          </Flex>
        </Box>
      )}
      <Box as="section" mb="48px">
        <Heading as="h5" variant="h5" mb={5}>
          Recent Transactions
        </Heading>
        <TxsTableSequencer isViewMore />
        {!!overviewsStats?.txCount && overviewsStats.txCount > 5 && (
          <ViewMore onClick={toTxs} />
        )}
      </Box>
      <Box as="section">
        <Heading as="h5" variant="h5" mb={5}>
          Recent Blocks
        </Heading>
        <RecentBlocksTableSequencer isViewMore />
        {!!overviewsStats?.latestBlock && overviewsStats.latestBlock > 5 && (
          <ViewMore onClick={toBlocks} />
        )}
      </Box>
    </PageContainer>
  );
};
