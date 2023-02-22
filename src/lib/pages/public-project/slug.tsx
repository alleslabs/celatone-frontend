import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { DetailHeader } from "./components/DetailHeader";
import { PublicProjectCodeTable } from "./components/table/code/PublicProjectCodeTable";
import { PublicProjectContractTable } from "./components/table/contract/PublicProjectContractTable";
import { usePublicData } from "./data";

export const ProjectDetail = observer(() => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const { publicCodes, publicContracts, projectDetail, slug, isLoading } =
    usePublicData();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROJECT_DETAIL);
  }, [router.isReady]);

  if (isLoading) return <Loading />;
  return (
    <PageContainer>
      <DetailHeader details={projectDetail} slug={slug} />
      <Tabs index={tabIndex}>
        <TabList my={8} borderBottom="1px" borderColor="pebble.800">
          <CustomTab
            count={publicCodes.length + publicContracts.length}
            onClick={() => setTabIndex(0)}
          >
            Overview
          </CustomTab>
          <CustomTab
            onClick={() => setTabIndex(1)}
            isDisabled={!publicCodes.length}
            count={publicCodes.length}
          >
            Codes
          </CustomTab>
          <CustomTab
            onClick={() => setTabIndex(2)}
            isDisabled={!publicContracts.length}
            count={publicContracts.length}
          >
            Contracts
          </CustomTab>
        </TabList>

        <TabPanels my={8}>
          <TabPanel p={0}>
            <PublicProjectCodeTable
              codes={publicCodes.slice(0, 5)}
              onViewMore={
                publicCodes.length > 5 ? () => setTabIndex(1) : undefined
              }
            />
            <PublicProjectContractTable
              contracts={publicContracts.slice(0, 5)}
              onViewMore={
                publicContracts.length > 5 ? () => setTabIndex(2) : undefined
              }
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
