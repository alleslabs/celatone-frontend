import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { trackUseTab } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { getFirstQueryParam } from "lib/utils";

import { PerformanceSection } from "./components/PerformanceSection";
import { ValidatorOverview } from "./components/validator-overview/ValidatorOverviewSection";
import { ValidatorTop } from "./components/ValidatorTop";
import { TabIndex } from "./types";

const tableHeaderId = "validatorDetailsTab";

// TODO: get validator addr
const mockUpValidatorAddress =
  "osmovaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep88n0y4";

const ValidatorDetails = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const tab = getFirstQueryParam(router.query.tab) as TabIndex;
  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/validators/[validatorAddress]/[tab]",
        query: {
          validatorAddress: mockUpValidatorAddress,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [navigate, tab]
  );

  useEffect(() => {
    if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
      navigate({
        replace: true,
        pathname: "/validators/[validatorAddress]/[tab]",
        query: {
          validatorAddress: mockUpValidatorAddress,
          tab: TabIndex.Overview,
        },
        options: {
          shallow: true,
        },
      });
    }
  }, [router.isReady, tab, navigate]);

  return (
    <>
      <ValidatorTop />
      <PageContainer>
        <Tabs
          index={Object.values(TabIndex).indexOf(tab)}
          isLazy
          lazyBehavior="keepMounted"
        >
          <TabList
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX="scroll"
            id={tableHeaderId}
          >
            <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
              Overview
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Votes)}>
              Votes
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Performance)}>
              Performance
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.BondedTokenChanges)}>
              Bonded Token Changes
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              <ValidatorOverview
                onSelectVotes={handleTabChange(TabIndex.Votes)}
                onSelectPerformance={handleTabChange(TabIndex.Performance)}
                onSelectBondedTokenChanges={handleTabChange(
                  TabIndex.BondedTokenChanges
                )}
              />
            </TabPanel>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              Votes
            </TabPanel>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              <PerformanceSection />
            </TabPanel>

            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              Bonded Token Changes
            </TabPanel>
          </TabPanels>
        </Tabs>
      </PageContainer>
    </>
  );
};

export default ValidatorDetails;
