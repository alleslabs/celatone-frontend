import {
  Button,
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import {
  useGovConfig,
  useInternalNavigate,
  useMobile,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import { AssetsSection } from "lib/components/asset";
import { CustomTab } from "lib/components/CustomTab";
import { DelegationsSection } from "lib/components/delegations";
import { CustomIcon } from "lib/components/icon";
import { JsonInfo } from "lib/components/json/JsonInfo";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useAccountDelegationInfos } from "lib/model/account";
import { useBalances } from "lib/services/bank";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import type { BechAddr32 } from "lib/types";
import { jsonPrettify, truncate } from "lib/utils";

import { CommandSection } from "./components/command-section";
import { ContractDesc } from "./components/contract-description";
import { ContractStates } from "./components/contract-states";
import { ContractTop } from "./components/ContractTop";
import { ContractVerificationSection } from "./components/ContractVerificationSection";
import { InstantiateInfo } from "./components/InstantiateInfo";
import { ContractTables } from "./components/tables";
import { useContractDataWithLocalInfos } from "./data";
import { TabIndex, zContractDetailsQueryParams } from "./types";

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const tableHeaderId = "contractDetailsTab";

interface ContractDetailsBodyProps {
  contractAddress: BechAddr32;
  tab: TabIndex;
}

const ContractDetailsBody = observer(
  ({ contractAddress, tab }: ContractDetailsBodyProps) => {
    const isMobile = useMobile();
    const navigate = useInternalNavigate();
    const gov = useGovConfig({ shouldRedirect: false });

    // ------------------------------------------//
    // ------------------QUERIES-----------------//
    // ------------------------------------------//
    const {
      codeLocalInfo,
      contractLocalInfo,
      data: contractData,
      isLoading,
    } = useContractDataWithLocalInfos(contractAddress);

    const { data: balances, isLoading: isBalancesLoading } =
      useBalances(contractAddress);

    const { isTotalBondedLoading, totalBonded } =
      useAccountDelegationInfos(contractAddress);

    const {
      data: derivedWasmVerifyInfo,
      isLoading: isDerivedWasmVerifyInfoLoading,
    } = useDerivedWasmVerifyInfo(
      contractData?.contract.codeId,
      contractData?.contract.codeHash
    );
    // ------------------------------------------//
    // -----------------CALLBACKS----------------//
    // ------------------------------------------//
    const handleTabChange = useCallback(
      (nextTab: TabIndex) => () => {
        if (nextTab === tab) return;
        trackUseTab(nextTab);
        navigate({
          options: {
            shallow: true,
          },
          pathname: "/contracts/[contractAddress]/[tab]",
          query: {
            contractAddress,
            tab: nextTab,
          },
        });
      },
      [contractAddress, tab, navigate]
    );

    if (isLoading || isDerivedWasmVerifyInfoLoading)
      return <Loading withBorder />;
    if (!contractData) return <ErrorFetching dataName="contract information" />;

    const { contract, contractRest, projectInfo, publicInfo } = contractData;

    const hasTotalBonded =
      !isTotalBondedLoading &&
      totalBonded &&
      Object.keys(totalBonded).length === 0;

    return (
      <>
        <CelatoneSeo pageName={`Contract – ${truncate(contractAddress)}`} />
        <ContractTop
          contract={contract}
          contractAddress={contractAddress}
          contractLocalInfo={contractLocalInfo}
          projectInfo={projectInfo}
          publicInfo={publicInfo}
          wasmVerifyInfo={derivedWasmVerifyInfo}
        />
        <Tabs
          index={Object.values(TabIndex).indexOf(tab)}
          isLazy
          lazyBehavior="keepMounted"
        >
          <TabList
            id={tableHeaderId}
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX="scroll"
          >
            <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
              Overview
            </CustomTab>
            <CustomTab
              isDisabled={balances?.length === 0}
              count={balances?.length}
              isLoading={isBalancesLoading}
              onClick={handleTabChange(TabIndex.Assets)}
            >
              Assets
            </CustomTab>
            <CustomTab
              hidden={!gov.enabled}
              isDisabled={hasTotalBonded}
              onClick={handleTabChange(TabIndex.Delegations)}
            >
              Delegations
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.TxsHistories)}>
              Transactions & Histories
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.States)}>
              Contract States
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt={{ base: 0, md: 8 }}>
              <Flex gap={8} flexDirection="column">
                <Flex gap={4} mt={{ base: 4, md: 0 }} direction="column">
                  {(publicInfo || contractLocalInfo) && (
                    <ContractDesc
                      contract={contract}
                      contractLocalInfo={contractLocalInfo}
                      publicInfo={publicInfo}
                    />
                  )}
                  <ContractVerificationSection
                    codeHash={contract.codeHash}
                    codeId={contract.codeId}
                    contractAddress={contractAddress}
                    wasmVerifyInfo={derivedWasmVerifyInfo}
                  />
                  <CommandSection
                    codeHash={contract.codeHash}
                    codeId={contract.codeId}
                    contractAddress={contractAddress}
                    wasmVerifyInfo={derivedWasmVerifyInfo}
                  />
                  <Flex
                    borderBottom={{ base: "0px", md: "1px solid" }}
                    borderBottomColor={{ base: "transparent", md: "gray.700" }}
                  >
                    <AssetsSection
                      address={contractAddress}
                      onViewMore={handleTabChange(TabIndex.Assets)}
                    />
                  </Flex>
                  {gov.enabled && (
                    <Flex
                      borderBottom={{ base: "0px", md: "1px solid" }}
                      borderBottomColor={{
                        base: "transparent",
                        md: "gray.700",
                      }}
                    >
                      <DelegationsSection
                        address={contractAddress}
                        onViewMore={handleTabChange(TabIndex.Delegations)}
                      />
                    </Flex>
                  )}
                </Flex>
                {/* Instantiate/Contract Info Section */}
                <Flex gap={6} direction="column">
                  {!isMobile && (
                    <Heading as="h6" minW="fit-content" variant="h6">
                      Contract Information
                    </Heading>
                  )}
                  <Flex
                    justify="space-between"
                    mb={12}
                    direction={{ base: "column", md: "row" }}
                  >
                    {/* Instantiate Info */}
                    <div>
                      {isMobile && (
                        <Heading as="h6" mb={6} variant="h6">
                          Instantiate Info
                        </Heading>
                      )}
                      <InstantiateInfo
                        codeLocalInfo={codeLocalInfo}
                        contract={contract}
                        contractRest={contractRest}
                        wasmVerifyInfo={derivedWasmVerifyInfo}
                      />
                      <Button
                        mt={4}
                        pr={1}
                        size="sm"
                        variant="outline-primary"
                        onClick={handleTabChange(TabIndex.States)}
                      >
                        View Contract States
                        <CustomIcon name="chevron-right" boxSize={3} />
                      </Button>
                    </div>
                    <Flex
                      flex={0.8}
                      gap={4}
                      mt={{ base: 12, md: 0 }}
                      direction="column"
                    >
                      <JsonInfo
                        header="Contract Info"
                        jsonString={jsonPrettify(
                          JSON.stringify(contractRest?.contract_info ?? {})
                        )}
                      />
                      <JsonInfo
                        defaultExpand
                        header="Instantiate Message"
                        jsonString={jsonPrettify(contract.initMsg)}
                      />
                    </Flex>
                  </Flex>
                </Flex>
                <ContractTables contractAddress={contractAddress} />
              </Flex>
              <UserDocsLink
                cta="Read more about Contract Details"
                title="What is Contract in CosmWasm?"
                href="cosmwasm/contracts/detail-page"
              />
            </TabPanel>
            <TabPanel p={0}>
              <AssetsSection address={contractAddress} />
              <UserDocsLink
                cta="Read more about Assets"
                title="What is Supported and Unsupported Assets? "
                href="cosmwasm/contracts/detail-page#assets"
              />
            </TabPanel>
            <TabPanel pt={{ base: 0, md: 5 }} px={0}>
              <DelegationsSection address={contractAddress} />
              <UserDocsLink
                cta="Read more about Delegations"
                title="What is Delegations, Total Bonded, Rewards?"
                href="cosmwasm/contracts/detail-page#delegations"
              />
            </TabPanel>
            <TabPanel pt={5} px={0}>
              <ContractTables contractAddress={contractAddress} />
              <UserDocsLink
                cta="Read more about Transactions & Histories"
                title="What is transactions related to the contract?"
                href="cosmwasm/contracts/detail-page#transactions-and-histories"
              />
            </TabPanel>
            <TabPanel pt={5} px={0}>
              <ContractStates contractAddress={contractAddress} />
              <UserDocsLink
                cta="Read more about Contract States"
                title="What is contract states?"
                href="cosmwasm/contracts/detail-page#contract-states"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
  }
);

const ContractDetails = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const { validateContractAddress } = useValidateAddress();

  const validated = zContractDetailsQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_CONTRACT_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      {!validated.success ||
      validateContractAddress(validated.data.contractAddress) ? (
        <InvalidContract />
      ) : (
        <ContractDetailsBody {...validated.data} />
      )}
    </PageContainer>
  );
});

export default ContractDetails;
