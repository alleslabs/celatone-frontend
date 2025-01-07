/* eslint-disable complexity */
import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { isNull } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import {
  useInitiaL1,
  useInternalNavigate,
  useTierConfig,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import { MoveVerifySection } from "lib/components/move-verify-section";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { StatusMessageBox } from "lib/components/StatusMessageBox";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import {
  useModuleByAddressLcd,
  useModulePublishInfo,
  useModuleTableCounts,
} from "lib/services/move/module";
import { useMoveVerifyInfo } from "lib/services/verification/move";
import { resolveMoveVerifyStatus, truncate } from "lib/utils";

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
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });
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
        options: {
          shallow: true,
        },
        pathname: "/modules/[address]/[moduleName]/[tab]",
        query: {
          address: vmAddress,
          moduleName,
          tab: nextTab,
          ...(fnType && { type: fnType }),
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

  const moveVerifyStatus = useMemo(
    () => resolveMoveVerifyStatus(data?.digest, verificationData?.digest),
    [data?.digest, verificationData?.digest]
  );

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
      <ModuleTop moduleData={data} moveVerifyStatus={moveVerifyStatus} />
      <Tabs
        index={tabIndex.indexOf(currentTab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          id={mainTabHeaderId}
          my={8}
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX="scroll"
        >
          <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
            Overview
          </CustomTab>
          <CustomTab
            isDisabled={!data.parsedAbi.exposed_functions.length}
            count={data.parsedAbi.exposed_functions.length}
            onClick={handleTabChange(
              TabIndex.Function,
              FunctionTypeTabIndex.ALL
            )}
          >
            Functions
          </CustomTab>
          {isFullTier && (
            <CustomTab onClick={handleTabChange(TabIndex.TxsHistories)}>
              Transactions & Histories
            </CustomTab>
          )}
          <CustomTab
            isDisabled={!data.parsedAbi.structs.length}
            count={data.parsedAbi.structs.length}
            onClick={handleTabChange(TabIndex.Structs)}
          >
            Structs
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Flex gap={6} flexDirection="column">
              {isInitiaL1 && (
                <StatusMessageBox
                  borderColor="gray.100"
                  content={<MoveVerifySection status={moveVerifyStatus} />}
                />
              )}
              <ModuleActions
                executeFns={data.executeFunctions.length}
                viewFns={data.viewFunctions.length}
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
                moveVerifyStatus={moveVerifyStatus}
                verificationData={verificationData}
              />
              {isFullTier && (
                <ModuleTables
                  setTab={setOverviewTabIndex}
                  tab={overviewTabIndex}
                  vmAddress={data.address}
                  historiesCount={moduleTableCounts?.histories ?? undefined}
                  moduleName={data.moduleName}
                  onViewMore={(nextTab: ModuleTablesTabIndex) => {
                    handleTabChange(TabIndex.TxsHistories)();
                    setTableTabIndex(nextTab);
                  }}
                  relatedProposalsCount={
                    moduleTableCounts?.proposals ?? undefined
                  }
                  txsCount={moduleTableCounts?.txs ?? undefined}
                />
              )}
            </Flex>
            <UserDocsLink
              cta="Read more about Module"
              title="What is a move module?"
              href="move/modules/detail-page"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleFunctions
              address={data.address}
              executeFns={data.executeFunctions}
              fns={data.parsedAbi.exposed_functions}
              typeTab={type}
              viewFns={data.viewFunctions}
              moduleName={data.moduleName}
            />
            <UserDocsLink
              cta="Read more about View and Execute Functions"
              title="What is Module functions?"
              href="move/modules/detail-page#functions"
            />
          </TabPanel>
          {isFullTier && (
            <TabPanel p={0}>
              <ModuleTables
                setTab={setTableTabIndex}
                tab={tableTabIndex}
                vmAddress={data.address}
                historiesCount={moduleTableCounts?.histories ?? undefined}
                moduleName={data.moduleName}
                relatedProposalsCount={
                  moduleTableCounts?.proposals ?? undefined
                }
                txsCount={moduleTableCounts?.txs ?? undefined}
              />
              <UserDocsLink
                cta="Read more about transaction in module"
                title="What is Module Transaction?"
                href="move/modules/detail-page#transactions-histories"
              />
            </TabPanel>
          )}
          <TabPanel p={0}>
            <ModuleStructs structs={data.parsedAbi.structs} />
            <UserDocsLink
              cta="Read more about struct in module"
              title="What is Module Struct?"
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
