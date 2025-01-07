import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import type { HexAddr, Option } from "lib/types";

import { ModuleHistoryTable } from "./history";
import { ModuleRelatedProposalsTable } from "./ModuleRelatedProposalsTable";
import { ModuleTxsTable } from "./ModuleTxsTable";

export enum ModuleTablesTabIndex {
  PublishedEvents = "published-events",
  RelatedProposals = "related-proposals",
  Transactions = "transactions",
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
    <Flex mt={6} flexDirection="column">
      <Heading id={tableHeaderId} as="h6" mb={6} variant="h6" fontWeight={600}>
        Transactions & Histories
      </Heading>
      <Tabs
        index={Object.values(ModuleTablesTabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX={{ base: "scroll", md: "auto" }}
        >
          <CustomTab
            isDisabled={txsCount === 0}
            count={txsCount}
            onClick={handleTabChange(ModuleTablesTabIndex.Transactions)}
          >
            Transactions
          </CustomTab>
          <CustomTab
            isDisabled={historiesCount === 0}
            count={historiesCount}
            onClick={handleTabChange(ModuleTablesTabIndex.PublishedEvents)}
          >
            Published Events
          </CustomTab>
          <CustomTab
            hidden={!gov.enabled}
            isDisabled={relatedProposalsCount === 0}
            count={relatedProposalsCount}
            onClick={handleTabChange(ModuleTablesTabIndex.RelatedProposals)}
          >
            Related Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <ModuleTxsTable
              vmAddress={vmAddress}
              moduleName={moduleName}
              onViewMore={handleOnViewMore(ModuleTablesTabIndex.Transactions)}
              scrollComponentId={tableHeaderId}
              txCount={txsCount}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleHistoryTable
              vmAddress={vmAddress}
              historyCount={historiesCount}
              moduleName={moduleName}
              onViewMore={handleOnViewMore(
                ModuleTablesTabIndex.PublishedEvents
              )}
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleRelatedProposalsTable
              vmAddress={vmAddress}
              moduleName={moduleName}
              onViewMore={handleOnViewMore(
                ModuleTablesTabIndex.RelatedProposals
              )}
              relatedProposalsCount={relatedProposalsCount}
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
