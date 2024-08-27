import { track } from "@amplitude/analytics-browser";
import { Stack, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, trackUseTab } from "lib/amplitude";
import { useEvmConfig, useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { InvalidState } from "lib/components/state";
import type { HexAddr20 } from "lib/types";
import { isHexWalletAddress, truncate } from "lib/utils";

import { EvmContractDetailsOverview } from "./components/EvmContractDetailsOverview";
import { EvmContractDetailsTop } from "./components/EvmContractDetailsTop";
import { TabIndex, zEvmContractDetailsQueryParams } from "./types";

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const tableHeaderId = "evmContractDetailsTab";

interface EvmContractDetailsBodyProps {
  contractAddress: HexAddr20;
  tab: TabIndex;
}

const EvmContractDetailsBody = ({
  contractAddress,
  tab,
}: EvmContractDetailsBodyProps) => {
  const navigate = useInternalNavigate();

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/evm-contracts/[contractAddress]/[tab]",
        query: {
          contractAddress,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [contractAddress, tab, navigate]
  );

  return (
    <>
      <CelatoneSeo pageName={`EVM Contract – ${truncate(contractAddress)}`} />
      <Stack gap={6}>
        <EvmContractDetailsTop contractAddress={contractAddress} />
        <Tabs
          index={Object.values(TabIndex).indexOf(tab)}
          isLazy
          lazyBehavior="keepMounted"
        >
          <TabList
            borderBottom="1px solid"
            borderColor="gray.700"
            id={tableHeaderId}
          >
            <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
              Overview
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Contract)}>
              Contract
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Assets)}>
              Assets
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Transactions)}>
              Transactions
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <EvmContractDetailsOverview />
            </TabPanel>
            <TabPanel px={0}>Contract</TabPanel>
            <TabPanel px={0}>Assets</TabPanel>
            <TabPanel px={0}>Transactions</TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </>
  );
};

export const EvmContractDetails = () => {
  useEvmConfig({ shouldRedirect: true });
  const router = useRouter();

  const validated = zEvmContractDetailsQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_CONTRACT_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      {!validated.success ||
      !isHexWalletAddress(validated.data.contractAddress) ? (
        <InvalidContract />
      ) : (
        <EvmContractDetailsBody {...validated.data} />
      )}
    </PageContainer>
  );
};
