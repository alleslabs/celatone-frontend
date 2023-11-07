import {
  Flex,
  Heading,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useValidateAddress,
  useWasmConfig,
  useMobile,
  useInternalNavigate,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useContractDetailsTableCounts } from "lib/model/contract";
import { useAccountId } from "lib/services/accountService";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam, jsonPrettify } from "lib/utils";

import { CommandSection } from "./components/CommandSection";
import { ContractDesc } from "./components/contract-description";
import { ContractStates } from "./components/contract-state";
import { ContractTop } from "./components/ContractTop";
import { InstantiateInfo } from "./components/InstantiateInfo";
import { JsonInfo } from "./components/JsonInfo";
import {
  RelatedProposalsTable,
  TxsTable,
  MigrationTable,
} from "./components/tables";
import { TokenSection } from "./components/TokenSection";
import { useContractData } from "./data";
import type { ContractData } from "./types";

const tableTabHeaderId = "contractDetailTab";

enum TabIndex {
  Overview = "overview",
  Assets = "assets",
  Txs = "txs",
  States = "states",
}

interface ContractDetailsBodyProps {
  contractAddress: ContractAddr;
  contractData: ContractData;
}

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const ContractTxsTable = observer(
  ({ contractAddress, contractData }: ContractDetailsBodyProps) => {
    const tableHeaderId = "contractDetailsTableHeader";
    const { data: contractAccountId } = useAccountId(contractAddress);
    const {
      tableCounts,
      refetchMigration,
      refetchTransactions,
      refetchRelatedProposals,
    } = useContractDetailsTableCounts(contractAddress, contractAccountId);
    if (!contractData.contractDetail) return <InvalidContract />;
    return (
      <Flex direction="column" gap={6}>
        {/* History Table section */}
        <Heading as="h6" variant="h6" id={tableHeaderId}>
          Transaction & History
        </Heading>
        <Tabs isLazy lazyBehavior="keepMounted">
          <TabList
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX={{ base: "scroll", md: "auto" }}
          >
            <CustomTab count={tableCounts.transactionsCount}>
              Transactions
            </CustomTab>
            <CustomTab count={tableCounts.migrationCount}>Migrations</CustomTab>
            <CustomTab
              count={tableCounts.relatedProposalsCount}
              whiteSpace="nowrap"
            >
              Related Proposals
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <TxsTable
                contractAccountId={contractAccountId}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.transactionsCount}
                refetchCount={refetchTransactions}
              />
            </TabPanel>
            <TabPanel p={0}>
              <MigrationTable
                contractAddress={contractAddress}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.migrationCount}
                refetchCount={refetchMigration}
              />
            </TabPanel>
            <TabPanel p={0}>
              <RelatedProposalsTable
                contractAddress={contractAddress}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.relatedProposalsCount}
                refetchCount={refetchRelatedProposals}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    );
  }
);

const ContractDetailsBody = observer(
  ({ contractAddress, contractData }: ContractDetailsBodyProps) => {
    const tableHeaderId = "contractDetailsTableHeader";
    const isMobile = useMobile();
    const router = useRouter();
    const tab = getFirstQueryParam(router.query.tab) as TabIndex;
    const navigate = useInternalNavigate();
    const handleTabChange = useCallback(
      (nextTab: TabIndex) => () => {
        if (nextTab === tab) return;
        navigate({
          pathname: "/contracts/[contractAddress]/[tab]",
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
    useEffect(() => {
      if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
        navigate({
          replace: true,
          pathname: "/contracts/[contractAddress]/[tab]",
          query: {
            contractAddress,
            tab: TabIndex.Overview,
          },
          options: {
            shallow: true,
          },
        });
      }
    }, [router.isReady, tab, contractAddress, navigate]);

    if (!contractData.contractDetail) return <InvalidContract />;

    return (
      <>
        <ContractTop contractAddress={contractAddress} {...contractData} />
        <Tabs index={Object.values(TabIndex).indexOf(tab)} isLazy>
          <TabList
            mt={6}
            mb={8}
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX="scroll"
            id={tableTabHeaderId}
          >
            <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
              Overview
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Assets)}>
              Assets
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Txs)}>
              Transaction & History
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.States)}>
              Contract States
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Flex flexDirection="column" gap={8}>
                {/* Contract Description Section */}
                <ContractDesc {...contractData} />
                {/* Tokens Section */}
                <TokenSection
                  contractAddress={contractAddress}
                  {...contractData}
                  onViewMore={handleTabChange(TabIndex.Assets)}
                />
                {/* Query/Execute commands section */}
                <CommandSection
                  contractAddress={contractAddress}
                  codeHash={contractData.contractDetail.codeHash}
                  codeId={contractData.contractDetail.codeId.toString()}
                />
                {/* Instantiate/Contract Info Section */}
                <Flex direction="column" gap={6}>
                  {!isMobile && (
                    <Heading as="h6" variant="h6" minW="fit-content">
                      Contract Information
                    </Heading>
                  )}
                  <Flex
                    mb={12}
                    justify="space-between"
                    direction={{ base: "column", md: "row" }}
                  >
                    {/* Instantiate Info */}
                    <div>
                      {isMobile && (
                        <Heading as="h6" variant="h6" mb={6} id={tableHeaderId}>
                          Instantiate Info
                        </Heading>
                      )}
                      <InstantiateInfo
                        isLoading={
                          contractData.isContractDetailLoading ||
                          contractData.isContractCw2InfoLoading ||
                          contractData.isInstantiateDetailLoading
                        }
                        {...contractData}
                      />
                      <Button
                        size="sm"
                        variant="outline-primary"
                        mt={4}
                        pr={1}
                        onClick={handleTabChange(TabIndex.States)}
                      >
                        View Contract States
                        <CustomIcon name="chevron-right" boxSize={3} />
                      </Button>
                    </div>
                    <Flex
                      direction="column"
                      flex={0.8}
                      gap={4}
                      mt={{ base: 12, md: 0 }}
                    >
                      <JsonInfo
                        header="Contract Info"
                        jsonString={jsonPrettify(
                          JSON.stringify(
                            contractData.rawContractResponse?.contract_info ??
                              {}
                          )
                        )}
                        isLoading={contractData.isRawContractResponseLoading}
                      />
                      <JsonInfo
                        header="Instantiate Message"
                        jsonString={jsonPrettify(contractData.initMsg ?? "")}
                        isLoading={contractData.isInstantiateDetailLoading}
                        defaultExpand
                      />
                    </Flex>
                  </Flex>
                </Flex>
                <ContractTxsTable
                  contractAddress={contractAddress}
                  contractData={contractData}
                />
              </Flex>
            </TabPanel>
            <TabPanel p={0}>
              <TokenSection
                contractAddress={contractAddress}
                isDetailPage
                {...contractData}
              />
            </TabPanel>
            <TabPanel p={0}>
              <ContractTxsTable
                contractAddress={contractAddress}
                contractData={contractData}
              />
            </TabPanel>
            <TabPanel p={0}>
              <ContractStates contractAddress={contractAddress} />
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
  const contractAddressParam = getFirstQueryParam(
    router.query.contractAddress
  ) as ContractAddr;
  const contractData = useContractData(contractAddressParam);

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_CONTRACT_DETAIL);
  }, [router.isReady]);

  if (contractData.isContractDetailLoading) return <Loading withBorder />;
  return (
    <PageContainer>
      {validateContractAddress(contractAddressParam) ? (
        <InvalidContract />
      ) : (
        <ContractDetailsBody
          contractAddress={contractAddressParam}
          contractData={contractData}
        />
      )}
    </PageContainer>
  );
});

export default ContractDetails;
