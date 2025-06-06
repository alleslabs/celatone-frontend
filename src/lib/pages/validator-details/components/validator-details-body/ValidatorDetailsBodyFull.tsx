import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { trackUseTab } from "lib/amplitude";
import { useInitia, useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import { useStakingParamsRest } from "lib/services/staking";
import { useValidatorData } from "lib/services/validator";
import { useCallback } from "react";

import type { ValidatorDetailsQueryParams } from "../../types";

import { TabIndex } from "../../types";
import { BondedTokenChanges } from "../bonded-token-changes";
import { Performance } from "../performance";
import { VotedProposalsTable } from "../tables";
import { ValidatorOverview } from "../validator-overview";
import { ValidatorTop } from "../validator-top";

export const ValidatorDetailsBodyFull = ({
  tab,
  validatorAddress,
}: ValidatorDetailsQueryParams) => {
  const navigate = useInternalNavigate();
  const isInitia = useInitia();

  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos, isLoading: isMovePoolInfosLoading } =
    useMovePoolInfos({
      withPrices: true,
    });
  const { data: stakingParams, isFetching: isStakingParamsLoading } =
    useStakingParamsRest(!isInitia);
  const { data, isLoading } = useValidatorData(validatorAddress);

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        options: {
          shallow: true,
        },
        pathname: "/validators/[validatorAddress]/[tab]",
        query: {
          tab: nextTab,
          validatorAddress,
        },
      });
    },
    [navigate, tab, validatorAddress]
  );

  if (
    isLoading ||
    isStakingParamsLoading ||
    isAssetInfosLoading ||
    isMovePoolInfosLoading
  )
    return <Loading />;
  if (!data) return <ErrorFetching dataName="validator information" />;
  if (!data.info) return <InvalidState title="Validator does not exist" />;

  return (
    <>
      <CelatoneSeo
        pageName={
          data.info.moniker
            ? `${data.info.moniker} (Validator)`
            : "Validator detail"
        }
      />
      <PageHeaderContainer bgColor="transparent">
        <ValidatorTop
          info={data.info}
          singleStakingDenom={stakingParams?.bondDenom}
          totalVotingPower={data.totalVotingPower}
        />
      </PageHeaderContainer>
      <PageContainer>
        <Tabs
          index={Object.values(TabIndex).indexOf(tab)}
          isLazy
          lazyBehavior="keepMounted"
        >
          <TabList
            borderBottomWidth="1px"
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
            <CustomTab onClick={handleTabChange(TabIndex.BondedTokenChanges)}>
              Bonded token changes
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              <ValidatorOverview
                assetInfos={assetInfos}
                details={data.info.details}
                isActive={data.info.isActive}
                isJailed={data.info.isJailed}
                selfVotingPower={data.selfVotingPower}
                singleStakingDenom={stakingParams?.bondDenom}
                totalVotingPower={data.totalVotingPower}
                validatorAddress={validatorAddress}
                votingPower={data.info.votingPower}
                onSelectBondedTokenChanges={handleTabChange(
                  TabIndex.BondedTokenChanges
                )}
                onSelectPerformance={handleTabChange(TabIndex.Performance)}
                onSelectVotes={handleTabChange(TabIndex.Votes)}
              />
            </TabPanel>
            <TabPanel p={0} pt={6}>
              <VotedProposalsTable validatorAddress={validatorAddress} />
            </TabPanel>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              <Performance validatorAddress={validatorAddress} />
            </TabPanel>
            <TabPanel p={0} pt={{ base: 2, md: 0 }}>
              <BondedTokenChanges
                assetInfos={assetInfos}
                movePoolInfos={movePoolInfos}
                singleStakingDenom={stakingParams?.bondDenom}
                validatorAddress={validatorAddress}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <UserDocsLink
          cta="Read more about Validator Details"
          href="general/validators/detail-page"
          title="What is a Validator?"
        />
      </PageContainer>
    </>
  );
};
