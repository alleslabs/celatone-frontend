import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [tabIndex, setTabIndex] = useState(TabIndex.Overview);
  const {
    publicCodes,
    publicContracts,
    publicAccounts,
    projectDetail,
    slug,
    isLoading,
  } = usePublicData();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROJECT_DETAIL);
  }, [router.isReady]);

  const handleOnViewMore = (tab: TabIndex) => {
    setTabIndex(tab);
    scrollToTop();
  };

  if (isLoading) return <Loading />;
  return (
    <PageContainer>
      <DetailHeader details={projectDetail} slug={slug} />
      <Tabs index={tabIndex}>
        <TabList my={6} borderBottom="1px" borderColor="gray.800">
          <CustomTab
            count={
              publicCodes.length +
              publicContracts.length +
              publicAccounts.length
            }
            onClick={() => setTabIndex(TabIndex.Overview)}
          >
            Overview
          </CustomTab>
          <CustomTab
            count={publicCodes.length}
            isDisabled={!publicCodes.length}
            onClick={() => setTabIndex(TabIndex.Codes)}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={publicContracts.length}
            isDisabled={!publicContracts.length}
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
            <PublicProjectCodeTable
              codes={publicCodes}
              onViewMore={() => handleOnViewMore(TabIndex.Codes)}
            />
            <PublicProjectContractTable
              contracts={publicContracts}
              onViewMore={() => handleOnViewMore(TabIndex.Contracts)}
            />
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
