import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { useInternalNavigate, useMoveConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";

import {
  BondedTokenChanges,
  Performance,
  ValidatorOverview,
  ValidatorTop,
  VotedProposalsTable,
} from "./components";
import type { ValidatorDetailsQueryParams } from "./types";
import { TabIndex, zValidatorDetailsQueryParams } from "./types";

const InvalidValidator = () => (
  <InvalidState title="Validator does not exist" />
);

const ValidatorDetailsBody = ({
  validatorAddress,
  tab,
}: ValidatorDetailsQueryParams) => {
  const navigate = useInternalNavigate();
  const move = useMoveConfig({ shouldRedirect: false });

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/validators/[validatorAddress]/[tab]",
        query: {
          validatorAddress,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [navigate, tab, validatorAddress]
  );

  // TODO
  // if (isLoading) return <Loading />;
  // if (!data) return <ErrorFetching dataName="validator information" />;
  // if (!data.info) return <InvalidValidator />;

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
            {!move.enabled && (
              <CustomTab onClick={handleTabChange(TabIndex.BondedTokenChanges)}>
                Bonded Token Changes
              </CustomTab>
            )}
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
              <VotedProposalsTable />
            </TabPanel>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              <Performance />
            </TabPanel>
            {!move.enabled && (
              <TabPanel p={0} pt={{ base: 2, md: 0 }}>
                <BondedTokenChanges />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </PageContainer>
    </>
  );
};

const ValidatorDetails = () => {
  const router = useRouter();
  // TODO: change to router.query
  const validated = zValidatorDetailsQueryParams.safeParse({
    validatorAddress: "osmovaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep88n0y4",
  });

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_VALIDATOR_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <div>
      {!validated.success ? (
        <InvalidValidator />
      ) : (
        <ValidatorDetailsBody {...validated.data} />
      )}
    </div>
  );
};

export default ValidatorDetails;
