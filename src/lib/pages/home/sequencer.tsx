import { Box, Heading } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { ViewMore } from "lib/components/table";
import { RecentBlocksTableSequencer } from "lib/pages/blocks/components/RecentBlocksTableSequencer";
import { TxsTableSequencer } from "lib/pages/txs/components/TxsTableSequencer";
import {
  useBlockTimeAverageSequencer,
  useLatestBlockLcd,
} from "lib/services/block";
import { useTxsCountSequencer } from "lib/services/tx";

import { HomeTop } from "./components";

export const HomeSequencer = () => {
  const navigate = useInternalNavigate();

  const { data: txsCount, isLoading: isTxsCountLoading } =
    useTxsCountSequencer();
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
      <HomeTop
        totalTxs={txsCount}
        isTotalTxsLoading={isTxsCountLoading}
        latestBlock={latestBlock}
        isLatestBlockLoading={isLatestBlockLoading}
        blockTime={blockTimeAverage?.avgBlockTime}
        isBlockTimeLoading={isBlockTimeAverageLoading}
        toTxs={toTxs}
        toBlocks={toBlocks}
      />
      <Box as="section" mb="48px">
        <Heading as="h5" variant="h5" mb={5}>
          Recent Transactions
        </Heading>
        <TxsTableSequencer isViewMore />
        {!!txsCount && txsCount > 5 && <ViewMore onClick={toTxs} />}
      </Box>
      <Box as="section">
        <Heading as="h5" variant="h5" mb={5}>
          Recent Blocks
        </Heading>
        <RecentBlocksTableSequencer isViewMore />
        {!!latestBlock && latestBlock > 5 && <ViewMore onClick={toBlocks} />}
      </Box>
    </PageContainer>
  );
};
