import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { isNull } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { useInternalNavigate, useTierConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import {
  useModuleByAddressLcd,
  useModulePublishInfo,
  useModuleTableCounts,
} from "lib/services/move/module";
import { useMoveVerifyInfo } from "lib/services/verification/move";
import { truncate } from "lib/utils";

import {
  ModuleActions,
  ModuleFunctions,
  ModuleInfo,
  ModuleStructs,
  ModuleTables,
  ModuleTablesTabIndex,
  ModuleTop,
} from "./components";
import type { ModuleDetailsQueryParams } from "./types";
import {
  FunctionTypeTabIndex,
  TabIndex,
  zModuleDetailsQueryParams,
} from "./types";

const mainTabHeaderId = "main-table-header";

const InvalidModule = () => <InvalidState title="Module does not exist" />;

const ModuleDetailsBody = ({
  address,
  moduleName,
  tab,
  type,
}: ModuleDetailsQueryParams) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const formatAddresses = useFormatAddresses();
  const { hex: vmAddress } = formatAddresses(address);

  const { isFullTier } = useTierConfig();
  const currentTab =
    !isFullTier && tab === TabIndex.TxsHistories ? TabIndex.Overview : tab;

  const { data, isLoading: isModuleLoading } = useModuleByAddressLcd({
    address: vmAddress,
    moduleName,
  });
  const { data: modulePublishInfo, isFetching: isPublishInfoLoading } =
    useModulePublishInfo(vmAddress, moduleName, isFullTier);

  const { data: moduleTableCounts } = useModuleTableCounts(
    vmAddress,
    moduleName,
    isFullTier
  );
  const { data: verificationData, isLoading: verificationLoading } =
    useMoveVerifyInfo(vmAddress, moduleName);

  const [overviewTabIndex, setOverviewTabIndex] = useState(
    ModuleTablesTabIndex.Transactions
  );
  const [tableTabIndex, setTableTabIndex] = useState(
    ModuleTablesTabIndex.Transactions
  );

  const handleTabChange = useCallback(
    (nextTab: TabIndex, fnType?: FunctionTypeTabIndex) => () => {
      if (nextTab === currentTab) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/modules/[address]/[moduleName]/[tab]",
        query: {
          address: vmAddress,
          moduleName,
          tab: nextTab,
          ...(fnType && { type: fnType }),
        },
        options: {
          shallow: true,
        },
      });
    },
    [vmAddress, moduleName, navigate, currentTab]
  );

  useEffect(() => {
    if (router.isReady && !verificationLoading)
      track(AmpEvent.TO_MODULE_DETAILS, {
        currentTab,
        isVerified: Boolean(verificationData),
      });
  }, [router.isReady, currentTab, verificationLoading, verificationData]);

  useEffect(() => {
    if (moduleTableCounts?.txs === 0) {
      setOverviewTabIndex(ModuleTablesTabIndex.PublishedEvents);
      setTableTabIndex(ModuleTablesTabIndex.PublishedEvents);
    }
  }, [moduleTableCounts?.txs]);

  const tabIndex = isFullTier
    ? Object.values(TabIndex)
    : Object.values(TabIndex).filter((t) => t !== TabIndex.TxsHistories);

  if (isModuleLoading || isPublishInfoLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="module information" />;

  return (
    <>
      <CelatoneSeo
        pageName={
          data.moduleName
            ? `${truncate(data.address)}::${data.moduleName} (Module)`
            : "Module Detail"
        }
      />
      <ModuleTop moduleData={data} isVerified={Boolean(verificationData)} />
      <Tabs
        index={tabIndex.indexOf(currentTab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          my={8}
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX="scroll"
          id={mainTabHeaderId}
        >
          <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
            Overview
          </CustomTab>
          <CustomTab
            count={data.parsedAbi.exposed_functions.length}
            onClick={handleTabChange(
              TabIndex.Function,
              FunctionTypeTabIndex.ALL
            )}
            isDisabled={!data.parsedAbi.exposed_functions.length}
          >
            Functions
          </CustomTab>
          {isFullTier && (
            <CustomTab onClick={handleTabChange(TabIndex.TxsHistories)}>
              Transactions & Histories
            </CustomTab>
          )}
          <CustomTab
            count={data.parsedAbi.structs.length}
            onClick={handleTabChange(TabIndex.Structs)}
            isDisabled={!data.parsedAbi.structs.length}
          >
            Structs
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Flex gap={6} flexDirection="column">
              <ModuleActions
                viewFns={data.viewFunctions.length}
                executeFns={data.executeFunctions.length}
                allTxsCount={
                  moduleTableCounts &&
                  !isNull(moduleTableCounts.txs) &&
                  !isNull(moduleTableCounts.histories)
                    ? moduleTableCounts.txs + moduleTableCounts.histories
                    : undefined
                }
                onSelectAction={(
                  nextTab: TabIndex,
                  fnType?: FunctionTypeTabIndex
                ) => {
                  track(AmpEvent.USE_NAVIGATING_BUTTON, {
                    label: fnType ?? "History",
                  });
                  handleTabChange(nextTab, fnType)();
                }}
              />
              <ModuleInfo
                indexedModule={data}
                modulePublishInfo={modulePublishInfo}
                verificationData={verificationData}
              />
              {isFullTier && (
                <ModuleTables
                  vmAddress={data.address}
                  moduleName={data.moduleName}
                  txsCount={moduleTableCounts?.txs ?? undefined}
                  historiesCount={moduleTableCounts?.histories ?? undefined}
                  relatedProposalsCount={
                    moduleTableCounts?.proposals ?? undefined
                  }
                  tab={overviewTabIndex}
                  setTab={setOverviewTabIndex}
                  onViewMore={(nextTab: ModuleTablesTabIndex) => {
                    handleTabChange(TabIndex.TxsHistories)();
                    setTableTabIndex(nextTab);
                  }}
                />
              )}
            </Flex>
            <UserDocsLink
              title="What is a move module?"
              cta="Read more about Module"
              href="move/modules/detail-page"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleFunctions
              address={data.address}
              moduleName={data.moduleName}
              fns={data.parsedAbi.exposed_functions}
              viewFns={data.viewFunctions}
              executeFns={data.executeFunctions}
              typeTab={type}
            />
            <UserDocsLink
              title="What is Module functions?"
              cta="Read more about View and Execute Functions"
              href="move/modules/detail-page#functions"
            />
          </TabPanel>
          {isFullTier && (
            <TabPanel p={0}>
              <ModuleTables
                vmAddress={data.address}
                moduleName={data.moduleName}
                txsCount={moduleTableCounts?.txs ?? undefined}
                historiesCount={moduleTableCounts?.histories ?? undefined}
                relatedProposalsCount={
                  moduleTableCounts?.proposals ?? undefined
                }
                tab={tableTabIndex}
                setTab={setTableTabIndex}
              />
              <UserDocsLink
                title="What is Module Transaction?"
                cta="Read more about transaction in module"
                href="move/modules/detail-page#transactions-histories"
              />
            </TabPanel>
          )}
          <TabPanel p={0}>
            <ModuleStructs structs={data.parsedAbi.structs} />
            <UserDocsLink
              title="What is Module Struct?"
              cta="Read more about struct in module"
              href="move/modules/detail-page#structs"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export const ModuleDetails = () => {
  const router = useRouter();
  const validated = zModuleDetailsQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {!validated.success ? (
        <InvalidModule />
      ) : (
        <ModuleDetailsBody {...validated.data} />
      )}
    </PageContainer>
  );
};
