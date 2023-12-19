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
import type { HexAddr, Nullish, Option } from "lib/types";

import { ModuleHistoryTable } from "./history";
import { ModuleRelatedProposalsTable } from "./ModuleRelatedProposalsTable";
import { ModuleTxsTable } from "./ModuleTxsTable";

export enum ModuleTablesTabIndex {
  Transactions = "transactions",
  PublishedEvents = "published-events",
  RelatedProposals = "related-proposals",
}

interface ModuleTablesProps {
  address: HexAddr;
  moduleName: string;
  moduleId: Nullish<number>;
  txsCount: Option<number>;
  historiesCount: Option<number>;
  relatedProposalsCount: Option<number>;
  refetchCount: () => void;
  tab: ModuleTablesTabIndex;
  setTab: (nextTab: ModuleTablesTabIndex) => void;
  onViewMore?: (nextTab: ModuleTablesTabIndex) => void;
}

export const ModuleTables = ({
  address,
  moduleName,
  moduleId,
  txsCount,
  historiesCount,
  relatedProposalsCount,
  refetchCount,
  tab,
  setTab,
  onViewMore,
}: ModuleTablesProps) => {
  const tableHeaderId = "moduleDetailsTableHeader";
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
      <Heading as="h6" variant="h6" mb={6} fontWeight={600} id={tableHeaderId}>
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
            count={txsCount}
            onClick={handleTabChange(ModuleTablesTabIndex.Transactions)}
            isDisabled={txsCount === 0}
          >
            Transactions
          </CustomTab>
          <CustomTab
            count={historiesCount}
            onClick={handleTabChange(ModuleTablesTabIndex.PublishedEvents)}
            isDisabled={historiesCount === 0}
          >
            Published Events
          </CustomTab>
          <CustomTab
            count={relatedProposalsCount}
            onClick={handleTabChange(ModuleTablesTabIndex.RelatedProposals)}
            isDisabled={relatedProposalsCount === 0}
            hidden={!gov.enabled}
          >
            Related Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <ModuleTxsTable
              address={address}
              moduleName={moduleName}
              txCount={txsCount}
              refetchCount={refetchCount}
              scrollComponentId={tableHeaderId}
              onViewMore={handleOnViewMore(ModuleTablesTabIndex.Transactions)}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleHistoryTable
              moduleId={moduleId}
              historyCount={historiesCount}
              refetchCount={refetchCount}
              scrollComponentId={tableHeaderId}
              onViewMore={handleOnViewMore(
                ModuleTablesTabIndex.PublishedEvents
              )}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleRelatedProposalsTable
              moduleId={moduleId}
              relatedProposalsCount={relatedProposalsCount}
              refetchCount={refetchCount}
              scrollComponentId={tableHeaderId}
              onViewMore={handleOnViewMore(
                ModuleTablesTabIndex.PublishedEvents
              )}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
