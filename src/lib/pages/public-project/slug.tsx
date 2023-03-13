import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { scrollToTop } from "lib/utils";

import { DetailHeader } from "./components/DetailHeader";
import { PublicProjectCodeTable } from "./components/table/code/PublicProjectCodeTable";
import { PublicProjectContractTable } from "./components/table/contract/PublicProjectContractTable";
import { usePublicData } from "./data";

enum TabIndex {
  Overview,
  Codes,
  Contracts,
}

export const ProjectDetail = observer(() => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(TabIndex.Overview);
  const { publicCodes, publicContracts, projectDetail, slug, isLoading } =
    usePublicData();

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
        <TabList my={8} borderBottom="1px" borderColor="pebble.800">
          <CustomTab
            count={publicCodes.length + publicContracts.length}
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
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectCodeTable codes={publicCodes} />
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectContractTable contracts={publicContracts} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
});
