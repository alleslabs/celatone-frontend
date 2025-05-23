import type { HexAddr, Option } from "lib/types";

import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { useCallback } from "react";

import { ModuleHistoryTable } from "./history";
import { ModuleRelatedProposalsTable } from "./ModuleRelatedProposalsTable";
import { ModuleTxsTable } from "./ModuleTxsTable";

export enum ModuleTablesTabIndex {
  Transactions = "transactions",
  PublishedEvents = "published-events",
  RelatedProposals = "related-proposals",
}

interface ModuleTablesProps {
  historiesCount: Option<number>;
  moduleName: string;
  onViewMore?: (nextTab: ModuleTablesTabIndex) => void;
  relatedProposalsCount: Option<number>;
  setTab: (nextTab: ModuleTablesTabIndex) => void;
  tab: ModuleTablesTabIndex;
  txsCount: Option<number>;
  vmAddress: HexAddr;
}

const tableHeaderId = "moduleDetailsTableHeader";

export const ModuleTables = ({
  historiesCount,
  moduleName,
  onViewMore,
  relatedProposalsCount,
  setTab,
  tab,
  txsCount,
  vmAddress,
}: ModuleTablesProps) => {
  const gov = useGovConfig({ shouldRedirect: false });

  const handleOnViewMore = useCallback(
    (nextTab: ModuleTablesTabIndex) =>
      onViewMore
        ? () => {
            track(AmpEvent.USE_VIEW_MORE, {
              table: nextTab,
            });
            onViewMore(nextTab);
          }
        : undefined,
    [onViewMore]
  );
  const handleTabChange = useCallback(
    (nextTab: ModuleTablesTabIndex) => () => {
      if (nextTab === tab) return;
      track(AmpEvent.USE_SUBTAB, {
        isOverview: !!onViewMore,
        subtab: nextTab,
      });
      setTab(nextTab);
    },
    [onViewMore, setTab, tab]
  );

  return (
    <Flex flexDirection="column" mt={6}>
      <Heading id={tableHeaderId} as="h6" fontWeight={600} mb={6} variant="h6">
        Transactions & Histories
      </Heading>
      <Tabs
        index={Object.values(ModuleTablesTabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          borderBottomWidth="1px"
          borderColor="gray.700"
          overflowX={{ base: "scroll", md: "auto" }}
        >
          <CustomTab
            count={txsCount}
            isDisabled={txsCount === 0}
            onClick={handleTabChange(ModuleTablesTabIndex.Transactions)}
          >
            Transactions
          </CustomTab>
          <CustomTab
            count={historiesCount}
            isDisabled={historiesCount === 0}
            onClick={handleTabChange(ModuleTablesTabIndex.PublishedEvents)}
          >
            Published Events
          </CustomTab>
          <CustomTab
            count={relatedProposalsCount}
            hidden={!gov.enabled}
            isDisabled={relatedProposalsCount === 0}
            onClick={handleTabChange(ModuleTablesTabIndex.RelatedProposals)}
          >
            Related Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <ModuleTxsTable
              moduleName={moduleName}
              scrollComponentId={tableHeaderId}
              txCount={txsCount}
              vmAddress={vmAddress}
              onViewMore={handleOnViewMore(ModuleTablesTabIndex.Transactions)}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleHistoryTable
              historyCount={historiesCount}
              moduleName={moduleName}
              scrollComponentId={tableHeaderId}
              vmAddress={vmAddress}
              onViewMore={handleOnViewMore(
                ModuleTablesTabIndex.PublishedEvents
              )}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleRelatedProposalsTable
              moduleName={moduleName}
              relatedProposalsCount={relatedProposalsCount}
              scrollComponentId={tableHeaderId}
              vmAddress={vmAddress}
              onViewMore={handleOnViewMore(
                ModuleTablesTabIndex.RelatedProposals
              )}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
