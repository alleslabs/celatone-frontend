import type { HexAddr20 } from "lib/types";

import { track } from "@amplitude/analytics-browser";
import { Stack, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
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
import { isHexWalletAddress, toChecksumAddress, truncate } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import type { InteractTabsIndex } from "./types";

import { TxsTable } from "../contract-details/components/tables/txs";
import { EvmContractDetailsContractInfo } from "./components/evm-contract-details-contract-info";
import { EvmContractDetailsOverview } from "./components/evm-contract-details-overview";
import { EvmContractDetailsTop } from "./components/EvmContractDetailsTop";
import { HoldersSection } from "./components/holders-section";
import { InteractEvmContract } from "./components/interact-evm-contract";
import { TabIndex, zEvmContractDetailsQueryParams } from "./types";

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const tableHeaderId = "evmContractDetailsTab";

interface EvmContractDetailsBodyProps {
  contractAddress: HexAddr20;
  selectedFn?: string;
  selectedType: InteractTabsIndex;
  tab: TabIndex;
}

const EvmContractDetailsBody = ({
  contractAddress,
  selectedFn,
  selectedType,
  tab,
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

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        options: {
          shallow: true,
        },
        pathname: "/evm-contracts/[contractAddress]/[tab]",
        query: {
          contractAddress,
          tab: nextTab,
        },
      });
    },
    [contractAddress, tab, navigate]
  );

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
            id={tableHeaderId}
            borderBottomWidth="1px"
            borderColor="gray.700"
            overflowX="scroll"
          >
            <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
              Overview
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Contract)}>
              Contract
            </CustomTab>
            <CustomTab
              hidden={
                !evmVerifyInfo?.isVerified &&
                !proxyTargetEvmVerifyInfo?.isVerified
              }
              onClick={handleTabChange(TabIndex.ReadWrite)}
            >
              {isMobile ? "Read" : "Read/Write"}
            </CustomTab>
            <CustomTab
              count={totalAssets}
              isDisabled={!totalAssets}
              onClick={handleTabChange(TabIndex.Assets)}
            >
              Assets
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Transactions)}>
              Transactions
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Holders)}>
              Holders
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt={8}>
              <EvmContractDetailsOverview
                contractAddressBech={contractAddressBechAddr}
                contractAddressHex={contractAddress}
                created={evmContractInfoData?.created}
                evmHash={evmHash}
                evmVerifyInfo={evmVerifyInfo}
                hash={evmContractInfoData?.hash}
                isContractInfoLoading={isEvmContractInfoLoading}
                proxyTargetEvmVerifyInfo={proxyTargetEvmVerifyInfo}
                sender={evmContractInfoData?.sender}
                onViewMoreAssets={handleTabChange(TabIndex.Assets)}
                onViewMoreTxs={handleTabChange(TabIndex.Transactions)}
              />
            </TabPanel>
            <TabPanel p={0} pt={8}>
              <EvmContractDetailsContractInfo
                byteCode={evmContractInfoData?.code}
                contractAddress={contractAddress}
                deployedByteCode={evmCodesByAddressData.code}
                evmVerifyInfo={evmVerifyInfo}
              />
            </TabPanel>
            <TabPanel p={0} pt={8}>
              <InteractEvmContract
                contractAddress={contractAddress}
                evmVerifyInfo={evmVerifyInfo}
                proxyTargetEvmVerifyInfo={proxyTargetEvmVerifyInfo}
                selectedFn={selectedFn}
                selectedType={selectedType}
              />
            </TabPanel>
            <TabPanel p={0}>
              <AssetsSection address={contractAddressBechAddr} />
            </TabPanel>
            <TabPanel p={0} pt={8}>
              <TxsTable contractAddress={contractAddressBechAddr} />
            </TabPanel>
            <TabPanel p={0} pt={8}>
              <HoldersSection contractAddress={contractAddress} />
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
