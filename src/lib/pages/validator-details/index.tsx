import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import {
  useCelatoneApp,
  useGovConfig,
  useInternalNavigate,
  useMoveConfig,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { useAssetInfos } from "lib/services/assetService";
import { useValidatorData } from "lib/services/validatorService";

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
  const {
    chainConfig: {
      extra: { singleStakingDenom },
    },
  } = useCelatoneApp();
  const move = useMoveConfig({ shouldRedirect: false });

  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: true,
  });
  const { data, isLoading } = useValidatorData(validatorAddress);

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

  if (isLoading || isAssetInfosLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="validator information" />;
  if (!data.info) return <InvalidValidator />;

  return (
    <>
      <PageHeaderContainer bgColor="success.background">
        <ValidatorTop
          info={data.info}
          totalVotingPower={data.totalVotingPower}
          singleStakingDenom={singleStakingDenom}
        />
      </PageHeaderContainer>
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
                validatorAddress={validatorAddress}
                onSelectVotes={handleTabChange(TabIndex.Votes)}
                onSelectPerformance={handleTabChange(TabIndex.Performance)}
                onSelectBondedTokenChanges={handleTabChange(
                  TabIndex.BondedTokenChanges
                )}
                isActive={data.info.isActive}
                isJailed={data.info.isJailed}
                details={data.info.details}
                singleStakingDenom={singleStakingDenom}
                assetInfos={assetInfos}
                votingPower={data.info.votingPower}
                totalVotingPower={data.totalVotingPower}
                selfVotingPower={data.selfVotingPower}
              />
            </TabPanel>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              <VotedProposalsTable />
            </TabPanel>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              <Performance validatorAddress={validatorAddress} />
            </TabPanel>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              <BondedTokenChanges
                validatorAddress={validatorAddress}
                singleStakingDenom={singleStakingDenom}
                assetInfos={assetInfos}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </PageContainer>
    </>
  );
};

const ValidatorDetails = () => {
  const router = useRouter();
  useGovConfig({ shouldRedirect: true });

  const validated = zValidatorDetailsQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_VALIDATOR_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      {!validated.success ? (
        <InvalidValidator />
      ) : (
        <ValidatorDetailsBody {...validated.data} />
      )}
    </>
  );
};

export default ValidatorDetails;
