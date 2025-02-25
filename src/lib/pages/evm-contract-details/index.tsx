import { track } from "@amplitude/analytics-browser";
import { Stack, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, trackUseTab } from "lib/amplitude";
import {
  useConvertHexAddress,
  useEvmConfig,
  useInternalNavigate,
  useMobile,
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
  useGetEvmProxyTarget,
} from "lib/services/evm";
import { useEvmTxHashByCosmosTxHash } from "lib/services/tx";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
import type { HexAddr20 } from "lib/types";
import { isHexWalletAddress, toChecksumAddress, truncate } from "lib/utils";

import { EvmContractDetailsContractInfo } from "./components/evm-contract-details-contract-info";
import { EvmContractDetailsOverview } from "./components/evm-contract-details-overview";
import { EvmContractDetailsTop } from "./components/EvmContractDetailsTop";
import { EvmContractDetailsTxs } from "./components/EvmContractDetailsTxs";
import { InteractEvmContract } from "./components/interact-evm-contract";
import type { InteractTabsIndex } from "./types";
import { TabIndex, TxsTabIndex, zEvmContractDetailsQueryParams } from "./types";

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const tableHeaderId = "evmContractDetailsTab";

interface EvmContractDetailsBodyProps {
  contractAddress: HexAddr20;
  tab: TabIndex;
  selectedType: InteractTabsIndex;
  selectedFn?: string;
}

const EvmContractDetailsBody = ({
  contractAddress,
  tab,
  selectedType,
  selectedFn,
}: EvmContractDetailsBodyProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { convertHexWalletAddress } = useConvertHexAddress();
  const contractAddressBechAddr = convertHexWalletAddress(contractAddress);

  const { data: evmCodesByAddressData, isLoading: isEvmCodesByAddressLoading } =
    useEvmCodesByAddress(contractAddress);
  const { data: evmContractInfoData, isLoading: isEvmContractInfoLoading } =
    useEvmContractInfoSequencer(contractAddress);
  const { data: evmVerifyInfos, isFetching: isEvmVerifyInfoFetching } =
    useEvmVerifyInfos([contractAddress]);
  const evmVerifyInfo =
    evmVerifyInfos?.[contractAddress.toLowerCase()] ?? undefined;

  const { data: proxyTarget, isLoading: isProxyTargetLoading } =
    useGetEvmProxyTarget(contractAddress);
  const {
    data: proxyTargetEvmVerifyInfos,
    isFetching: isProxyTargetEvmVerifyInfoFetching,
  } = useEvmVerifyInfos(proxyTarget ? [proxyTarget.target] : []);
  const proxyTargetEvmVerifyInfo =
    proxyTargetEvmVerifyInfos?.[proxyTarget?.target.toLowerCase() ?? ""] ??
    undefined;

  const { data: evmHash } = useEvmTxHashByCosmosTxHash(
    evmContractInfoData?.hash
  );

  const { totalData: totalAssets = 0 } = useBalanceInfos(
    contractAddressBechAddr
  );

  const [overviewTabIndex, setOverviewTabIndex] = useState(TxsTabIndex.Cosmos);
  const [tableTabIndex, setTableTabIndex] = useState(TxsTabIndex.Cosmos);

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

  const handleOnViewMoreTxs = useCallback(() => {
    setTableTabIndex(overviewTabIndex);
    handleTabChange(TabIndex.Transactions)();
  }, [handleTabChange, overviewTabIndex]);

  if (
    isEvmCodesByAddressLoading ||
    isEvmVerifyInfoFetching ||
    isProxyTargetLoading ||
    isProxyTargetEvmVerifyInfoFetching
  )
    return <Loading />;
  if (!evmCodesByAddressData)
    return <ErrorFetching dataName="evm contract information" />;
  if (!evmCodesByAddressData.code) return <InvalidContract />;

  return (
    <>
      <CelatoneSeo pageName={`EVM Contract – ${truncate(contractAddress)}`} />
      <Stack gap={6}>
        <EvmContractDetailsTop
          contractAddress={contractAddress}
          evmVerifyInfo={evmVerifyInfo}
          proxyTargetAddress={proxyTarget?.target ?? undefined}
          proxyTargetEvmVerifyInfo={proxyTargetEvmVerifyInfo}
        />
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
            <CustomTab onClick={handleTabChange(TabIndex.Contract)}>
              Contract
            </CustomTab>
            <CustomTab
              onClick={handleTabChange(TabIndex.ReadWrite)}
              hidden={
                !evmVerifyInfo?.isVerified &&
                !proxyTargetEvmVerifyInfo?.isVerified
              }
            >
              {isMobile ? "Read" : "Read/Write"}
            </CustomTab>
            <CustomTab
              onClick={handleTabChange(TabIndex.Assets)}
              count={totalAssets}
              isDisabled={!totalAssets}
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
                contractAddressBech={contractAddressBechAddr}
                contractAddressHex={contractAddress}
                hash={evmContractInfoData?.hash}
                evmHash={evmHash}
                sender={evmContractInfoData?.sender}
                created={evmContractInfoData?.created}
                isContractInfoLoading={isEvmContractInfoLoading}
                onViewMoreAssets={handleTabChange(TabIndex.Assets)}
                onViewMoreTxs={handleOnViewMoreTxs}
                tab={overviewTabIndex}
                setTab={setOverviewTabIndex}
                evmVerifyInfo={evmVerifyInfo}
                proxyTargetEvmVerifyInfo={proxyTargetEvmVerifyInfo}
              />
            </TabPanel>
            <TabPanel p={0} pt={8}>
              <EvmContractDetailsContractInfo
                byteCode={evmContractInfoData?.code}
                deployedByteCode={evmCodesByAddressData.code}
                contractAddress={contractAddress}
                evmVerifyInfo={evmVerifyInfo}
              />
            </TabPanel>
            <TabPanel p={0} pt={8}>
              <InteractEvmContract
                contractAddress={contractAddress}
                evmVerifyInfo={evmVerifyInfo}
                proxyTargetEvmVerifyInfo={proxyTargetEvmVerifyInfo}
                selectedType={selectedType}
                selectedFn={selectedFn}
              />
            </TabPanel>
            <TabPanel p={0}>
              <AssetsSection address={contractAddressBechAddr} />
            </TabPanel>
            <TabPanel p={0} pt={8}>
              <EvmContractDetailsTxs
                address={contractAddressBechAddr}
                tab={tableTabIndex}
                setTab={setTableTabIndex}
              />
            </TabPanel>
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
      track(AmpEvent.TO_EVM_CONTRACT_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      {!validated.success ||
      !isHexWalletAddress(validated.data.contractAddress) ? (
        <InvalidContract />
      ) : (
        <EvmContractDetailsBody
          {...validated.data}
          contractAddress={toChecksumAddress(validated.data.contractAddress)}
        />
      )}
    </PageContainer>
  );
};
