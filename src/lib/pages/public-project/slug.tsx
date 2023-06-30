import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { usePublicProjectConfig, useWasmConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { scrollToTop } from "lib/utils";

import { DetailHeader } from "./components/DetailHeader";
import { PublicProjectAccountTable } from "./components/table/account/PublicProjectAccountTable";
import { PublicProjectCodeTable } from "./components/table/code/PublicProjectCodeTable";
import { PublicProjectContractTable } from "./components/table/contract/PublicProjectContractTable";
import { usePublicData } from "./data";

enum TabIndex {
  Overview,
  Codes,
  Contracts,
  Accounts,
}

export const ProjectDetail = () => {
  const router = useRouter();
  const wasm = useWasmConfig({ shouldRedirect: false });
  const [tabIndex, setTabIndex] = useState(TabIndex.Overview);
  const {
    publicCodes,
    publicContracts,
    publicAccounts,
    projectDetail,
    slug,
    isLoading,
  } = usePublicData();

  usePublicProjectConfig({ shouldRedirect: true });
  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROJECT_DETAIL);
  }, [router.isReady]);

  const handleOnViewMore = (tab: TabIndex) => {
    setTabIndex(tab);
    scrollToTop();
  };

  const overviewCount =
    publicAccounts.length +
    (wasm.enabled ? publicCodes.length + publicContracts.length : 0);

  if (isLoading) return <Loading />;
  return (
    <PageContainer>
      <DetailHeader details={projectDetail} slug={slug} />
      <Tabs index={tabIndex} isLazy lazyBehavior="keepMounted">
        <TabList my={6} borderBottom="1px" borderColor="gray.800">
          <CustomTab
            count={overviewCount}
            onClick={() => setTabIndex(TabIndex.Overview)}
          >
            Overview
          </CustomTab>
          <CustomTab
            count={publicCodes.length}
            isDisabled={!publicCodes.length}
            hidden={!wasm.enabled}
            onClick={() => setTabIndex(TabIndex.Codes)}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={publicContracts.length}
            isDisabled={!publicContracts.length}
            hidden={!wasm.enabled}
            onClick={() => setTabIndex(TabIndex.Contracts)}
          >
            Contracts
          </CustomTab>
          <CustomTab
            count={publicAccounts.length}
            isDisabled={!publicAccounts.length}
            onClick={() => setTabIndex(TabIndex.Accounts)}
          >
            Accounts
          </CustomTab>
        </TabList>

        <TabPanels my={8}>
          <TabPanel p={0}>
            {wasm.enabled && (
              <>
                <PublicProjectCodeTable
                  codes={publicCodes}
                  onViewMore={() => handleOnViewMore(TabIndex.Codes)}
                />
                <PublicProjectContractTable
                  contracts={publicContracts}
                  onViewMore={() => handleOnViewMore(TabIndex.Contracts)}
                />
              </>
            )}
            <PublicProjectAccountTable
              accounts={publicAccounts}
              onViewMore={() => handleOnViewMore(TabIndex.Accounts)}
            />
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
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};
