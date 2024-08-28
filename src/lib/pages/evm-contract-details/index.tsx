import { track } from "@amplitude/analytics-browser";
import { Stack, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, trackUseTab } from "lib/amplitude";
import {
  useConvertHexAddress,
  useEvmConfig,
  useInternalNavigate,
} from "lib/app-provider";
import { AssetsSection } from "lib/components/asset";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { useBalanceInfos } from "lib/services/bank";
import {
  useEvmCodesByAddress,
  useEvmContractInfoSequencer,
} from "lib/services/evm";
import type { HexAddr20 } from "lib/types";
import { is0x, isHexWalletAddress, truncate } from "lib/utils";

import { EvmContractDetailsBytecode } from "./components/EvmContractDetailsBytecode";
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
  const { convertHexWalletAddress } = useConvertHexAddress();
  const contractAddressBechAddr = convertHexWalletAddress(contractAddress);

  const {
    data: evmCodesByAddressData,
    isLoading: isEvmCodesByAddressLoading,
    isError: isEvmCodesByAddressError,
  } = useEvmCodesByAddress(contractAddress);
  const { data: evmContractInfoData, isLoading: isEvmContractInfoLoading } =
    useEvmContractInfoSequencer(contractAddress);

  const { totalData: totalAssets = 0 } = useBalanceInfos(
    contractAddressBechAddr
  );

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

  if (isEvmCodesByAddressLoading) return <Loading />;
  if (
    isEvmCodesByAddressError ||
    !evmCodesByAddressData ||
    is0x(evmCodesByAddressData.code)
  )
    return <ErrorFetching dataName="evm contract information" />;

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
            <CustomTab
              onClick={handleTabChange(TabIndex.Assets)}
              count={totalAssets}
            >
              Assets
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Transactions)}>
              Transactions
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt={8}>
              <EvmContractDetailsOverview
                contractAddress={contractAddressBechAddr}
                hash={evmContractInfoData?.hash}
                sender={evmContractInfoData?.sender}
                created={evmContractInfoData?.created}
                isContractInfoLoading={isEvmContractInfoLoading}
                onViewMoreAssets={handleTabChange(TabIndex.Assets)}
              />
            </TabPanel>
            <TabPanel p={0} pt={8}>
              <EvmContractDetailsBytecode code={evmCodesByAddressData.code} />
            </TabPanel>
            <TabPanel p={0}>
              <AssetsSection address={contractAddressBechAddr} />
            </TabPanel>
            <TabPanel p={0}>Transactions</TabPanel>
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
