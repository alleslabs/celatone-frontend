import { Box, Heading } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { ViewMore } from "lib/components/table";
import { RecentBlocksTableFull } from "lib/pages/blocks/components/RecentBlocksTableFull";
import { TxsTableFull } from "lib/pages/txs/components/TxsTableFull";
import { useOverviewsStats } from "lib/services/stats";

import { HomeTop } from "./components";

export const HomeFull = () => {
  const navigate = useInternalNavigate();

  const { data: overviewsStats, isLoading } = useOverviewsStats();

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
      <HomeTop
        totalTxs={overviewsStats?.txCount}
        isTotalTxsLoading={isLoading}
        latestBlock={overviewsStats?.latestBlock}
        isLatestBlockLoading={isLoading}
        blockTime={overviewsStats?.blockTime}
        isBlockTimeLoading={isLoading}
        toTxs={toTxs}
        toBlocks={toBlocks}
      />
      <Box as="section" mb="48px">
        <Heading as="h5" variant="h5" mb={5}>
          Recent Transactions
        </Heading>
        <TxsTableFull isViewMore />
        {overviewsStats?.txCount && overviewsStats.txCount > 5 && (
          <ViewMore onClick={toTxs} />
        )}
      </Box>
      <Box as="section">
        <Heading as="h5" variant="h5" mb={5}>
          Recent Blocks
        </Heading>
        <RecentBlocksTableFull isViewMore />
        {overviewsStats?.latestBlock && overviewsStats.latestBlock > 5 && (
          <ViewMore onClick={toBlocks} />
        )}
      </Box>
    </PageContainer>
  );
};
