import {
  Heading,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

import { TxsTabIndex } from "../types";
import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { TransactionsTable, ViewMore } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useTxsByAddressSequencer } from "lib/services/tx";
import type { BechAddr20 } from "lib/types";

interface EvmContractDetailsTxsProps {
  address: BechAddr20;
  onViewMore?: () => void;
}

export const EvmContractDetailsTxs = ({
  address,
  onViewMore,
}: EvmContractDetailsTxsProps) => {
  const [tab, setTab] = useState<TxsTabIndex>(TxsTabIndex.Cosmos);

  const {
    data: txsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isTxsLoading,
    isFetchingNextPage,
  } = useTxsByAddressSequencer(address, undefined);

  const handleTabChange = useCallback(
    (nextTab: TxsTabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      setTab(nextTab);
    },
    [tab, setTab]
  );

  return (
    <Stack gap={6}>
      <Heading as="h6" variant="h6">
        Transactions
      </Heading>
      <Tabs index={Object.values(TxsTabIndex).indexOf(tab)}>
        <TabList>
          <CustomTab onClick={handleTabChange(TxsTabIndex.Cosmos)}>
            Cosmos
          </CustomTab>
          <CustomTab onClick={handleTabChange(TxsTabIndex.Evm)}>EVM</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={6}>
            <TransactionsTable
              transactions={txsData}
              isLoading={isTxsLoading}
              emptyState={
                <EmptyState
                  withBorder
                  imageVariant="empty"
                  message="There are no transactions on this contract."
                />
              }
              showRelations={false}
            />
            {!onViewMore && (
              <Text variant="body2" color="text.dark" mt={2}>
                {txsData?.length ?? 0} Cosmos transactions found
              </Text>
            )}
            {hasNextPage && (
              <>
                {onViewMore ? (
                  <ViewMore
                    onClick={() => {
                      onViewMore();
                      handleTabChange(TxsTabIndex.Cosmos);
                    }}
                  />
                ) : (
                  <LoadNext
                    text="Load more 10 transactions"
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                  />
                )}
              </>
            )}
          </TabPanel>
          <TabPanel p={0} pt={6}>
            EVM
          </TabPanel>
        </TabPanels>
      </Tabs>
      <UserDocsLink
        mt={0}
        title="What is transactions related to the contract?"
        cta="Read more about Transactions"
        href="cosmwasm/contracts/detail-page#transactions-and-histories"
      />
    </Stack>
  );
};
