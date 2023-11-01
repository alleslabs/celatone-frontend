import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import {
  usePublicProjectConfig,
  useWasmConfig,
  useInternalNavigate,
  useMoveConfig,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { getFirstQueryParam } from "lib/utils";

import { DetailHeader } from "./components/DetailHeader";
import {
  PublicProjectAccountTable,
  PublicProjectCodeTable,
  PublicProjectContractTable,
  PublicProjectModuleTable,
} from "./components/tables";
import { usePublicData } from "./data";

enum TabIndex {
  Overview = "overview",
  Codes = "codes",
  Contracts = "contracts",
  Accounts = "accounts",
  Modules = "modules",
}

const ProjectDetail = () => {
  const { track } = useTrack();
  const router = useRouter();
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const navigate = useInternalNavigate();
  // TODO: remove assertion later
  const tab = getFirstQueryParam(router.query.tab) as TabIndex;
  const {
    publicCodes,
    publicContracts,
    publicAccounts,
    publicModules,
    projectDetail,
    slug,
    isLoading,
  } = usePublicData();

  const handleTabChange = (nextTab: TabIndex) => () => {
    if (nextTab === tab) return;
    navigate({
      pathname: "/projects/[slug]/[tab]",
      query: {
        slug,
        tab: nextTab,
      },
      options: {
        shallow: true,
      },
    });
  };

  usePublicProjectConfig({ shouldRedirect: true });

  useEffect(() => {
    if (router.isReady) {
      if (tab) track(AmpEvent.TO_PROJECT_DETAIL, { tab });

      if (!tab || !Object.values(TabIndex).includes(tab)) {
        navigate({
          replace: true,
          pathname: "/projects/[slug]/[tab]",
          query: {
            slug,
            tab: TabIndex.Overview,
          },
          options: {
            shallow: true,
          },
        });
      }
    }
  }, [router.isReady, tab, slug, navigate, track]);

  const overviewCount =
    publicAccounts.length +
    (wasm.enabled ? publicCodes.length + publicContracts.length : 0) +
    (move.enabled ? publicModules.length : 0);

  if (isLoading) return <Loading withBorder />;
  return (
    <PageContainer>
      <DetailHeader details={projectDetail} slug={slug} />
      <Tabs
        index={Object.values(TabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          my={6}
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX="scroll"
        >
          <CustomTab
            count={overviewCount}
            onClick={handleTabChange(TabIndex.Overview)}
          >
            Overview
          </CustomTab>
          <CustomTab
            count={publicCodes.length}
            isDisabled={!publicCodes.length}
            onClick={handleTabChange(TabIndex.Codes)}
            hidden={!wasm.enabled}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={publicContracts.length}
            isDisabled={!publicContracts.length}
            onClick={handleTabChange(TabIndex.Contracts)}
            hidden={!wasm.enabled}
          >
            Contracts
          </CustomTab>
          <CustomTab
            count={publicAccounts.length}
            isDisabled={!publicAccounts.length}
            onClick={handleTabChange(TabIndex.Accounts)}
          >
            Accounts
          </CustomTab>
          {move.enabled && (
            <CustomTab
              count={publicModules.length}
              isDisabled={!publicModules.length}
              onClick={handleTabChange(TabIndex.Modules)}
            >
              Modules
            </CustomTab>
          )}
        </TabList>
        <TabPanels my={8}>
          <TabPanel p={0}>
            {wasm.enabled && (
              <>
                <PublicProjectCodeTable
                  codes={publicCodes}
                  onViewMore={handleTabChange(TabIndex.Codes)}
                />
                <PublicProjectContractTable
                  contracts={publicContracts}
                  onViewMore={handleTabChange(TabIndex.Contracts)}
                />
              </>
            )}
            <PublicProjectAccountTable
              accounts={publicAccounts}
              onViewMore={handleTabChange(TabIndex.Accounts)}
            />
            {move.enabled && (
              <PublicProjectModuleTable
                modules={publicModules}
                onViewMore={handleTabChange(TabIndex.Modules)}
              />
            )}
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectCodeTable codes={publicCodes} />
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectContractTable contracts={publicContracts} />
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectAccountTable accounts={publicAccounts} />
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectModuleTable modules={publicModules} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};

export default ProjectDetail;
